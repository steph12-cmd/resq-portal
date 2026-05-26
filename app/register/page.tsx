'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ORG_TYPES = ['Fire Service', 'Medical / Hospital', 'Police', 'Private Security', 'Ambulance Service', 'NGO / Volunteer', 'Other'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    orgName: '', rcNumber: '', contactPerson: '',
    phone: '', email: '', password: '',
    state: '', lga: '', address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'organisations'), {
        ...form,
        orgType,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      router.push('/pending');
    } catch (error) {
      console.log('Error registering org:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
      </div>

      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="Siren" className="w-8 h-8 rounded-xl" />
            <span className="font-bold text-lg tracking-wider">Siren</span>
          </Link>
          <Link href="/login" className="text-sm text-white/40 hover:text-white transition">
            Already registered? Login
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Register Organisation</h1>
          <p className="text-white/40 text-sm">Join Siren as a verified emergency response organisation</p>
        </div>

        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-[#cc0000]' : 'bg-white/[0.06]'}`} />
          ))}
        </div>
        <p className="text-white/20 text-xs mb-8">Step {step} of 3</p>

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-lg">Organisation Details</h2>
            <div>
              <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">Organisation Name</label>
              <input name="orgName" value={form.orgName} onChange={handleChange}
                placeholder="e.g. Lagos Fire Service"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm" />
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">Organisation Type</label>
              <div className="flex flex-wrap gap-2">
                {ORG_TYPES.map((type) => (
                  <button key={type} onClick={() => setOrgType(type)}
                    className={`px-4 py-2 rounded-xl text-sm border transition ${orgType === type ? 'bg-[#cc0000] border-[#cc0000] text-white' : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:border-[#cc0000]/40'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">RC Number / License</label>
              <input name="rcNumber" value={form.rcNumber} onChange={handleChange}
                placeholder="e.g. RC123456"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm" />
            </div>
            <button onClick={() => setStep(2)}
              className="w-full bg-[#cc0000] text-white py-4 rounded-xl font-semibold hover:bg-[#aa0000] transition">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-lg">Contact & Location</h2>
            {[
              { name: 'contactPerson', label: 'Contact Person', placeholder: 'e.g. Emeka Okafor' },
              { name: 'phone', label: 'Phone Number', placeholder: 'e.g. 08012345678' },
              { name: 'email', label: 'Email Address', placeholder: 'e.g. info@org.com' },
              { name: 'state', label: 'State', placeholder: 'e.g. Lagos' },
              { name: 'lga', label: 'LGA', placeholder: 'e.g. Ikeja' },
              { name: 'address', label: 'Official Address', placeholder: 'e.g. 10 Broad Street' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">{field.label}</label>
                <input name={field.name} value={(form as any)[field.name]} onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm" />
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/[0.08] text-white/40 py-4 rounded-xl text-sm hover:bg-white/[0.04] transition">← Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-[#cc0000] text-white py-4 rounded-xl font-semibold hover:bg-[#aa0000] transition">Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-lg">Create Admin Account</h2>
            <div>
              <label className="text-white/40 text-xs font-semibold mb-2 block uppercase tracking-widest">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50 text-sm" />
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Summary</p>
              {[
                { label: 'Organisation', value: form.orgName },
                { label: 'Type', value: orgType },
                { label: 'Contact', value: form.contactPerson },
                { label: 'Email', value: form.email },
                { label: 'State', value: form.state },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-white/30 text-sm">{item.label}</span>
                  <span className="text-white text-sm">{item.value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/[0.02] border border-[#cc0000]/20 rounded-xl p-4">
              <p className="text-white/40 text-xs leading-relaxed">
                After submission your organisation will be reviewed by the Siren team within 24-48 hours. You will receive an email once verified.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/[0.08] text-white/40 py-4 rounded-xl text-sm hover:bg-white/[0.04] transition">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-[2] bg-[#cc0000] text-white py-4 rounded-xl font-semibold hover:bg-[#aa0000] transition disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}