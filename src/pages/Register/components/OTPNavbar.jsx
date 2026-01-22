export default function OTPNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            >
              <span className="material-icons-round text-brand-blue text-4xl group-hover:scale-110 transition-transform duration-200">
                school
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-brand-navy leading-none font-roboto">
                  EntranceGateway
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-500 mt-0.5">
                  Secure Login
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
