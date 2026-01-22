import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrainingById, enrollTraining } from "../../http/trainingApi";
import { 
  ChevronRight,
  ArrowRight,
  Download,
  Loader2,
  ChevronDown,
  X,
  User,
  Mail,
  Phone,
  Award,
  Clock,
  Banknote,
  Calendar,
  MapPin,
  CheckCircle,
  ShieldCheck,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { v4 as uuidv4 } from 'uuid';

function TrainingDetail() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [enrollment, setEnrollment] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch Training Data
  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      try {
        const data = await getTrainingById(id);
        setTraining(data.data || data);
      } catch (err) {
        console.error("Failed to load training:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, [id]);

  // Auto-fill user data from localStorage
  useEffect(() => {
    const cachedData = localStorage.getItem("cachedUser");
    if (cachedData) {
      try {
        const user = JSON.parse(cachedData);
        setFormData((prev) => ({
          ...prev,
          userName: user.fullname || "", 
          email: user.email || "",
          phone: user.contact || "" 
        }));
      } catch (error) {
        console.error("Error parsing cached user data:", error);
      }
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.trim()) errors.userName = "Full name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.phone || formData.phone.length < 9)
      errors.phone = "Valid phone number is required";
    if (!formData.paymentMethod)
      errors.paymentMethod = "Please select a payment method";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEnrollment = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;

    setEnrollLoading(true);
    try {
      const enrollmentData = new FormData(e.target);
      const response = await enrollTraining(id, enrollmentData);
      setEnrollment(response.data || response);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Enrollment failed.";
      setSubmitError(msg);
    } finally {
      setEnrollLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusBadge = () => {
    const status = training?.trainingStatus || "REGISTRATION_OPEN";
    if (status === "REGISTRATION_OPEN") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-semantic-success text-white border border-white/10 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          REGISTRATION OPEN
        </span>
      );
    }
    return null;
  };

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
          <p className="mt-4 text-gray-500 font-medium">Loading training details...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Not Found State
  if (!training) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800">Training not found</h2>
          <p className="text-gray-500 mt-2">The training you are looking for might have been removed.</p>
          <Link to="/training" className="mt-6 inline-flex items-center text-brand-blue hover:text-brand-navy font-semibold">
            Back to Trainings
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const seatsLeft = training.maxParticipants - (training.currentParticipants || 0);
  const capacityPercentage = training.maxParticipants 
    ? ((training.currentParticipants || 0) / training.maxParticipants) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-brand-navy text-white pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
              <Link to="/training" className="hover:text-white transition-colors">Trainings</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{training.trainingName}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-blue text-white border border-white/10">
                {training.trainingCategory || "Training"}
              </span>
              {getStatusBadge()}
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-tight max-w-4xl mb-4">
              {training.trainingName}
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl font-light leading-relaxed">
              {training.description || "Comprehensive training program designed to help you excel."}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About the Course */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-brand-navy mb-4 font-display">About the Course</h2>
                <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
                  <p>{training.syllabusDescription || training.description}</p>
                </div>

                {/* Technical Prerequisites */}
                {training.remarks && (
                  <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue mt-1">
                        <span className="material-icons-round">terminal</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-navy text-lg mb-2">Important Information</h3>
                        <p className="text-sm text-gray-600">{training.remarks}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Syllabus */}
              {training.materialsLink && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-navy font-display">Course Syllabus</h2>
                    <a 
                      href={training.materialsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue font-medium text-sm hover:underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((module) => (
                      <div key={module} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="bg-brand-navy text-white text-xs font-bold px-2 py-1 rounded">
                              Module {String(module).padStart(2, '0')}
                            </span>
                            <span className="font-bold text-gray-900">Course Module {module}</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Training Snapshot Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
                  
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-brand-navy mb-1">Training Snapshot</h3>
                    <p className="text-xs text-gray-500">Key metrics for your enrollment decision.</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Price */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        <span className="material-icons-round">payments</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Investment</p>
                        <p className="text-lg font-bold text-brand-navy">NPR {training.price ? training.price.toLocaleString() : "TBD"}</p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        <span className="material-icons-round">schedule</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Duration</p>
                        <p className="text-gray-900 font-medium">{training.trainingHours || 0} Hours</p>
                      </div>
                    </div>

                    {/* Delivery Type */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        <span className="material-icons-round">class</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Delivery Type</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-brand-navy text-white">
                          {training.trainingType || "HYBRID"}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                        <span className="material-icons-round">location_on</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                        <p className="text-gray-900 font-medium">{training.location || "TBD"}</p>
                      </div>
                    </div>

                    {/* Certification */}
                    {training.certificateProvided && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                          <span className="material-icons-round">workspace_premium</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Certification</p>
                          <p className="text-gray-900 font-medium">Included upon completion</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seats & CTA */}
                  <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-medium mb-2">
                        <span className="text-gray-600">Seats Available</span>
                        <span className="text-brand-navy font-bold">{seatsLeft} / {training.maxParticipants || 0} Left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-brand-blue h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${capacityPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">
                        {training.currentParticipants || 0} participants currently enrolled
                      </p>
                    </div>

                    {!enrollment ? (
                      !showForm ? (
                        <button
                          onClick={() => setShowForm(true)}
                          className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
                        >
                          Register Now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-800 text-sm">Enrollment Form</h4>
                            <button 
                              onClick={() => setShowForm(false)} 
                              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <form onSubmit={handleEnrollment} className="space-y-3">
                            {submitError && (
                              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100">
                                {submitError}
                              </div>
                            )}

                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <input
                                name="userName"
                                placeholder="Full Name"
                                value={formData.userName}
                                onChange={handleInputChange}
                                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-brand-blue transition outline-none ${formErrors.userName ? "border-red-400" : "border-gray-300"}`}
                              />
                            </div>

                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-brand-blue transition outline-none ${formErrors.email ? "border-red-400" : "border-gray-300"}`}
                              />
                            </div>

                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <input
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-brand-blue transition outline-none ${formErrors.phone ? "border-red-400" : "border-gray-300"}`}
                              />
                            </div>

                            <select
                              name="paymentMethod"
                              value={formData.paymentMethod}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:ring-brand-blue transition outline-none ${formErrors.paymentMethod ? "border-red-400" : "border-gray-300"}`}
                            >
                              <option value="">Select Payment Method</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="E-Wallet">E-Wallet (eSewa/Khalti)</option>
                              <option value="Cash">Cash at Location</option>
                            </select>

                            <button
                              type="submit"
                              disabled={enrollLoading}
                              className="w-full py-2.5 bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold rounded-lg shadow-sm transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                              {enrollLoading ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                  Processing...
                                </>
                              ) : (
                                "Confirm Enrollment"
                              )}
                            </button>
                          </form>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-700 font-semibold text-sm">✓ Enrollment Successful!</span>
                      </div>
                    )}

                    <p className="text-center text-xs text-gray-500 mt-3">
                      Need help? <a href="#" className="text-brand-blue underline">Talk to an advisor</a>
                    </p>
                  </div>
                </div>

                {/* Instructor Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="material-icons-round text-gray-400 text-3xl">person</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Lead Instructor</p>
                    <p className="font-bold text-brand-navy">Expert Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TrainingDetail;
