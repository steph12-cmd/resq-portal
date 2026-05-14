import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1a1a1a] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#cc0000] rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-wider">ResQ</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#organisations" className="hover:text-white transition">Organisations</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#888] hover:text-white transition">
            Login
          </Link>
          <Link href="/register" className="bg-[#cc0000] text-white text-sm px-4 py-2 rounded-full hover:bg-[#aa0000] transition">
            Register Org
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-[#cc0000] rounded-full" />
          <span className="text-sm text-[#888]">Nigeria&apos;s Emergency Response Network</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Help is always <br />
          <span className="text-[#cc0000]">near you</span>
        </h1>
        <p className="text-[#888] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          ResQ connects Nigerians in emergency situations to verified responders in seconds.
          No more helpless moments. Help is one tap away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a href="#download" className="bg-[#cc0000] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#aa0000] transition">
            Download the App
          </a>
          <Link href="/register" className="border border-[#cc0000] text-[#cc0000] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#cc0000] hover:text-white transition">
            Register Organisation
          </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-[#555]">
          <div className="flex items-center gap-2">
            <span className="text-[#cc0000] font-bold">🚨</span>
            <span>One tap SOS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#cc0000] font-bold">✅</span>
            <span>Verified responders</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#cc0000] font-bold">📍</span>
            <span>Live GPS tracking</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '24', label: 'Emergency Types' },
            { number: '3', label: 'User Roles' },
            { number: '1', label: 'Tap to Safety' },
            { number: '₦0', label: 'Cost to Citizens' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-[#cc0000] mb-2">{stat.number}</p>
              <p className="text-[#888] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#cc0000] text-sm font-semibold text-center mb-4 uppercase tracking-widest">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Emergency response in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Press SOS',
                desc: 'Open ResQ and press the big red SOS button. Your GPS location is captured instantly.',
                icon: '🚨',
              },
              {
                step: '02',
                title: 'Select Emergency',
                desc: 'Choose from 24 emergency types. Add details to help responders prepare before arriving.',
                icon: '📋',
              },
              {
                step: '03',
                title: 'Help Arrives',
                desc: 'Verified responders near you are alerted instantly. Track them coming to you in real time.',
                icon: '🦺',
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
                <div className="w-12 h-12 bg-[#cc0000] rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="text-[#cc0000] text-sm font-semibold mb-2">{item.step}</p>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#cc0000] text-sm font-semibold text-center mb-4 uppercase tracking-widest">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Built for Nigerian realities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '📍',
                title: 'Automatic GPS Location',
                desc: 'Your exact location is captured the moment you press SOS — even if you cannot speak.',
              },
              {
                icon: '🔔',
                title: 'Instant Push Notifications',
                desc: 'Available responders near you are notified immediately with full emergency details.',
              },
              {
                icon: '✅',
                title: 'Verified Responders Only',
                desc: 'Every responder is verified through their organisation before they can respond to any alert.',
              },
              {
                icon: '📞',
                title: 'Emergency Hotline Access',
                desc: 'One tap access to Nigeria emergency hotline (112) directly from the alert screen.',
              },
              {
                icon: '🗺️',
                title: 'Live Navigation',
                desc: 'Responders navigate to victims via Google Maps with real-time directions.',
              },
              {
                icon: '🏢',
                title: 'Organisation Dashboard',
                desc: 'Organisations manage their responders, track responses, and view analytics from a web portal.',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-[#888] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Organisations */}
      <section id="organisations" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#cc0000] text-sm font-semibold mb-4 uppercase tracking-widest">
                For Organisations
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Power your emergency response with ResQ
              </h2>
              <p className="text-[#888] leading-relaxed mb-8">
                Whether you are a hospital, private security firm, fire service or NGO —
                ResQ gives you the digital infrastructure to respond faster, track better, and save more lives.
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  'Real-time emergency alerts for your team',
                  'Web dashboard to manage all personnel',
                  'Analytics and response time tracking',
                  'Automatic dispatch to nearest responder',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#cc0000] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-[#888] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-block bg-[#cc0000] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#aa0000] transition">
                Register your Organisation
              </Link>
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
              <p className="text-white font-bold mb-6">Organisation types we support</p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '🏥', label: 'Hospitals & Clinics' },
                  { icon: '🚒', label: 'Fire Services' },
                  { icon: '👮', label: 'Police & Security' },
                  { icon: '🚑', label: 'Ambulance Services' },
                  { icon: '🤝', label: 'NGOs & Volunteers' },
                  { icon: '🔒', label: 'Private Security Firms' },
                ].map((org) => (
                  <div key={org.label} className="flex items-center gap-3 py-3 border-b border-[#1a1a1a] last:border-0">
                    <span className="text-xl">{org.icon}</span>
                    <span className="text-[#888] text-sm">{org.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="py-24 px-6 bg-[#cc0000]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Download ResQ today
          </h2>
          <p className="text-red-200 text-lg mb-10">
            Free for all Nigerians. Available on Android.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-white text-[#cc0000] px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition">
              📱 Download for Android
            </a>
            <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#cc0000] transition">
              Register Organisation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#cc0000] rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="font-bold tracking-wider">ResQ</span>
          </div>
          <p className="text-[#555] text-sm text-center">
            &copy; 2025 ResQ. Emergency Responder Network. Built for Nigeria.
          </p>
          <div className="flex gap-6 text-sm text-[#555]">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}