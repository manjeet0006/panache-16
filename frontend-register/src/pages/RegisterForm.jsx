import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Loader2, Lock, ArrowRight, MessageSquare, ArrowLeft, Plus, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';

// Reusable Sub-components
import InquiryForm from '@/components/InquiryForm';
import SuccessScreen from '@/components/SuccessScreen';
import MemberCard from '@/components/MemberCard';

const RegisterForm = () => {
    const { eventId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Determine user type from URL (?isVgu=true)
    const isVgu = searchParams.get('isVgu') === 'true';

    // --- 1. STATE MANAGEMENT ---
    const [step, setStep] = useState(isVgu ? 'FINAL' : 'CHECK');
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState(null);
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

    const [inquiryData, setInquiryData] = useState({
        name: '', collegeName: '', phone: '', email: ''
    });

    const [formData, setFormData] = useState({
        teamName: '',
        secretCode: '',
        members: [{ name: '', phone: '', enrollment: '', isLeader: true }],
        collegeId: '',
        customCollegeName: '',
        departmentId: ''
    });

    // --- 2. DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventRes, collegeRes, deptRes] = await Promise.all([
                    API.get(`/register/event/${eventId}`),
                    API.get('/meta/colleges'),
                    API.get('/meta/departments')
                ]);
                setEvent(eventRes.data);
                setColleges(collegeRes.data);
                setDepartments(deptRes.data);

                // STRICT LOCK: Auto-set College ID if user is VGU
                if (isVgu) {
                    const vgu = collegeRes.data.find(c => c.isInternal === true);
                    if (vgu) {
                        setFormData(prev => ({ ...prev, collegeId: vgu.id }));
                    }
                }
            } catch (err) {
                toast.error("Failed to load event data.");
                navigate('/');
                window.location.reload();
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId, isVgu, navigate]);


    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Ensure squad meets minPlayer requirement automatically
    useEffect(() => {
        if (event?.minPlayers && formData.members.length < event.minPlayers) {
            const additionalNeeded = event.minPlayers - formData.members.length;
            const extraMembers = Array.from({ length: additionalNeeded }, () => ({
                name: '', phone: '', enrollment: '', isLeader: false
            }));
            setFormData(prev => ({ ...prev, members: [...prev.members, ...extraMembers] }));
        }
    }, [event, formData.members.length]);

    // --- 3. RAZORPAY HANDLER ---
    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        // 1. Basic Validations
        if (formData.members.length < (event?.minPlayers || 1)) return toast.error(`Min players required: ${event.minPlayers}`);
        if (!formData.secretCode) return toast.error("Verification code is mandatory.");

        setLoading(true);

        try {
            // 2. PRE-CHECK: Ask backend if this registration is allowed
            // This prevents the "Double Payment" issue
            await API.post('/register/pre-verify', {
                eventId,
                collegeId: formData.collegeId,
                isVgu,
                secretCode: formData.secretCode,
                departmentId: formData.departmentId
            });

            // 3. If Pre-check passes, proceed to Payment or Final Submission
            if (isVgu && !formData.secretCode.toUpperCase().startsWith('EXT-')) {
                submitRegistration({});
            } else {
                await handlePaymentFlow();
            }
        } catch (err) {
            setLoading(false);
            // Show the specific error: "Your college is already registered"
            toast.error(err.response?.data?.error || "Verification failed");
        }
    };
    const handlePaymentFlow = async () => {
        try {
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey) return toast.error("Configuration Error: Key Missing.");

            const isLoaded = await loadRazorpay();
            if (!isLoaded) return toast.error("Razorpay SDK failed to load.");

            // 1. Create Order
            const orderRes = await API.post('/register/create-order', {
                amount: event?.eventPrice || 499
            });

            const { id, amount, currency } = orderRes.data;

            // 2. Razorpay Options
            const options = {
                key: razorpayKey,
                amount: amount,
                currency: currency,
                name: "Panache 2026",
                description: `Registration for ${event?.name}`,
                order_id: id,
                handler: (res) => {
                    submitRegistration({
                        razorpay_payment_id: res.razorpay_payment_id,
                        razorpay_order_id: res.razorpay_order_id,
                        razorpay_signature: res.razorpay_signature,
                    });
                },
                prefill: {
                    name: formData.members[0].name || "Participant",
                    // STRIP SPACES: Razorpay fails if phone has spaces
                    contact: formData.members[0].phone.replace(/\D/g, ''),
                },
                theme: { color: "#ec4899" },
                modal: { ondismiss: () => setLoading(false) }
            };

            const rzp = new window.Razorpay(options);
             rzp.on('payment.failed', function (response){
                toast.error("Transaction Failed: " + response.error.description);
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            setLoading(false);
            const serverError = err.response?.data?.error;
            toast.error(serverError || "Payment initialization failed.");
        }
    };

    const submitRegistration = async (paymentData) => {
        const payload = { ...formData, ...paymentData, eventId, isVgu };
        const registrationPromise = API.post("/register/register-team", payload);

        toast.promise(registrationPromise, {
            loading: 'Verifying data and securing your slot...',
            success: (res) => {
                flushSync(() => {
                    // 1. Set the data first
                    setRegistrationSuccessData(res.data);
                    // 2. Transition the step
                    setStep("SUCCESS");
                });
                setLoading(false);

                return `Registration Successful!`;
            },
            error: (err) => {
                setLoading(false);
                return err.response?.data?.error || "Registration failed.";
            },
        });
    };
    // --- 4. RENDER LOGIC ---
    if (loading && !registrationSuccessData && step !== 'INQUIRY') {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-pink-500" size={48} />
                <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Securing Slot...</p>
            </div>
        );
    }

    console.log(registrationSuccessData);

    // Optimized render guard
    if (step === 'SUCCESS' && registrationSuccessData?.ticketCode) {
        return (
            <SuccessScreen
                data={registrationSuccessData}
                eventName={event?.name}
                isVgu={isVgu}
                onHome={() => navigate('/')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 text-white">
            <div className="max-w-2xl mx-auto">

                {/* GATEWAY: Code Verification for Outsiders */}
                {!isVgu && step === 'CHECK' && (
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-xl">
                        <Lock className="text-pink-500 mx-auto mb-6" size={40} />
                        <h2 className="text-3xl font-black uppercase italic mb-4">Verification Gateway</h2>
                        <p className="text-gray-400 text-sm mb-10">Outside participants require a <strong>Secret Invite Code</strong>.</p>
                        <div className="space-y-4">
                            <button onClick={() => setStep('FINAL')} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white transition-all">
                                I have a Code <ArrowRight size={18} />
                            </button>
                            <button onClick={() => setStep('INQUIRY')} className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold text-gray-300 flex items-center justify-center gap-2">
                                I don't have a code <MessageSquare size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* FINAL REGISTRATION FORM */}
                {step === 'FINAL' && (
                    <form onSubmit={handleFinalSubmit} className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-8 backdrop-blur-md">
                            <header>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Final <span className="text-pink-500">Registration</span></h2>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 border-l-2 border-pink-500 pl-3">Event: {event?.name}</p>
                            </header>

                            {/* Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="w-full bg-black/40 border border-white/5 p-4 rounded-xl outline-none focus:border-pink-500" placeholder="Team Name" onChange={e => setFormData({ ...formData, teamName: e.target.value })} required />
                                <input className="w-full bg-pink-500/5 border border-pink-500/20 p-4 rounded-xl outline-none text-pink-500 font-bold uppercase" placeholder="Verification Code" onChange={e => setFormData({ ...formData, secretCode: e.target.value })} required />
                            </div>

                            {/* College Locking Logic */}
                            <div className="space-y-4">
                                {isVgu ? (
                                    <>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400">
                                            College: <span className="text-white font-bold">Vivekananda Global University</span>
                                        </div>
                                        <select
                                            className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-gray-300"
                                            value={formData.departmentId}
                                            onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <select
                                            className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-gray-300"
                                            value={formData.collegeId}
                                            onChange={e => setFormData({ ...formData, collegeId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select College</option>
                                            {colleges.filter(c => !c.isInternal).map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                            <option value="other">Other (Not Listed)</option>
                                        </select>

                                        {/* CONDITIONAL INPUT: Shows only when "Other" is selected */}
                                        {formData.collegeId === 'other' && (
                                            <input
                                                className="w-full bg-black/40 border border-pink-500/50 p-4 rounded-xl outline-none focus:border-pink-500 animate-in slide-in-from-top-2 duration-300"
                                                placeholder="Type your University Name"
                                                value={formData.customCollegeName}
                                                onChange={e => setFormData({ ...formData, customCollegeName: e.target.value })}
                                                required
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Squad Roster */}
                            <div className="space-y-4">
                                {formData.members.map((m, i) => (
                                    <MemberCard
                                        key={i}
                                        index={i}
                                        member={m}
                                        isVgu={isVgu}
                                        onUpdate={(idx, f, v) => {
                                            const updated = [...formData.members];
                                            updated[idx][f] = v;
                                            setFormData({ ...formData, members: updated });
                                        }}
                                        onRemove={(idx) => setFormData({ ...formData, members: formData.members.filter((_, x) => x !== idx) })}
                                        showRemove={formData.members.length > 1}
                                    />
                                ))}
                                {formData.members.length < (event?.maxPlayers || 10) && (
                                    <button type="button" onClick={() => setFormData({ ...formData, members: [...formData.members, { name: '', phone: '', enrollment: '', isLeader: false }] })} className="text-pink-500 text-xs font-black uppercase flex items-center gap-1">
                                        <Plus size={14} /> Add Player
                                    </button>
                                )}
                            </div>

                            {!isVgu && (
                                <div className="p-6 bg-pink-500/5 border border-pink-500/20 rounded-3xl flex items-start gap-4">
                                    <ShieldCheck className="text-pink-500" size={24} />
                                    <div>
                                        <p className="text-xs font-black uppercase text-pink-500">Security Check</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Fee: ₹{event?.eventPrice || 200} | Secured by Razorpay</p>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-6 rounded-2xl font-black uppercase text-2xl shadow-xl hover:scale-[1.01] transition-all">
                                {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;