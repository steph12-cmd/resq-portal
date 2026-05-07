import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6">
      
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 bg-[#cc0000] rounded-xl flex items-center justify-center mb-4">
          <div className="w-10 h-10 bg-[#ff2200] rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-[#ffcccc] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#cc0000] rounded-full" />
            </div>
          </div>
        </div>
        <div className="w-20 h-2 bg-[#888] rounded mt-1" />
        <div className="w-24 h-1.5 bg-[#666] rounded mt-1" />
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 tracking-wide">ResQ Portal</h1>
      <p className="text-[#888888] text-base mb-12 text-center max-w-md">
        Organisation management portal for verified emergency response organisations
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/login" className="w-full bg-[#cc0000] text-white text-center py-4 rounded-full font-semibold text-base hover:bg-[#aa0000] transition">
          Login to Portal
        </Link>
        <Link href="/register" className="w-full border border-[#cc0000] text-[#cc0000] text-center py-4 rounded-full font-semibold text-base hover:bg-[#cc0000] hover:text-white transition">
          Register Organisation
        </Link>
      </div>

      <p className="text-[#555] text-sm mt-12">
        Are you a responder?{' '}
        <span className="text-[#cc0000] cursor-pointer">Download the ResQ app</span>
      </p>

    </main>
  );
}