import React from "react";
import { Megaphone, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Professional, attractive notice card with modern design
export default function NoticeCard({ notice }) {
	const navigate = useNavigate();
	if (!notice) return null;

	const formatName = (raw) => {
		if (!raw) return "";
		const afterUnderscore = raw.includes("_") ? raw.split("_").slice(1).join("_") : raw;
		return afterUnderscore.replace(/\.(png|jpg|jpeg|pdf|webp)$/i, "").trim();
	};

	const title = notice.title || "";
	const name = formatName(notice.name || notice.imageName || "");

	return (
		<article
			onClick={() => navigate(`/notices/${notice?.noticeId}`)}
			className="group relative bg-white rounded-3xl border border-slate-200/60
								 hover:border-blue-300 transition-all duration-500 ease-out
								 shadow-sm hover:shadow-[0_25px_50px_rgba(37,99,235,0.15)]
								 overflow-hidden cursor-pointer transform hover:-translate-y-2"
		>
			{/* Animated gradient background on hover */}
			<div className="absolute inset-0 bg-linear-to-br from-blue-50/0 to-blue-100/0
						  group-hover:from-blue-50/40 group-hover:to-blue-100/20 transition-all duration-500" />

			{/* Decorative animated accent */}
			<div className="absolute -top-12 -right-12 w-44 h-44 rounded-full 
							  bg-linear-to-br from-blue-100 to-blue-50
						  group-hover:from-blue-200 group-hover:to-blue-100 
						  transition-all duration-700 opacity-50 group-hover:opacity-70
						  transform group-hover:scale-125" />

			<div className="p-6 md:p-8 relative">
				{/* Header with icon and badge */}
				<div className="flex items-start justify-between mb-5">
					<div className="p-3.5 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl
									shadow-lg shadow-blue-200/50 group-hover:shadow-blue-300/60
										  group-hover:rotate-6 group-hover:scale-125 group-hover:bg-linear-to-br
									group-hover:from-blue-500 group-hover:to-blue-600
									transition-all duration-400">
						<Megaphone className="w-6 h-6 text-white" strokeWidth={2.5} />
					</div>
					<span className="text-[9px] font-bold uppercase tracking-widest text-blue-700 
								 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200
								 flex items-center gap-1.5 group-hover:bg-blue-100 transition-colors">
						<Sparkles className="w-3 h-3" />
						Notice
					</span>
				</div>

				{/* Title with better hierarchy */}
				<h3 className="text-xl font-black text-slate-900 mb-3 leading-snug
									group-hover:text-blue-700 transition-colors duration-300
									line-clamp-3">
					{title}
				</h3>

				{/* Subtitle/Name */}
				<p className="text-sm font-medium text-slate-600 leading-relaxed line-clamp-2 
						  mb-5 group-hover:text-slate-700 transition-colors">
					{name}
				</p>

				{/* Footer CTA */}
				<div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
					<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
						View Details
					</span>
					<div className="w-11 h-11 flex items-center justify-center rounded-full 
								 bg-gradient-to-br from-slate-50 to-slate-100
								 group-hover:from-blue-600 group-hover:to-blue-700 
								 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200/50
								 transition-all duration-400 transform group-hover:scale-110">
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</div>
		</article>
	);
}

