import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Headphones,
  Users,
  BookOpen,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Contact info cards data
const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+977 9800000000", "+977 01-4000000"],
    description: "Mon-Fri from 8am to 6pm",
    color: "orange",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@entrancegateway.com", "support@entrancegateway.com"],
    description: "We reply within 24 hours",
    color: "blue",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Kathmandu, Nepal", "New Baneshwor"],
    description: "Open Monday to Saturday",
    color: "green",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Sun - Fri: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
    description: "Closed on public holidays",
    color: "purple",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

// FAQ data
const faqs = [
  {
    question: "How do I access the study materials?",
    answer:
      "After logging in, navigate to the Notes or Syllabus section. All materials are organized by course and semester for easy access.",
  },
  {
    question: "Are the mock tests free?",
    answer:
      "We offer both free and premium mock tests. Free tests give you a taste of our quality, while premium tests offer comprehensive exam preparation.",
  },
  {
    question: "How can I get support for technical issues?",
    answer:
      "You can reach our support team via email at support@entrancegateway.com or call us during working hours. We typically respond within 24 hours.",
  },
  {
    question: "Can I download notes for offline use?",
    answer:
      "Yes! Premium users can download notes in PDF format for offline studying. This feature is available on all devices.",
  },
];

// Stats data
const stats = [
  { icon: Users, value: "50,000+", label: "Happy Students" },
  { icon: BookOpen, value: "1,200+", label: "Study Materials" },
  { icon: Headphones, value: "24/7", label: "Support Available" },
  { icon: MessageSquare, value: "98%", label: "Response Rate" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  We'd Love to Hear From You
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Get In <span className="text-yellow-300">Touch</span>
              </h1>

              <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                Have questions about our courses, study materials, or need
                support? Our team is here to help you succeed in your entrance
                exam preparation.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                >
                  <stat.icon className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info Cards */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`${info.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}
                >
                  <info.icon className={`w-7 h-7 ${info.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
                <p className="text-gray-400 text-xs mt-2">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Content: Form + Map */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-500">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">
                      Message Sent Successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="courses">Course Information</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-orange-600 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.456749368618!2d85.3325!3d27.6947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQxJzQxLjAiTiA4NcKwMTknNTcuMCJF!5e0!3m2!1sen!2snp!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Entrance Gateway Location"
                  className="w-full h-full"
                />
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Connect With Us
                </h3>
                <p className="text-gray-500 mb-6">
                  Follow us on social media for updates, tips, and study
                  resources.
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      icon: Facebook,
                      name: "Facebook",
                      color: "bg-blue-600 hover:bg-blue-700",
                      url: "#",
                    },
                    {
                      icon: Instagram,
                      name: "Instagram",
                      color: "bg-pink-600 hover:bg-pink-700",
                      url: "#",
                    },
                    {
                      icon: Linkedin,
                      name: "LinkedIn",
                      color: "bg-blue-700 hover:bg-blue-800",
                      url: "#",
                    },
                    {
                      icon: Youtube,
                      name: "YouTube",
                      color: "bg-red-600 hover:bg-red-700",
                      url: "#",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`${social.color} w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110`}
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-linear-to-br from-orange-600 to-amber-500 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Need Quick Help?</h3>
                <p className="text-white/80 mb-6">
                  Check out our resources for instant answers to common
                  questions.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Browse Study Materials", path: "/notes" },
                    { label: "View Courses", path: "/courses" },
                    { label: "Check Syllabus", path: "/syllabus" },
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.path}
                      className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition"
                    >
                      <span className="font-medium">{link.label}</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-lg">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-orange-500"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of successful students who cracked their entrance
                exams with Entrance Gateway.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-linear-to-r from-orange-600 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-600 transition-all shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition border border-white/20"
                >
                  Browse Courses
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ContactPage;