'use client';
import { useState } from 'react';
import Link from 'next/link';

const ORG_TYPES = ['Fire Service', 'Medical / Hospital', 'Police', 'Private Security', 'Ambulance Service', 'NGO / Volunteer', 'Other'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState('');
  const [form, setForm] = useState({
    orgName: '',
    rcNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    state: '',
    lga: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#111111] flex flex-col items-center px-6 py-16">

      <Link href="/" className="text-[#cc0000] font-semibold mb-8 self-start">
        ‹ Back
      </Link>

      <div className="w-full max-w-lg">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#cc0000] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Register Organisation</h1>
            <p className="text-[#888] text-sm">Join Siren as a verified response organisation</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-[#cc0000]' : 'bg-[#2a2a2a]'}`}
            />
          ))}
        </div>
        <p className="text-[#888] text-sm mb-6">Step {step} of 3</p>

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Organisation Details</h2>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Organisation name</label>
              <input
                name="orgName"
                value={form.orgName}
                onChange={handleChange}
                placeholder="e.g. Lagos Fire Service"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Organisation type</label>
              <div className="flex flex-wrap gap-2">
                {ORG_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrgType(type)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      orgType === type
                        ? 'bg-[#cc0000] border-[#cc0000] text-white'
                        : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888] hover:border-[#cc0000]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">RC Number / License</label>
              <input
                name="rcNumber"
                value={form.rcNumber}
                onChange={handleChange}
                placeholder="e.g. RC123456"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#cc0000] text-white py-4 rounded-full font-semibold hover:bg-[#aa0000] transition"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Contact & Location</h2>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Contact person name</label>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="e.g. Emeka Okafor"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Phone number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 08012345678"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Email address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. info@lagosfire.gov.ng"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[#aaa] text-sm font-semibold mb-2 block">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g. Lagos"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[#aaa] text-sm font-semibold mb-2 block">LGA</label>
                <input
                  name="lga"
                  value={form.lga}
                  onChange={handleChange}
                  placeholder="e.g. Ikeja"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Official address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 10 Broad Street, Lagos Island"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-[#333] text-[#888] py-4 rounded-full font-semibold hover:border-[#cc0000] transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 flex-grow bg-[#cc0000] text-white py-4 rounded-full font-semibold hover:bg-[#aa0000] transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-semibold text-lg">Create Admin Account</h2>

            <div>
              <label className="text-[#aaa] text-sm font-semibold mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#cc0000]"
              />
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-5 border-l-4 border-[#cc0000]">
              <p className="text-white font-semibold text-sm mb-2">📋 Summary</p>
              <p className="text-[#888] text-sm">Organisation: <span className="text-white">{form.orgName || '—'}</span></p>
              <p className="text-[#888] text-sm">Type: <span className="text-white">{orgType || '—'}</span></p>
              <p className="text-[#888] text-sm">Contact: <span className="text-white">{form.contactPerson || '—'}</span></p>
              <p className="text-[#888] text-sm">Email: <span className="text-white">{form.email || '—'}</span></p>
              <p className="text-[#888] text-sm">State: <span className="text-white">{form.state || '—'}</span></p>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <p className="text-[#888] text-sm leading-relaxed">
                After submission your organisation will be reviewed by the Siren team within 24-48 hours. You will receive an email once verified.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-[#333] text-[#888] py-4 rounded-full font-semibold"
              >
                Back
              </button>
              <Link
                href="/pending"
                className="flex-grow text-center bg-[#cc0000] text-white py-4 rounded-full font-semibold hover:bg-[#aa0000] transition"
              >
                Submit for Review
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}