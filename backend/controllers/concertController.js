import Razorpay from 'razorpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db.js';
import { updateConcertTicketInCache } from '../index.js';
import dotenv from 'dotenv';
import sendEmail from '../utils/email.js';


dotenv.config();


// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * 1. CREATE RAZORPAY ORDER
 * Frontend sends: { amount, currency }
 */
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, concertId, tier } = req.body;

        // 1. PRE-PAYMENT CHECK: Ticket Availability
        const tierDetails = await prisma.concertTierDetails.findUnique({
            where: {
                concertId_tier: {
                    concertId: concertId,
                    tier: tier,
                }
            }
        });

        if (!tierDetails) {
            return res.status(404).json({ error: "Invalid ticket tier or concert" });
        }

        if (tierDetails.ticketsSold >= tierDetails.ticketLimit) {
            return res.status(422).json({ error: "Sorry, this category is sold out." });
        }

        // 2. Create Razorpay Order
        const options = {
            amount: amount * 100, // Convert to paise (e.g. 500 -> 50000)
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-8)}`,
            notes: {
                concertId: concertId,
                tier: tier
            }
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ error: "Could not initiate payment" });
    }
};


/**
 * Checks and updates the overall sold-out status of a concert.
 * @param {string} concertId - The ID of the concert to check.
 */
async function updateSoldOutStatus(concertId) {
    const allTiers = await prisma.concertTierDetails.findMany({
        where: { concertId: concertId }
    });

    const allSoldOut = allTiers.every(t => t.ticketsSold >= t.ticketLimit);

    if (allSoldOut) {
        await prisma.concert.update({
            where: { id: concertId },
            data: { soldOut: true }
        });
        console.log(`CONCERT ${concertId} IS NOW COMPLETELY SOLD OUT`);
    }
}


/**
 * 2. VERIFY PAYMENT & CREATE TICKET (GUEST MODE)
 * Frontend sends: Payment details + Guest Name/Email/Phone
 */
export const verifyGuestPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            concertId,
            tier,
            price,
            name,
            email,
            phone
        } = req.body;

        // A. Security Check: Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid Payment Signature" });
        }

        // B. Check for Ticket Availability (as a preliminary check)
        const tierDetails = await prisma.concertTierDetails.findUnique({
            where: {
                concertId_tier: {
                    concertId: concertId,
                    tier: tier,
                }
            }
        });

        if (!tierDetails) {
            return res.status(404).json({ error: "Invalid ticket tier or concert" });
        }

        if (tierDetails.ticketsSold >= tierDetails.ticketLimit) {
             // Note: This check is not fully race-condition proof under high load
            return res.status(422).json({ error: "Sorry, this category is sold out." });
        }

        // C. Check if ticket already exists (Idempotency)
        const existingTicket = await prisma.concertTicket.findUnique({
            where: { paymentId: razorpay_payment_id }
        });

        if (existingTicket) {
            return res.status(200).json({ message: "Ticket already exists", ticket: existingTicket });
        }
        
        // D. Generate Unique QR Codes
        const arenaCode = `STAR-${uuidv4().slice(0, 6).toUpperCase()}`;

        // E. Create Ticket and Update Counts in an Atomic Transaction
        const ticket = await prisma.$transaction(async (tx) => {
            // 1. Atomically update the count ONLY if a ticket is available
            await tx.concertTierDetails.update({
                where: {
                    concertId_tier: {
                        concertId: concertId,
                        tier: tier,
                    },
                    // This guard prevents overselling. If the condition fails, the transaction will fail.
                    ticketsSold: {
                        lt: tierDetails.ticketLimit
                    }
                },
                data: {
                    ticketsSold: {
                        increment: 1
                    }
                }
            });

            // 2. Create the actual ticket
            const newTicket = await tx.concertTicket.create({
                data: {
                    guestName: name,
                    guestEmail: email,
                    guestPhone: phone,
                    concert: { connect: { id: concertId } },
                    tier: tier,
                    pricePaid: price.toString(),
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature,
                    arenaCode: arenaCode
                }
            });
            
            return newTicket;
        }, {
            timeout: 50000, // Slightly tighter timeout for better resource cycling
            isolationLevel: 'Serializable' // Crucial for preventing double-registrations
        });

        // Post-transaction: Update the concert's overall sold-out status (run in background)
        updateSoldOutStatus(concertId).catch(err => {
            console.error("Failed to update sold out status in background:", err);
        });

        // NEW: Update cache in background
        updateConcertTicketInCache(ticket.id).catch(console.error);

        console.log(`🎟️ Ticket Generated for ${name} (${tier})`);

        // Send confirmation email
        if (email) {
            const concert = await prisma.concert.findUnique({
                where: { id: concertId },
            });

            const subject = 'Your Panache Concert Ticket!';
            const templateData = {
                name: name,
                eventName: "Panache", // Static for now
                artistName: concert?.artistName || "Featured Artist",
                ticketCode: ticket.arenaCode,
                quantity: 1,
                tier: tier,
                date: concert?.dayLabel || "TBA",
                venue: "VGU Campus, Jaipur" // Static for now
            };
            sendEmail(email, subject, 'concertTicket', templateData).catch(console.error);
        }

        res.status(200).json({ 
            status: "success", 
            message: "Booking Confirmed", 
            ticket 
        });

    } catch (error) {
        console.error("Booking Error:", error);
         // Catch the specific error when the atomic update fails (no records found to update)
        if (error.code === 'P2025' || error.code === 'P2028') {
            return res.status(422).json({ error: "Sorry, tickets for this category sold out while you were paying." });
        }
        res.status(500).json({ error: "Payment verified but ticket generation failed. Contact support." });
    }
};

/**
 * 3. FIND LOST TICKET
 * Used by "Find My Ticket" page. Finds all scannable passes for a user.
 */
export const findGuestTicket = async (req, res) => {
    try {
        const { email, phone } = req.body;

        // 1. Find standard concert tickets purchased by the user
        const concertTickets = await prisma.concertTicket.findMany({
            where: {
                guestEmail: email,
                guestPhone: phone
            },
            orderBy: { createdAt: 'desc' },
            include: { concert: true }
        });


        
        // const allDisplayableTickets = [];


        if (concertTickets.length === 0) {
            return res.status(404).json({ error: "No tickets found" });
        }

        res.json(concertTickets);

    } catch (error) {
        console.error("Find Ticket Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};


export const getAllConcerts = async (req, res) => {
    try {
        const concerts = await prisma.concert.findMany({
            orderBy: {
                date: 'asc' // Show earliest concert first
            },
            include: { // Use include to get the full tier details for processing
                tierDetails: true
            }
        });

        // Manually process the tiers to add the 'soldOut' field
        const processedConcerts = concerts.map(concert => {
            const processedTiers = concert.tierDetails.map(tier => ({
                tier: tier.tier,
                price: tier.price,
                ticketLimit: tier.ticketLimit,
                ticketsSold: tier.ticketsSold,
                soldOut: tier.ticketsSold >= tier.ticketLimit // The new derived field
            }));

            return {
                id: concert.id,
                artistName: concert.artistName,
                dayLabel: concert.dayLabel,
                date: concert.date,
                imageUrl: concert.imageUrl,
                soldOut: concert.soldOut,
                tierDetails: processedTiers
            };
        });

        res.status(200).json(processedConcerts);
    } catch (error) {
        console.error("Error fetching concerts:", error);
        res.status(500).json({ error: "Could not load concerts" });
    }
};

export const getConcertById = async (req, res) => {
    try {
        const { id } = req.params;
        const concert = await prisma.concert.findUnique({
            where: { id },
            include: {
                tierDetails: true,
            },
        });

        if (!concert) {
            return res.status(404).json({ error: 'Concert not found' });
        }

        const processedTiers = concert.tierDetails.map(tier => ({
            ...tier,
            soldOut: tier.ticketsSold >= tier.ticketLimit,
        }));

        res.status(200).json({ ...concert, tierDetails: processedTiers });
    } catch (error) {
        console.error(`Error fetching concert ${req.params.id}:`, error);
        res.status(500).json({ error: 'Could not load concert details' });
    }
};
