export default function RegisterHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0 bg-brand-navy flex-col justify-between overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="University Campus Library"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ElSTai_e9UEeuMd2SBR7YVPAFf6EKYQE7VA-mL5FSWAjyZLs5TczCrj4Uiq9Zxc4Gux3w8__ljRCyVd85JJ3YQ47qMd0c2En6QlKFOJEa-25wgA68Hxu02-5dSgNZDxGuOzmOdTbU3j8Vrtt13lhbafZYgzPhpJY3TaIEE2LyQIxzACJ-SrBu4C6n_Fa78OJaApR5GqcAi8K2bx0Zr_VFd3N2kUKqMkJs6q8_PoNzBHvecw-09VFF1wKu0BxgQ_Nf4QQ9xcZcmk"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-12 flex flex-col h-full justify-center text-white">
        {/* Logo */}
        <div className="flex items-center gap-2 absolute top-12 left-12">
          <span className="material-icons-round text-brand-gold text-3xl">school</span>
          <span className="font-bold text-xl tracking-tight font-roboto">
            EntranceGateway
          </span>
        </div>

        {/* Main Content - Centered */}
        <div className="max-w-md">
          <h2 className="text-4xl font-bold font-roboto leading-tight mb-6">
            Your journey to <br />
            <span className="text-brand-gold">academic excellence</span>
            <br />
            starts here.
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed font-light">
            Join over 50,000 students across Nepal preparing for their Engineering,
            Medical, and Management entrance exams with our adaptive learning platform.
          </p>

          {/* Features */}
          <div className="mt-8 flex gap-4 items-center text-sm text-gray-300 font-medium flex-wrap">
            <div className="flex items-center gap-1">
              <span className="material-icons-round text-brand-gold text-lg">
                check_circle
              </span>
              <span>Live Classes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-icons-round text-brand-gold text-lg">
                check_circle
              </span>
              <span>Mock Tests</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-icons-round text-brand-gold text-lg">
                check_circle
              </span>
              <span>Expert Mentors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
