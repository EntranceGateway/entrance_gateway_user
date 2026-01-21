import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrainingById, enrollTraining } from "../../http/trainingApi";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  Download, 
  Loader2, 
  MessageCircle, 
  ShieldCheck, 
  Banknote,
  X,
  User,
  Mail,
  Phone
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Config constants
const QR_CODE_URL = "../../src/assets/qr.png";
const WHATSAPP_NUMBER = "+9779815497437";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

// --- Internal Components ---

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-1">
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-gray-900 font-medium mt-0.5 leading-snug">
        {value}
      </p>
    </div>
  </div>
);

const Badge = ({ children, icon: Icon }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm">
    {Icon && <Icon className="w-3 h-3 mr-1.5" />}
    {children}
  </span>
);

function TrainingDetail() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form visibility & data
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

  // 1. Fetch Training Data
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

  // 2. AUTO-FILL USER DATA FROM LOCAL STORAGE
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

  // Reset errors when form values change
  useEffect(() => {
    setFormErrors({});
  }, [formData]);

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


  // --- Loading State ---
  if (loading) {
    return (
      <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
      </div>
      </DashboardLayout>
    );
  }

  // --- Not Found State ---
  if (!training) {
    return (
      <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="text-6xl mb-4 grayscale opacity-50">😕</div>
        <h2 className="text-2xl font-bold text-gray-800">Training not found</h2>
        <p className="text-gray-500 mt-2">The training you are looking for might have been removed.</p>
        <Link to="/" className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* --- UPDATED HERO SECTION --- */}
      <div className="relative bg-orange-600 text-white overflow-hidden">
        {/* Animated Bubbles Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-20 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce transition-all duration-1000"></div>
          <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        </div>

        {/* Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 opacity-90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link to="/trainings" className="inline-flex items-center text-sm text-orange-100 hover:text-white mb-6 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Trainings
          </Link>
          
          <span className="inline-block px-3 py-1 rounded bg-orange-700/50 text-orange-100 font-bold tracking-wider uppercase text-xs mb-3 backdrop-blur-sm border border-orange-400/30">
            {training.trainingCategory}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl drop-shadow-sm">
            {training.trainingName}
          </h1>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {training.certificateProvided && (
              <Badge icon={Award}>Certificate Included</Badge>
            )}
            <Badge icon={Clock}>{training.trainingHours} Hours Content</Badge>
            <Badge icon={Banknote}>Value for Money</Badge>
          </div>
        </div>
      </div>
      {/* --- END HERO SECTION --- */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* --- LEFT COLUMN: Description (Cols 1-8) --- */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* SUCCESS VIEW */}
            {enrollment && (
               <div className="bg-green-50 rounded-2xl p-6 md:p-8 border border-green-100 shadow-sm animate-fade-in-up">
                 <div className="flex items-start md:items-center gap-4 mb-6">
                   <div className="bg-green-100 p-3 rounded-full text-green-600 flex-shrink-0">
                     <CheckCircle className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">Enrollment Successful!</h3>
                     <p className="text-gray-600 text-sm mt-1">
                       Reference ID: <span className="font-mono bg-green-100 px-2 py-0.5 rounded text-green-800">{enrollment.id || "N/A"}</span>
                     </p>
                   </div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                   <h4 className="font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100 flex items-center">
                     <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                     Final Step: Payment Verification
                   </h4>
                   <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                     To finalize your seat for <strong>{training.trainingName}</strong>, please complete the payment via the QR code below and send the screenshot to our WhatsApp.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                     <div className="flex-shrink-0 bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                        <img 
                          src={QR_CODE_URL} 
                          alt="Payment QR" 
                          className="w-40 h-40 object-contain" 
                        />
                     </div>
                     <div className="flex-1 text-center sm:text-left pt-2">
                        <p className="text-sm font-medium text-gray-500 mb-2">Send screenshot to:</p>
                        <a 
                          href={WHATSAPP_LINK} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg group"
                        >
                          <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">Chat on WhatsApp</span>
                        </a>
                        <p className="text-xs text-gray-400 mt-3 flex items-center justify-center sm:justify-start">
                          <Clock className="w-3 h-3 mr-1" /> Usually replies within 1 hour
                        </p>
                     </div>
                   </div>
                 </div>
               </div>
            )}

            {/* DEFAULT VIEW */}
            {!enrollment && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                About this Training
              </h2>
              <div className="prose prose-indigo prose-lg max-w-none text-gray-600 leading-relaxed">
                <p>{training.description}</p>
                
                {training.remarks && (
                   <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start">
                     <ShieldCheck className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                     <p className="text-amber-800 font-medium text-sm m-0">{training.remarks}</p>
                   </div>
                )}
              </div>

              {training.materialsLink && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                  <a
                    href={training.materialsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    <Download className="w-4 h-4 mr-2 text-gray-500" />
                    Download Syllabus / Materials
                  </a>
                </div>
              )}
            </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Sticky Sidebar --- */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              
              {/* Action Card */}
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden ring-1 ring-gray-900/5">
                
                {/* Price Header */}
                <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                   <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Price</span>
                   <span className="text-3xl font-bold text-indigo-600">
                    <span className="text-lg font-medium text-gray-400 mr-1">Rs.</span> 
                    {Number(training.price).toLocaleString()}
                   </span>
                </div>

                {/* Info List */}
                <div className="px-6 py-4">
                  <DetailRow 
                    icon={Calendar} 
                    label="Start Date" 
                    value={training.startDate} 
                  />
                  <DetailRow 
                    icon={Clock} 
                    label="Duration" 
                    value={`${training.trainingHours} Hours`} 
                  />
                  <DetailRow 
                    icon={MapPin} 
                    label="Location" 
                    value={training.location} 
                  />
                </div>

                {/* Buttons / Form */}
                <div className="px-6 pb-6 pt-2">
                  {!enrollment ? (
                    !showForm ? (
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                      >
                        Enroll Now <ArrowLeft className="w-5 h-5 rotate-180" />
                      </button>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                           <h3 className="font-bold text-gray-800">Your Details</h3>
                           <button 
                              onClick={() => setShowForm(false)} 
                              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                           >
                             <X className="w-5 h-5" />
                           </button>
                        </div>
                        
                        <form onSubmit={handleEnrollment} className="space-y-4">
                          <input type="hidden" name="trainingId" value={id} />

                          {submitError && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              {submitError}
                            </div>
                          )}

                          <div className="space-y-3">
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                  name="userName"
                                  placeholder="Full Name"
                                  value={formData.userName}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition outline-none ${formErrors.userName ? "border-red-400" : "border-gray-200"}`}
                                />
                            </div>
                            
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                  name="email"
                                  type="email"
                                  placeholder="Email Address"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition outline-none ${formErrors.email ? "border-red-400" : "border-gray-200"}`}
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                  name="phone"
                                  placeholder="Phone Number"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition outline-none ${formErrors.phone ? "border-red-400" : "border-gray-200"}`}
                                />
                            </div>

                            <div className="relative">
                                <Banknote className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <select
                                  name="paymentMethod"
                                  value={formData.paymentMethod}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition outline-none text-gray-700 appearance-none ${formErrors.paymentMethod ? "border-red-400" : "border-gray-200"}`}
                                >
                                  <option value="">Select Payment Method</option>
                                  <option value="Bank Transfer">Bank Transfer</option>
                                  <option value="E-Wallet">E-Wallet (eSewa/Khalti)</option>
                                  <option value="Cash">Cash at Location</option>
                                </select>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={enrollLoading}
                              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {enrollLoading ? (
                                <>
                                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                  Processing...
                                </>
                              ) : (
                                "Confirm Enrollment"
                              )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-3 flex justify-center items-center gap-1">
                               <ShieldCheck className="w-3 h-3" /> Secure Enrollment
                            </p>
                          </div>
                        </form>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="inline-flex items-center text-green-700 font-semibold text-sm">
                           <CheckCircle className="w-5 h-5 mr-2" />
                           You are enrolled!
                        </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Box */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100 shadow-sm">
                 <h4 className="font-bold text-indigo-900 mb-1 text-sm flex items-center">
                   <MessageCircle className="w-4 h-4 mr-2" /> Have questions?
                 </h4>
                 <p className="text-indigo-700/80 text-xs mb-3 pl-6">
                   Not sure if this course is right for you? Talk to an expert.
                 </p>
                 <a 
                  href={WHATSAPP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline pl-6 inline-flex items-center"
                 >
                   Chat on WhatsApp <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                 </a>
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