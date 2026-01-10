/**
 * Old Question Details Page
 * Professional full-page view with embedded PDF viewer
 * 
 * Features:
 * - Full-page PDF viewer with authentication
 * - Professional header with question details
 * - Related materials sidebar
 * - Security protections (no download/print)
 * - Responsive design matching Syllabus page
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileQuestion,
  Calendar,
  GraduationCap,
  BookOpen,
  Library,
  FileText,
  Info,
  Loader2,
  Share2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PdfViewer from "../../components/common/pdf/PdfViewer";
import { fetchPdfBlob, getOldQuestionById, filterOldQuestions } from "../../http/oldQuestions";

/* ============================================
   MAIN PAGE COMPONENT
============================================ */
export default function OldQuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  // Get question data from navigation state
  const questionFromState = history.state?.usr?.question;

  const [question, setQuestion] = useState(questionFromState || null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [loading, setLoading] = useState(!questionFromState);
  const [error, setError] = useState(null);

  // Fetch question details if not available from state
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (questionFromState) {
        setQuestion(questionFromState);
        setLoading(false);
        return;
      }

      if (!id || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOldQuestionById(id, accessToken);
        setQuestion(data);
      } catch (err) {
        console.error("Failed to fetch question:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id, accessToken, questionFromState]);

  // Fetch related questions
  useEffect(() => {
    const fetchRelated = async () => {
      if (!question?.courseName || !accessToken) return;

      try {
        const result = await filterOldQuestions(
          { courseName: question.courseName },
          0,
          5
        );
        // Filter out current question
        const filtered = (result.items || []).filter((q) => q.id !== parseInt(id));
        setRelatedQuestions(filtered.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch related questions:", err);
      }
    };

    fetchRelated();
  }, [question?.courseName, accessToken, id]);

  const formatAffiliation = (aff) => {
    return (
      aff?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "University"
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${question?.subject} - ${question?.year}`,
          text: `Check out this old question paper from Entrance Gateway`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">
          <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
          <p className="text-slate-600 font-medium">
            Loading question paper...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Error or Not Found State
  if (error || !question) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <FileQuestion size={40} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Question Not Found
            </h2>
            <p className="text-slate-500 mb-8">
              {error ||
                "The question paper you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/old-questions")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white 
                         font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              <ArrowLeft size={18} />
              Back to Old Questions
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Auth Required State
  if (!accessToken) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <Lock size={40} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Login Required
            </h2>
            <p className="text-slate-500 mb-8">
              Please log in to view this question paper.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white 
                         font-semibold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              Login to Continue
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const subjectName = question?.subject || "Old Question Paper";
  const courseName = question?.courseName || "Examination";

  return (
    <DashboardLayout>
      <div
        className="bg-white min-h-screen pb-20 pt-7 selection:bg-orange-100"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Header Section */}
        <section className="bg-white border-b border-slate-100 pt-6 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/old-questions")}
              className="flex items-center gap-2 text-slate-500 hover:text-orange-600
                         font-medium mb-6 group transition-colors"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Questions
            </motion.button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 
                               rounded-full uppercase tracking-wider border border-orange-100"
                  >
                    {courseName}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span
                    className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 
                               rounded-full border border-purple-100"
                  >
                    {question.year}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                    <Sparkles size={12} className="text-orange-500" />
                    Entrance Gateway
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {subjectName}
                </h1>
                <p className="text-slate-500 mt-2 text-sm md:text-base">
                  {question.setName} • {formatAffiliation(question.affiliation)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 
                           hover:border-orange-300 hover:bg-orange-50 text-slate-700 font-semibold 
                           transition-all shadow-sm group"
                >
                  <Share2
                    className="w-4 h-4 text-slate-400 group-hover:text-orange-600"
                  />
                  Share
                </button>
                <button
                  onClick={() => {
                    const viewerElement = document.querySelector(
                      ".pdf-viewer-container"
                    );
                    viewerElement?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 
                           hover:bg-orange-600 text-white font-semibold transition-all 
                           shadow-lg shadow-orange-200"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Reading
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-12 gap-8">
          {/* PDF Viewer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="pdf-viewer-container bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
              <PdfViewer
                noteId={id}
                token={accessToken}
                fetchPdfBlob={fetchPdfBlob}
                suburl="/old-question-collections/view"
                urlSuffix=""
              />
            </div>

            {/* About Section */}
            <div className="mt-8 prose prose-slate max-w-none">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-600" />
                About this Question Paper
              </h3>
              <p className="text-slate-600 leading-relaxed">
                This is an official examination question paper for{" "}
                <span className="font-semibold text-slate-900">
                  {subjectName}
                </span>{" "}
                from the year <strong>{question.year}</strong>. These papers are
                curated by <strong>Entrance Gateway</strong> to help students
                prepare effectively for their examinations.
              </p>

              {question.description && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 not-prose mt-6">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    Description
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {question.description}
                  </p>
                </div>
              )}

              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 not-prose mt-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-orange-600" />
                  Question Paper Details
                </h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap size={14} className="text-blue-600" />
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        Course
                      </span>
                    </div>
                    <p className="text-slate-900 font-bold">{courseName}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-purple-600" />
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        Year
                      </span>
                    </div>
                    <p className="text-slate-900 font-bold">{question.year}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={14} className="text-orange-600" />
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        Set
                      </span>
                    </div>
                    <p className="text-slate-900 font-bold">
                      {question.setName}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Library size={14} className="text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-500 uppercase">
                        University
                      </span>
                    </div>
                    <p className="text-slate-900 font-bold text-sm">
                      {formatAffiliation(question.affiliation).split(" ")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Related Questions Card */}
            <div
              className="bg-white rounded-2xl border border-slate-100 shadow-xl 
                        shadow-slate-200/50 p-6 sticky top-8"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-orange-600" />
                Related Questions
              </h2>

              <div className="space-y-3">
                {relatedQuestions.length > 0 ? (
                  relatedQuestions.map((q) => (
                    <Link
                      key={q.id}
                      to={`/old-questions/${q.id}`}
                      state={{ question: q }}
                      onClick={() => window.scrollTo(0, 0)}
                      className="block group"
                    >
                      <div
                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 
                                  hover:bg-white hover:border-orange-200 hover:shadow-md 
                                  transition-all duration-300"
                      >
                        <h3
                          className="font-bold text-slate-800 text-sm mb-1 group-hover:text-orange-600 
                                    transition-colors line-clamp-1"
                        >
                          {q.subject || "Question Paper"}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{q.setName}</span>
                          <span
                            className="bg-white px-2 py-0.5 rounded border border-slate-200 
                                      font-semibold text-orange-600"
                          >
                            {q.year}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <FileQuestion
                      size={32}
                      className="mx-auto mb-2 opacity-50"
                    />
                    No related questions found.
                  </div>
                )}
              </div>

              {relatedQuestions.length > 0 && (
                <Link
                  to="/old-questions"
                  className="block mt-4 text-center text-sm font-semibold text-orange-600 
                           hover:text-orange-700 transition-colors"
                >
                  View All Questions →
                </Link>
              )}

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-orange-900/70 leading-relaxed">
                    Content is protected by{" "}
                    <strong>Entrance Gateway</strong> security protocols.
                    Printing and unauthorized distribution are disabled.
                  </p>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-slate-500" />
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Previous Page</span>
                    <kbd className="px-2 py-0.5 bg-white rounded border border-slate-200 font-mono">
                      ←
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next Page</span>
                    <kbd className="px-2 py-0.5 bg-white rounded border border-slate-200 font-mono">
                      →
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Exit Fullscreen</span>
                    <kbd className="px-2 py-0.5 bg-white rounded border border-slate-200 font-mono">
                      Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* SEO Hidden Text */}
        <div className="hidden">
          {subjectName} Old Questions, {courseName} Past Papers, {question.year}{" "}
          Exam Questions, University Exam Preparation, Entrance Gateway
        </div>
      </div>
    </DashboardLayout>
  );
}