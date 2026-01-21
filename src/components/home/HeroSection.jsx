import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, BookOpen, CheckCircle } from "lucide-react";

const STUDENT_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCs5xGAQ2dzyM-Krm51veca0hoxL65ILEvsbMN5UVRWlj5weh7Db_mc0juNATgKHTX9cK2coyrkYd33bOjdN8uWJDOkx3EpGYWk5oSArblyz312hzF9z6qR5WYNcycSYg6eMFchH3aXLXiRnn4rPXjNFP9Ko6---yoCtHw8cjoqSBV68XmNmFVVrbZLrctJe_3bnPYwARz9osbxSrhm54nA5LsBzfTMZWHHXxVLAylU-_v7ComoBsjwGGeYg6s76qr5BdrR_KaRdyk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC_y8aFiae_ie9LkngrMOfHfIlMV7OPyzgv6BvffmNzybttz4PHXmxYjsWRrltwzpyxQbmSt79_E0-FI47h7dCUojV0rOMlcUk0Kh0VHayfMTBGVERb3nrwfTWKRGMqn9CGZpqCICQwLhG1vbo_jzy-V3iZHICK_Ec3c9PRZZ-DPIEllIooxzoNP-BwkeeHru_YqsNYsGeg_T2R_KyTd3qDN2NoNG0FmMYo7uJlJRMDtBfRDr7fcFgNV5nIQtTB9Xjrc58myFdCf50",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVChcYiI__0ZFeEi9_tJOvo9PAdrSx_DR4YtXc7kS7Og6fh5H_Ue1VDo2ZW4Rj0ie-Grs_zwym5HIrkJdoto8DAtdeyYinbG_egzhNxNV2I86zybGfqpq3O8G35XAk6gL5ayuBx4X_of-G-ZrFodNBtAeczUvpEIOdr2mcGd5vHKvBpLdhTem-Jy68T6n7gExs_QTubtPvSjNIHAw7fhyLeAxOCWah2JNmnUWK1fcQCK0X47fqoYzzy0kNqvj2I0SXhjVSmmjgCng",
];

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBi8p41NHa5qzsQ61PRvAWVDqaEvGL3S6UCWfYFaFegGldmNtLpkq-sC3ZFblvYe8RSXxd1jKZeEQXUrqYN6u6Abt0GH7J0SsP46-MUMF_CzXYYCwr2sTlbkpbyd6yCi1-4go1m_abcP_FUCnNRFx0xs6krhQkDez79C6DmwZthLNGGRuib6Fj_GJYB9L-SUgt5xqL4NB4nIxb4jtaVoEHKm_np-yEsKXGI33mP96jZI8sS8brsP1Cy5gSjlGY5kAOCGohI80uKsQo";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-accent">
      <div className="absolute inset-0 hero-pattern opacity-10" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-25" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-primary text-sm font-bold mb-8 backdrop-blur-sm">
              <span className="material-icons-round text-primary text-lg">verified</span>
              <span>Nepal's #1 Entrance Preparation Platform</span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Master Your Future <br /> With <span className="text-gradient">Confidence</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-lg font-light opacity-90">
              Join thousands of successful students who transformed their preparation with our comprehensive study materials, mock tests, and expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-accent bg-primary hover:bg-yellow-400 rounded-xl transition-all shadow-glow hover:shadow-[0_0_20px_rgba(255,193,7,0.5)] hover:-translate-y-1 group"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/notes"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-white/30 hover:bg-white/10 hover:border-white/60 rounded-xl transition-all backdrop-blur-sm"
              >
                Browse Free Notes
              </Link>
            </div>

            <div className="flex items-center gap-5 pt-4 border-t border-white/10">
              <div className="flex -space-x-4">
                {STUDENT_AVATARS.map((avatar, i) => (
                  <img
                    key={i}
                    alt="Student"
                    className="w-12 h-12 rounded-full border-2 border-accent object-cover ring-2 ring-white/10"
                    src={avatar}
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-accent bg-secondary flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
                  +2k
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex text-primary mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-medium text-blue-100">Trusted by 50,000+ students</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[650px] flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[4/5] lg:aspect-auto h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                alt="Student thinking"
                className="absolute inset-0 w-full h-full object-cover"
                src={HERO_IMAGE}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent" />

              <div className="absolute top-12 -left-4 lg:-left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce z-20 border border-gray-100" style={{ animationDuration: "3s" }}>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Success Rate</p>
                  <p className="text-xl font-bold text-gray-900">95%</p>
                </div>
              </div>

              <div className="absolute bottom-32 -right-4 lg:-right-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce z-20 border border-gray-100" style={{ animationDuration: "4s" }}>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-yellow-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Resources</p>
                  <p className="text-xl font-bold text-gray-900">1200+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}