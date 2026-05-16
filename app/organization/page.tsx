import Link from 'next/link';

export default function OrganisationPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#cc0000] rounded-full opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#cc0000] rounded-full opacity-[0.04] blur-[100px]" />
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
            <Link href="/" className="text-sm text-white/40 hover:text-white transition">Back</Link>
            <Link href="/register" className="bg-[#cc0000] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#aa0000] transition shadow-lg shadow-red-900/30">
              Register Organisation
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full animate-pulse" />
            <span className="text-sm text-white/50">For Organisations</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight max-w-4xl">
            The infrastructure
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0000] to-[#ff6644]">
              emergency response deserves.
            </span>
          </h1>

          <p className="text-white/40 text-xl max-w-2xl mb-12 leading-relaxed">
            ResQ gives hospitals, security firms, fire services and NGOs the digital command centre to deploy faster, track better and save more lives across Nigeria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-[#cc0000] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40 text-center">
              Register Your Organisation
            </Link>
            <Link href="/login" className="bg-white/[0.04] border border-white/[0.08] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/[0.08] transition text-center">
              Login to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '24/7', label: 'Always Active' },
            { number: 'Real-time', label: 'Alert Dispatch' },
            { number: 'Verified', label: 'Personnel Only' },
            { number: 'Full', label: 'Analytics Access' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-[#cc0000] mb-1">{stat.number}</p>
              <p className="text-white/30 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard features */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Command centre</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Your organisation dashboard
          </h2>
          <p className="text-white/40 mb-16 max-w-xl text-sm">
            A powerful web portal that gives you complete visibility and control over your emergency response operations.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Real-time Emergency Feed', desc: 'Monitor all active emergencies across your coverage area as they happen. See type, location and assigned responder.' },
              { title: 'Personnel Management', desc: 'Add, remove and manage all your responders. Assign unique org codes and track individual performance.' },
              { title: 'Response Analytics', desc: 'Track average response times, resolution rates, emergency types and geographical coverage across time periods.' },
              { title: 'Automatic Dispatch', desc: 'The nearest available responder in your network is automatically notified when an emergency is triggered.' },
              { title: 'Verification Control', desc: 'Review and verify new responders before they can receive any alerts. Full control over your team.' },
              { title: 'Historical Reports', desc: 'Access complete records of every emergency your organisation has responded to with full details.' },
            ].map((f) => (
              <div key={f.title} className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:border-[#cc0000]/20 hover:bg-white/[0.04] transition">
                <div className="w-2 h-2 bg-[#cc0000] rounded-full mb-5" />
                <h3 className="font-bold mb-3">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can register */}
      <section className="px-6 py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Eligibility</p>
              <h2 className="text-4xl font-black tracking-tight mb-6">
                Who can register
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Any legitimate emergency response organisation operating in Nigeria can register on ResQ. All organisations are verified by the ResQ team before activation.
              </p>
              <Link href="/register" className="inline-block bg-[#cc0000] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#aa0000] transition shadow-xl shadow-red-900/30">
                Start Registration
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Hospitals & Clinics', desc: 'Deploy your medical team to emergencies near your facility' },
                { type: 'Fire Services', desc: 'Receive fire and explosion alerts with precise GPS coordinates' },
                { type: 'Police & Security', desc: 'Respond to crime and safety alerts in your patrol area' },
                { type: 'Ambulance Services', desc: 'Dispatch ambulances with full patient information in advance' },
                { type: 'Private Security Firms', desc: 'Offer premium emergency coverage to estates and corporates' },
                { type: 'NGOs & Volunteer Groups', desc: 'Coordinate volunteer responders across communities' },
              ].map((org) => (
                <div key={org.type} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-[#cc0000]/20 transition">
                  <p className="font-semibold text-sm mb-1">{org.type}</p>
                  <p className="text-white/30 text-xs">{org.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration process */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Process</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">
            From registration to live
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Fill in your organisation details, RC number and contact information on our portal.' },
              { step: '02', title: 'Verify', desc: 'Our team reviews and verifies your organisation within 24-48 hours.' },
              { step: '03', title: 'Onboard', desc: 'Receive your unique organisation code and share it with your personnel to join.' },
              { step: '04', title: 'Go Live', desc: 'Your team starts receiving emergency alerts and your dashboard goes active.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 hover:border-[#cc0000]/20 transition">
                <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03]">{item.step}</div>
                <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-3">{item.step}</p>
                <h3 className="text-lg font-black mb-2">{item.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#cc0000]/10 via-transparent to-transparent border border-[#cc0000]/20 rounded-3xl p-12 md:p-16 text-center">
            <p className="text-[#cc0000] text-xs font-bold uppercase tracking-[0.3em] mb-4">Get Started</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Ready to modernise
              <br />your emergency response?
            </h2>
            <p className="text-white/40 mb-10 max-w-md mx-auto text-sm">
              Join the growing network of organisations using ResQ to save lives across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-[#cc0000] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#aa0000] transition shadow-2xl shadow-red-900/40">
                Register Organisation
              </Link>
              <Link href="/login" className="bg-white/[0.04] border border-white/[0.08] text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/[0.08] transition">
                Login to Portal
              </Link>
            </div>
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