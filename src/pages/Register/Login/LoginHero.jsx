export default function LoginHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy flex-col justify-between p-12 xl:p-16 overflow-hidden">
      {/* Background Decorative Icons */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <span className="material-symbols-outlined text-white/[0.03] text-[400px] absolute -right-20 -top-20 transform rotate-12">
          school
        </span>
        <span className="material-symbols-outlined text-white/[0.03] text-[300px] absolute -left-10 bottom-0 transform -rotate-12">
          menu_book
        </span>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/50 to-black/20 mix-blend-multiply"></div>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
          <span className="material-symbols-outlined text-brand-gold text-3xl">
            school
          </span>
        </div>
        <span className="font-roboto font-bold text-2xl tracking-tight text-white">
          EntranceGateway
        </span>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-lg mt-auto mb-auto">
        <h1 className="font-roboto text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
          Continue your journey to academic excellence.
        </h1>
        <p className="text-indigo-100/90 text-lg leading-relaxed font-light">
          Unlock thousands of practice questions, expert-curated study materials, and mock exams designed for the top entrance tests in Nepal.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="flex items-center gap-6 text-indigo-200/60 text-sm font-medium">
          <span>© 2024 EntranceGateway</span>
          <span className="w-1 h-1 bg-indigo-200/40 rounded-full"></span>
          <span>Privacy Policy</span>
          <span className="w-1 h-1 bg-indigo-200/40 rounded-full"></span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  );
}
