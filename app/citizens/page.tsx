import Link from 'next/link';

export default function CitizenPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#cc0000] rounded-full opacity-[0.04] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#cc0000] rounded-xl flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-wider">ResQ</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/40 hover:text-white transition">
              Back
            </Link>
            <a href="#download" className="bg-[#cc0000] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#aa0000] transition shadow-lg shadow-red-900/30">
              Download App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full animate-pulse" />
            <span className="text-sm text-white/50">For Citizens</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight max-w-4xl">
            Help arrives
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0000] to-[#ff6644]">
              in seconds.
            </span>
          </h1>

          <p className="text-white/40 text-xl max-w-2xl mb-12 leading-relaxed">
            In any emergency, every second counts. ResQ connects you to verified responders near you with a single tap — no calls, no waiting, no confusion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#download" className="bg-[#cc0000] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40 text-center">
              Download ResQ Free
            </a>
            <a href="#how" className="bg-white/[0.04] border border-white/[0.08] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/[0.08] transition text-center">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16 max-w-lg">
            Three steps to safety
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Press SOS',
                desc: 'Open ResQ and press the SOS button. Your GPS coordinates are captured instantly — no typing, no delay.',
              },
              {
                step: '02',
                title: 'Select Emergency',
                desc: 'Choose from 24 emergency types. Optionally add details to help responders prepare before they arrive.',
              },
              {
                step: '03',
                title: 'Track Help',
                desc: 'Watch your responder navigate to you in real time. Call them directly from the app if needed.',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 hover:border-[#cc0000]/20 transition">
                <div className="absolute top-6 right-6 text-6xl font-black text-white/[0.03]">{item.step}</div>
                <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-4">{item.step}</p>
                <h3 className="text-xl font-black mb-3 tracking-tight">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency types */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Coverage</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            24 emergency types
          </h2>
          <p className="text-white/40 mb-12 max-w-xl">
            From medical emergencies to natural disasters — ResQ covers every situation Nigerians face daily.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Medical Emergency', 'Fire', 'Armed Robbery', 'Road Accident',
              'Flooding', 'Child in Danger', 'Domestic Violence', 'Kidnapping',
              'Gas Explosion', 'Crowd Crush', 'Drowning', 'Snake Attack',
              'Electric Shock', 'Building Collapse', 'Poisoning', 'Stabbing',
              'Emergency Childbirth', 'Choking', 'Mental Health Crisis', 'Drug Overdose',
              'Pipeline Explosion', 'Boat Emergency', 'Lightning Strike', 'General Emergency',
            ].map((type) => (
              <div key={type} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 hover:border-[#cc0000]/20 transition">
                <p className="text-white/50 text-xs">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">
            Built around you
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Automatic GPS Location', desc: 'Your exact location is captured when you press SOS — even if you cannot speak or move.' },
              { title: 'Medical Profile', desc: 'Store your blood group, allergies and conditions. Responders see this before they arrive.' },
              { title: 'Emergency Contacts', desc: 'Add trusted contacts who are notified automatically when you send an SOS.' },
              { title: 'Emergency Hotline', desc: 'One tap access to Nigeria emergency hotline 112 directly from the alert screen.' },
              { title: 'Real-time Tracking', desc: 'Watch your responder navigate to your location on a live map.' },
              { title: 'Emergency History', desc: 'Full record of all your past emergencies and their outcomes.' },
            ].map((f) => (
              <div key={f.title} className="group flex gap-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-[#cc0000]/20 transition">
                <div className="w-2 h-2 bg-[#cc0000] rounded-full mt-1.5 shrink-0" />
                <div>
                  <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#cc0000]/10 via-transparent to-transparent border border-[#cc0000]/20 rounded-3xl p-12 md:p-16 text-center">
            <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Download ResQ today
            </h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto">
              Free forever for citizens. Available on Android. iOS coming soon.
            </p>
            <a href="#" className="inline-block bg-[#cc0000] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40">
              Download for Android
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#cc0000] rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-bold text-sm tracking-wider">ResQ</span>
          </Link>
          <p className="text-white/20 text-xs">&copy; 2025 ResQ. Built for Nigeria.</p>
          <div className="flex gap-6 text-xs text-white/20">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
          </div>
        </div>
      </footer>

    </main>
  );
}