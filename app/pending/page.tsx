import Link from 'next/link';

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-lg text-center">

        <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[#cc0000]">
          <span className="text-5xl">⏳</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Application Submitted!
        </h1>
        <p className="text-[#888] text-base mb-8 leading-relaxed">
          Your organisation has been submitted for review. The Siren team will verify your details within <span className="text-white font-semibold">24-48 hours.</span>
        </p>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 text-left">
          <p className="text-white font-semibold mb-4">What happens next?</p>
          {[
            { step: '01', title: 'Review', desc: 'Siren team reviews your organisation details and documents' },
            { step: '02', title: 'Verification', desc: 'We verify your RC number and official credentials' },
            { step: '03', title: 'Activation', desc: 'Your account is activated and you receive your org code' },
            { step: '04', title: 'Onboard Staff', desc: 'Share the org code with your personnel to join Siren' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 mb-5 last:mb-0">
              <div className="w-10 h-10 bg-[#cc0000] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{item.step}</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-[#888] text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-8 border-l-4 border-[#cc0000]">
          <p className="text-[#888] text-sm leading-relaxed">
            📧 A confirmation email has been sent to your registered email address. Check your inbox for updates.
          </p>
        </div>

        <Link
          href="/login"
          className="w-full block bg-[#cc0000] text-white text-center py-4 rounded-full font-semibold hover:bg-[#aa0000] transition mb-4"
        >
          Go to Login
        </Link>

        <Link href="/" className="text-[#555] text-sm hover:text-[#888] transition">
          Back to home
        </Link>

      </div>
    </main>
  );
}