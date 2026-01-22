import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Loader2, Lock, ArrowRight, MessageSquare, ArrowLeft, Plus, Upload, Send
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
        paymentImage: null,
        transactionId: '',
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

                // Auto-select VGU college for internal students
                if (isVgu) {
                    const vgu = collegeRes.data.find(c => c.name.toLowerCase().includes('vgu'));
                    if (vgu) setFormData(prev => ({ ...prev, collegeId: vgu.id }));
                }
            } catch (err) {
                toast.error("Critical error: Failed to load event data.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId, isVgu, navigate]);

    // --- 3. DYNAMIC MINIMUM PLAYER LOADING ---
    useEffect(() => {
        if (event?.minPlayers && formData.members.length < event.minPlayers) {
            const additionalNeeded = event.minPlayers - formData.members.length;
            const extraMembers = Array.from({ length: additionalNeeded }, () => ({
                name: '', phone: '', enrollment: '', isLeader: false
            }));

            setFormData(prev => ({
                ...prev,
                members: [...prev.members, ...extraMembers]
            }));
        }
    }, [event, formData.members.length]);

    // --- 4. HANDLERS ---
    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/register/inquiry', { ...inquiryData, eventId });
            toast.success("Lead generated! Our team will WhatsApp you an invite code.");
            setStep('CHECK');
        } catch (err) {
            toast.error("Failed to send request. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();

        // Final check for minimum players
        if (formData.members.length < (event?.minPlayers || 1)) {
            return toast.error(`Incomplete Roster: At least ${event.minPlayers} players are required.`);
        }

        setLoading(true);
        const fd = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'members') fd.append(key, JSON.stringify(formData.members));
            else if (formData[key] !== null) fd.append(key, formData[key]);
        });
        fd.append("eventId", eventId);
        fd.append("isVgu", isVgu);

        const registrationPromise = API.post("/register/register-team", fd);

        toast.promise(registrationPromise, {
            loading: 'Encrypting and submitting your registration...',
            success: (res) => {
                setRegistrationSuccessData(res.data);
                setStep("SUCCESS");
                return `Team ${formData.teamName} has successfully registered!`;
            },
            error: (err) => {
                setLoading(false);
                return err.response?.data?.error || "Registration failed. Verify your details.";
            },
        });
    };

    const updateMember = (idx, field, val) => {
        const updated = [...formData.members];
        updated[idx][field] = val;
        setFormData({ ...formData, members: updated });
    };

    // --- 5. RENDER LOGIC ---

    if (loading && !registrationSuccessData && step !== 'INQUIRY') return (
        <div className="min-h-screen bg-black flex items-center justify-center text-pink-500">
            <Loader2 className="animate-spin" size={48} />
        </div>
    );

    if (step === 'SUCCESS' && registrationSuccessData) {
        return (
            <SuccessScreen
                data={registrationSuccessData}
                eventName={event?.name}
                isVgu={isVgu} // Pass the isVgu boolean here
                onHome={() => navigate('/')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 text-white">
            <div className="max-w-2xl mx-auto">

                {/* GATEWAY: Verification Step */}
                {!isVgu && step === 'CHECK' && (
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-center backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Lock className="text-pink-500 mx-auto mb-6" size={40} />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Verification Gateway</h2>
                        <p className="text-gray-400 text-sm mb-10">Outside participants require a <strong>Secret Invite Code</strong> to register for {event?.name}.</p>
                        <div className="space-y-4">
                            <button onClick={() => setStep('FINAL')} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-pink-500 hover:text-white transition-all">
                                I have a Code <ArrowRight size={18} />
                            </button>
                            <button onClick={() => setStep('INQUIRY')} className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold text-gray-300 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                I don't have a code <MessageSquare size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* INQUIRY FORM */}
                {step === 'INQUIRY' && (
                    <InquiryForm
                        inquiryData={inquiryData}
                        setInquiryData={setInquiryData}
                        onBack={() => setStep('CHECK')}
                        onSubmit={handleInquirySubmit}
                        loading={loading}
                    />
                )}

                {/* FINAL REGISTRATION FORM */}
                {step === 'FINAL' && (
                    <form onSubmit={handleFinalSubmit} className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-6">
                            <header className="mb-6">
                                {!isVgu && (
                                    <button type="button" onClick={() => setStep('CHECK')} className="text-gray-500 text-[10px] font-bold flex items-center gap-1 hover:text-white uppercase mb-2 tracking-widest">
                                        <ArrowLeft size={14} /> Back to Gateway
                                    </button>
                                )}
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Final <span className="text-pink-500">Registration</span></h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Event: {event?.name}</p>
                            </header>

                            {/* Group 1: Team Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="w-full bg-black/40 border border-white/5 p-4 rounded-xl outline-none focus:border-pink-500 transition-all" placeholder="Team Name" onChange={e => setFormData({ ...formData, teamName: e.target.value })} required />
                                <input className="w-full bg-pink-500/5 border border-pink-500/20 p-4 rounded-xl outline-none text-pink-500 font-mono font-bold uppercase" placeholder={
                                    event?.allowOutside
                                        ? "Invite Code Required"
                                        : (isVgu ? "Dept Secret Code" : "Invite Code")
                                } onChange={e => setFormData({ ...formData, secretCode: e.target.value })} required />
                            </div>

                            {/* Group 2: Contextual Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isVgu ? (
                                    <select className="w-full bg-black/40 border border-white/5 p-4 rounded-xl outline-none text-sm" value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} required>
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                ) : (
                                    <select className="w-full bg-black/40 border border-white/5 p-4 rounded-xl outline-none text-sm" value={formData.collegeId} onChange={e => setFormData({ ...formData, collegeId: e.target.value })} required>
                                        <option value="">Select College</option>
                                        {colleges.filter(c => !c.name.includes('VGU')).map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                        <option value="other">Other (Not Listed)</option>
                                    </select>
                                )}
                            </div>

                            {formData.collegeId === 'other' && !isVgu && (
                                <input className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-pink-500" placeholder="Manual College Name" onChange={e => setFormData({ ...formData, customCollegeName: e.target.value })} required />
                            )}

                            {/* Group 3: Dynamic Member Cards */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Team Roster</label>
                                    <button type="button" onClick={() => {
                                        if (formData.members.length < (event?.maxPlayers || 10)) {
                                            setFormData({ ...formData, members: [...formData.members, { name: '', phone: '', enrollment: '', isLeader: false }] });
                                        } else {
                                            toast.warning("Roster limit reached!");
                                        }
                                    }} className="text-pink-500 text-xs font-black uppercase flex items-center gap-1 hover:scale-105 transition-all">
                                        <Plus size={14} /> Add Player
                                    </button>
                                </div>
                                {formData.members.map((m, i) => (
                                    <MemberCard key={i} index={i} member={m} isVgu={isVgu} onUpdate={updateMember} onRemove={(idx) => setFormData({ ...formData, members: formData.members.filter((_, x) => x !== idx) })} showRemove={formData.members.length > 1} />
                                ))}
                            </div>

                            {/* Group 4: Payments (Outsider Only) */}
                            {!isVgu && (
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="bg-pink-500/5 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group hover:border-pink-500/50 transition-all cursor-pointer relative">
                                        <input type="file" id="file-upload" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFormData(p => ({ ...p, paymentImage: e.target.files[0] }))} />
                                        <Upload className="mx-auto mb-2 text-gray-500 group-hover:text-pink-500" />
                                        <p className="text-xs font-bold uppercase text-gray-400">{formData.paymentImage ? formData.paymentImage.name : 'Upload Screenshot'}</p>
                                    </div>
                                    <input className="w-full bg-black/40 border border-white/5 p-4 rounded-xl focus:border-pink-500 outline-none" placeholder="Transaction Reference ID" onChange={e => setFormData({ ...formData, transactionId: e.target.value })} required />
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-6 rounded-2xl font-black uppercase italic tracking-tighter text-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.01] transition-all">
                                Complete Registration
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;