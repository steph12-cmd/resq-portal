import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden flex flex-col">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#cc0000] rounded-full opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#cc0000] rounded-full opacity-[0.04] blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="ResQ" className="w-8 h-8 rounded-xl" />
<span className="font-bold text-lg tracking-wider">ResQ</span>
          </div>
          <Link href="/login" className="text-sm text-white/40 hover:text-white transition">
            Organisation Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 mb-8">
          <div className="w-1.5 h-1.5 bg-[#cc0000] rounded-full animate-pulse" />
          <span className="text-sm text-white/50">Nigeria&apos;s Emergency Response Network</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight">
          One platform.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0000] to-[#ff6644]">
            Every emergency.
          </span>
        </h1>

        <p className="text-white/40 text-lg max-w-xl mb-16 leading-relaxed">
          ResQ connects citizens, verified responders and organisations into one seamless emergency response network.
        </p>

        {/* Three role cards */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">

          <Link href="/citizens" className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-left hover:bg-white/[0.05] hover:border-[#cc0000]/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-[#cc0000]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-[#cc0000]/10 border border-[#cc0000]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#cc0000]/20 transition">
                <div className="w-4 h-4 bg-[#cc0000] rounded-full" />
              </div>
              <p className="text-xs text-[#cc0000] font-bold uppercase tracking-widest mb-3">For Citizens</p>
              <h3 className="text-2xl font-black mb-3 tracking-tight">I need help</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Get emergency assistance in seconds. One tap connects you to verified responders near you.
              </p>
              <div className="flex items-center gap-2 text-[#cc0000] text-sm font-semibold">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/responder" className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-left hover:bg-white/[0.05] hover:border-[#cc0000]/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-[#cc0000]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-[#cc0000]/10 border border-[#cc0000]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#cc0000]/20 transition">
                <div className="w-4 h-4 bg-[#cc0000] rounded-full" />
              </div>
              <p className="text-xs text-[#cc0000] font-bold uppercase tracking-widest mb-3">For Responders</p>
              <h3 className="text-2xl font-black mb-3 tracking-tight">I respond</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Join a network of verified emergency responders. Receive alerts and save lives near you.
              </p>
              <div className="flex items-center gap-2 text-[#cc0000] text-sm font-semibold">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/organization" className="group relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-left hover:bg-white/[0.05] hover:border-[#cc0000]/30 transition-all duration-300 md:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-b from-[#cc0000]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-[#cc0000]/10 border border-[#cc0000]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#cc0000]/20 transition">
                <div className="w-4 h-4 bg-[#cc0000] rounded-full" />
              </div>
              <p className="text-xs text-[#cc0000] font-bold uppercase tracking-widest mb-3">For Organisations</p>
              <h3 className="text-2xl font-black mb-3 tracking-tight">We respond</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Register your organisation and deploy your team with the most powerful emergency dispatch platform in Nigeria.
              </p>
              <div className="flex items-center gap-2 text-[#cc0000] text-sm font-semibold">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

        </div>

        {/* Bottom stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          {[
            { number: '24', label: 'Emergency Types' },
            { number: '1 tap', label: 'To Safety' },
            { number: 'Free', label: 'For Citizens' },
            { number: 'Verified', label: 'Responders Only' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-black text-white mb-1">{stat.number}</p>
              <p className="text-white/30 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#cc0000] rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-bold text-sm tracking-wider">ResQ</span>
          </div>
          <p className="text-white/20 text-xs text-center">
            &copy; 2025 ResQ. Emergency Responder Network. Built for Nigeria.
          </p>
          <div className="flex gap-6 text-xs text-white/20">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}