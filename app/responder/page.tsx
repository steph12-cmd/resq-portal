import Link from 'next/link';

export default function ResponderPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#cc0000] rounded-full opacity-[0.04] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="Siren" className="w-10 h-10 rounded-xl" />
             <span className="font-bold text-lg tracking-wider">Siren</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/40 hover:text-white transition">Back</Link>
            <Link href="/login" className="bg-[#cc0000] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#aa0000] transition shadow-lg shadow-red-900/30">
              Responder Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full animate-pulse" />
            <span className="text-sm text-white/50">For Responders</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight max-w-4xl">
            Save lives.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0000] to-[#ff6644]">
              On your terms.
            </span>
          </h1>

          <p className="text-white/40 text-xl max-w-2xl mb-12 leading-relaxed">
            Join Nigeria&apos;s most advanced emergency response network. Receive real-time alerts, navigate to victims and track your impact — all from one powerful app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#join" className="bg-[#cc0000] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40 text-center">
              Join as Responder
            </a>
            <a href="#how" className="bg-white/[0.04] border border-white/[0.08] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/[0.08] transition text-center">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Responder flow</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16 max-w-lg">
            From alert to resolution
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Go Available', desc: 'Toggle your availability on. You are now live on the network and ready to receive alerts.' },
              { step: '02', title: 'Receive Alert', desc: 'Get instant push notifications with full emergency details and victim GPS location.' },
              { step: '03', title: 'Navigate', desc: 'Accept the alert and navigate directly to the victim using Google Maps integration.' },
              { step: '04', title: 'Resolve', desc: 'Provide assistance and mark the emergency as resolved. Your stats update automatically.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 hover:border-[#cc0000]/20 transition">
                <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03]">{item.step}</div>
                <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-3">{item.step}</p>
                <h3 className="text-lg font-black mb-2 tracking-tight">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Responder tools</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Real-time Alerts', desc: 'Receive instant push notifications the moment an emergency is triggered near you.' },
              { title: 'GPS Navigation', desc: 'One tap opens Google Maps with the exact route to the victim location.' },
              { title: 'Victim Profile', desc: 'See blood group, allergies and medical conditions before you arrive.' },
              { title: 'Direct Contact', desc: 'Call the victim or emergency hotline directly from the response screen.' },
              { title: 'Response Stats', desc: 'Track your total responses, weekly activity and performance rating.' },
              { title: 'Availability Control', desc: 'Toggle your availability on and off. You are in full control of when you respond.' },
            ].map((f) => (
              <div key={f.title} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-[#cc0000]/20 transition">
                <div className="w-2 h-2 bg-[#cc0000] rounded-full mb-4" />
                <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can join */}
      <section className="px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Eligibility</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Who can be a responder
          </h2>
          <p className="text-white/40 mb-12 max-w-xl text-sm">
            All responders must be verified through a registered organisation on Siren before they can receive alerts.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Medical Doctors & Nurses',
              'Firefighters',
              'Police Officers',
              'Security Personnel',
              'Paramedics & EMTs',
              'Trained Volunteers',
            ].map((type) => (
              <div key={type} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-4 hover:border-[#cc0000]/20 transition">
                <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full mb-3" />
                <p className="text-white/60 text-sm font-medium">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="join" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#cc0000]/10 via-transparent to-transparent border border-[#cc0000]/20 rounded-3xl p-12 md:p-16 text-center">
            <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Ready to save lives?
            </h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto text-sm">
              Download the Siren app and sign up as a responder through your organisation to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" className="bg-[#cc0000] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40">
                Download Siren
              </a>
              <Link href="/register" className="bg-white/[0.04] border border-white/[0.08] text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/[0.08] transition">
                Register Your Organisation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/icon.png" alt="Siren" className="w-6 h-6 rounded-lg" />
            <span className="font-bold text-sm tracking-wider">Siren</span>
          </Link>
          <p className="text-white/20 text-xs">&copy; 2025 Siren. Built for Nigeria.</p>
          <div className="flex gap-6 text-xs text-white/20">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </footer>

    </main>
  );
}