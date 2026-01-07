import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NoticeCard from "../../components/notices/noticeCard";
import Pagination from "../../components/Pagination/pagination";
import { getNoticeById, getNotices } from "../../http/notices";
import { Search, RefreshCcw, Bell, AlertCircle } from "lucide-react";

const PAGE_SIZE = 12;

export default function AddNotice() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [notices, setNotices] = useState([]);
	const [query, setQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalElements, setTotalElements] = useState(0);

	const fetchNotices = async (pageNum = 1, searchQuery = "") => {
		try {
			setError("");
			setLoading(true);

			const res = await getNotices({
				page: pageNum - 1, // Convert to 0-indexed for API
				size: PAGE_SIZE,
				sortBy: "createdDate",
				sortDir: "desc",
			});

			setNotices(res.content || []);
			setCurrentPage(pageNum);
			setTotalPages(res.page?.totalPages || 1);
			setTotalElements(res.page?.totalElements || 0);
		} catch (e) {
			setNotices([]);
			setTotalPages(1);
			setError(e?.message || "Failed to fetch notices");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotices(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sortedAndFiltered = useMemo(() => {
		const q = query.trim().toLowerCase();

		const filtered = !q
			? notices
			: notices.filter((n) => {
					const title = (n?.title || "").toLowerCase();
					const name = (n?.name || n?.imageName || "").toLowerCase();
					return title.includes(q) || name.includes(q);
				});

		// Newest first (fallback to 0 if invalid)
		return [...filtered].sort((a, b) => {
			const ad = Date.parse(a?.createdDate || "") || 0;
			const bd = Date.parse(b?.createdDate || "") || 0;
			return bd - ad;
		});
	}, [notices, query]);

	// Calculate pagination based on filtered results
	const filteredTotalPages = useMemo(() => Math.ceil(sortedAndFiltered.length / PAGE_SIZE), [sortedAndFiltered.length]);
	const paginated = useMemo(
		() => sortedAndFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
		[sortedAndFiltered, currentPage]
	);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleCardClick = async (notice) => {
		try {
			await getNoticeById(notice?.noticeId);
		} catch (e) {
			console.error(e);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
				<div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
					{/* Header Section */}
					<motion.div 
						className="mb-10"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8">
							<div className="flex items-center gap-3">
								<div className="p-4 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
									<Bell className="w-7 h-7 text-white" strokeWidth={2} />
								</div>
								<div>
									<h1 className="text-4xl md:text-5xl font-black text-slate-900">Notices</h1>
									<p className="text-sm text-slate-600 mt-1">
										{loading
											? "Loading notices…"
											: `${sortedAndFiltered.length} notice${sortedAndFiltered.length !== 1 ? "s" : ""} available`}
									</p>
								</div>
							</div>

							{/* Search & Filter Controls */}
							<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
								<div className="relative group">
									<div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-300 blur" />
									<div className="relative">
										<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition" />
										<input
											value={query}
											onChange={(e) => setQuery(e.target.value)}
											placeholder="Search notices…"
											className="w-full sm:w-96 pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200
												focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-400
												transition-all duration-300 shadow-sm hover:shadow-md"
										/>
									</div>
								</div>

						<motion.button
									type="button"
									onClick={() => fetchNotices(currentPage, query)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl 
										bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold
										hover:shadow-lg transition-all duration-300 shadow-md"
								>
									<RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
									<span className="hidden sm:inline">Refresh</span>
								</motion.button>
							</div>
						</div>
					</motion.div>

					{/* Error State */}
					{error && (
						<motion.div 
							className="mb-8 p-5 rounded-2xl border-2 border-red-200 bg-red-50/80 backdrop-blur-sm flex items-start gap-4"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
							<div>
								<h3 className="font-bold text-red-900">Error Loading Notices</h3>
								<p className="text-red-800 text-sm mt-1">{error}</p>
							</div>
						</motion.div>
					)}

					{/* Loading State */}
					{loading ? (
						<div className="flex justify-center items-center h-80">
							<div className="relative">
								<div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-400 rounded-full opacity-30 animate-pulse" />
								<div className="relative animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600" />
							</div>
						</div>
					) : sortedAndFiltered.length === 0 ? (
						<motion.div 
							className="text-center py-24"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<motion.div 
							className="bg-linear-to-br from-slate-200 to-slate-300 border-4 border-dashed border-slate-300 rounded-3xl w-40 h-40 mx-auto mb-8 flex items-center justify-center"
								animate={{ y: [0, -10, 0] }}
								transition={{ duration: 3, repeat: Infinity }}
							>
								<Bell className="w-16 h-16 text-slate-500 opacity-40" />
							</motion.div>
							<p className="text-2xl font-bold text-slate-700 mb-2">No notices found</p>
							<p className="text-slate-500">Try adjusting your search filters</p>
						</motion.div>
					) : (
						<>
							<motion.div 
								className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
								variants={containerVariants}
								initial="hidden"
								animate="visible"
							>
								{paginated.map((notice) => (
									<motion.div
										key={notice.noticeId}
										onClick={() => handleCardClick(notice)}
										variants={itemVariants}
										whileHover={{ y: -4 }}
										className="cursor-pointer"
									>
										<NoticeCard notice={notice} />
									</motion.div>
								))}
							</motion.div>

							{/* Pagination */}
							<Pagination
								currentPage={currentPage}
								totalPages={filteredTotalPages}
								onPageChange={handlePageChange}
								isLoading={loading}
								showPageInfo={true}
							/>
						</>
					)}
				</div>
			</div>
		</DashboardLayout>
	);
}

