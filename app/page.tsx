import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import { ArrowRight, Camera, Share2, MessageCircle, Leaf, Star } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans">

      <Navbar session={session} />

      <section className="px-6 md:px-10 py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E8F5EE] opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-[#FEF3E2] opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#E8F5EE] rounded-full px-4 py-1.5 mb-5">
              <Leaf size={13} color="#0F4C35" />
              <span className="text-xs text-[#0F4C35] font-semibold tracking-wide">Community Resource Sharing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Borrow what you need.<br />
              <span className="text-[#0F4C35]">Share</span> what you have.
            </h1>
            <p className="text-base text-gray-500 mb-8 leading-relaxed">
              Connect with your community to borrow cameras, tools, books and more. Build trust, reduce waste, and help each other thrive.
            </p>
            <div className="flex gap-3 flex-wrap">
              {session ? (
                <Link href="/resources" className="inline-flex items-center gap-2 bg-[#0F4C35] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#0D3F2C] transition-colors">
                  Browse resources <ArrowRight size={15} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="inline-flex items-center gap-2 bg-[#0F4C35] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#0D3F2C] transition-colors">
                    Start sharing <ArrowRight size={15} />
                  </Link>
                  <Link href="/resources" className="inline-flex items-center gap-2 bg-[#FAFAF7] text-gray-700 text-sm px-6 py-3 rounded-xl border border-[#EDECEA] hover:bg-gray-100 transition-colors">
                    Browse resources
                  </Link>
                </>
              )}
            </div>
            <div className="flex gap-6 mt-10">
              <div>
                <p className="text-2xl font-bold text-[#0F4C35]">500+</p>
                <p className="text-xs text-gray-400">Members</p>
              </div>
              <div className="w-px bg-[#EDECEA]" />
              <div>
                <p className="text-2xl font-bold text-[#0F4C35]">1,200+</p>
                <p className="text-xs text-gray-400">Resources</p>
              </div>
              <div className="w-px bg-[#EDECEA]" />
              <div>
                <p className="text-2xl font-bold text-[#F5A623]">4.9</p>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-[#FAFAF7] border border-[#EDECEA] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F4C35] rounded-xl flex items-center justify-center shrink-0">
                <Camera size={18} color="#fff" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Canon EOS R50</p>
                <p className="text-xs text-gray-400">Available now · 0.5 km away</p>
              </div>
              <span className="bg-[#E8F5EE] text-[#0F4C35] text-xs font-semibold px-3 py-1 rounded-full">Free</span>
            </div>
            <div className="bg-[#FAFAF7] border border-[#EDECEA] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5BB88A] rounded-xl flex items-center justify-center shrink-0">
                <Share2 size={18} color="#fff" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Power drill set</p>
                <p className="text-xs text-gray-400">Available now · 1.2 km away</p>
              </div>
              <span className="bg-[#E8F5EE] text-[#0F4C35] text-xs font-semibold px-3 py-1 rounded-full">Free</span>
            </div>
            <div className="bg-[#FAFAF7] border border-[#EDECEA] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5A623] rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle size={18} color="#fff" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">MacBook Pro 14"</p>
                <p className="text-xs text-gray-400">Available from Mon · 0.8 km away</p>
              </div>
              <span className="bg-[#FEF3E2] text-[#854F0B] text-xs font-semibold px-3 py-1 rounded-full">Soon</span>
            </div>
            {!session && (
              <div className="bg-[#0F4C35] rounded-2xl p-4 flex items-center justify-between">
                <p className="text-sm text-[#9FE1CB]">Sign in to request a borrow</p>
                <Link href="/login" className="text-xs text-[#F5A623] font-semibold hover:underline">Sign in →</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-[#FAFAF7]">
        <div className="text-center mb-12">
          <p className="text-xs text-[#5BB88A] tracking-widest font-semibold mb-2">FEATURES</p>
          <h2 className="text-2xl font-bold text-gray-900">Everything your community needs</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-6">
            <div className="w-11 h-11 bg-[#E8F5EE] rounded-xl flex items-center justify-center mb-4">
              <Camera size={20} color="#0F4C35" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Borrow resources</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Find cameras, laptops, tools and more from people in your community</p>
          </div>
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-6">
            <div className="w-11 h-11 bg-[#FEF3E2] rounded-xl flex items-center justify-center mb-4">
              <Share2 size={20} color="#F5A623" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Share what you own</h3>
            <p className="text-xs text-gray-500 leading-relaxed">List items you rarely use and help others while earning trust</p>
          </div>
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-6">
            <div className="w-11 h-11 bg-[#E8F5EE] rounded-xl flex items-center justify-center mb-4">
              <MessageCircle size={20} color="#5BB88A" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Chat directly</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Message owners, arrange pickups and coordinate returns easily</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-white">
        <div className="text-center mb-12">
          <p className="text-xs text-[#5BB88A] tracking-widest font-semibold mb-2">HOW IT WORKS</p>
          <h2 className="text-2xl font-bold text-gray-900">Simple as 1, 2, 3</h2>
        </div>
        <div className="flex justify-center max-w-2xl mx-auto flex-wrap">
          <div className="text-center px-6 py-4 flex-1 min-w-36">
            <div className="w-12 h-12 bg-[#0F4C35] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">1</div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Create account</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Sign up and join your community in seconds</p>
          </div>
          <div className="flex items-center pb-10 text-gray-300 text-2xl">›</div>
          <div className="text-center px-6 py-4 flex-1 min-w-36">
            <div className="w-12 h-12 bg-[#5BB88A] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">2</div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Browse resources</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Find what you need or list what you want to share</p>
          </div>
          <div className="flex items-center pb-10 text-gray-300 text-2xl">›</div>
          <div className="text-center px-6 py-4 flex-1 min-w-36">
            <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">3</div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Borrow and return</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Request, chat, borrow and return with ease</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-[#FAFAF7]">
        <div className="text-center mb-12">
          <p className="text-xs text-[#5BB88A] tracking-widest font-semibold mb-2">WHAT PEOPLE SAY</p>
          <h2 className="text-2xl font-bold text-gray-900">Trusted by the community</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-5">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} color="#F5A623" fill="#F5A623" />)}
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">"Borrowed a camera for my project. The owner was so helpful and the process was super smooth!"</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0F4C35] flex items-center justify-center text-xs text-white font-semibold">S</div>
              <p className="text-xs font-semibold text-gray-700">Sara M.</p>
            </div>
          </div>
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-5">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} color="#F5A623" fill="#F5A623" />)}
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">"Listed my old projector and someone borrowed it the same day. Great way to help the community!"</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#5BB88A] flex items-center justify-center text-xs text-white font-semibold">A</div>
              <p className="text-xs font-semibold text-gray-700">Ali K.</p>
            </div>
          </div>
          <div className="bg-white border border-[#EDECEA] rounded-2xl p-5">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} color="#F5A623" fill="#F5A623" />)}
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">"ShareHub made it so easy to find what I needed. No need to buy, just borrow and return!"</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center text-xs text-white font-semibold">L</div>
              <p className="text-xs font-semibold text-gray-700">Lara T.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 bg-[#0F4C35] text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border-[40px] border-[#5BB88A] opacity-10" />
        <div className="absolute -bottom-14 -left-10 w-60 h-60 rounded-full border-[50px] border-[#5BB88A] opacity-10" />
        <div className="relative z-10 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to join ShareHub?</h2>
          <p className="text-sm text-[#9FE1CB] mb-8 leading-relaxed">Start borrowing and sharing with your community today. It's completely free.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {session ? (
              <Link href="/resources" className="inline-flex items-center gap-2 bg-[#F5A623] text-[#0F4C35] font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#E09A1F] transition-colors">
                Browse resources <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#F5A623] text-[#0F4C35] font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#E09A1F] transition-colors">
                  Create account <ArrowRight size={15} />
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-7 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-5 bg-[#FAFAF7] border-t border-[#EDECEA] flex justify-between items-center flex-wrap gap-3">
        <Link href="/">
          <Image src="/images/logo.png" alt="ShareHub logo" width={80} height={28} className="object-contain" />
        </Link>
        <p className="text-xs text-gray-400">© 2026 ShareHub · Borrow · Share · Belong</p>
      </footer>

    </div>
  );
}