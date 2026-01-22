import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CATEGORY_COLORS = {
  medical: { bg: "bg-blue-50", text: "text-brand-blue", border: "border-blue-100" },
  engineering: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" },
  it: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100" },
  default: { bg: "bg-blue-50", text: "text-brand-blue", border: "border-blue-100" }
};

const STATUS_CONFIG = {
  REGISTRATION_OPEN: { text: "REGISTRATION OPEN", color: "text-semantic-success", dotColor: "bg-semantic-success" },
  FILLING_FAST: { text: "FILLING FAST", color: "text-semantic-warning", dotColor: "bg-semantic-warning" },
  WAITLIST_ONLY: { text: "WAITLIST ONLY", color: "text-semantic-warning", dotColor: "bg-semantic-warning" },
  REGISTRATION_CLOSED: { text: "REGISTRATION CLOSED", color: "text-gray-500", dotColor: "bg-gray-500" },
  COMPLETED: { text: "COMPLETED", color: "text-gray-500", dotColor: "bg-gray-500" }
};

const TYPE_ICONS = {
  HYBRID: { icon: "devices", label: "Hybrid" },
  ONLINE: { icon: "wifi", label: "Online" },
  PHYSICAL: { icon: "apartment", label: "Physical" }
};

function TrainingListCard({ training }) {
  const navigate = useNavigate();

  // Map backend fields to component
  const category = training.trainingCategory?.toLowerCase() || "default";
  const categoryColors = CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  const status = training.trainingStatus || "REGISTRATION_OPEN";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.REGISTRATION_OPEN;
  const type = training.trainingType || "HYBRID";
  const typeConfig = TYPE_ICONS[type] || TYPE_ICONS.HYBRID;
  const isClosed = status === "REGISTRATION_CLOSED" || status === "COMPLETED";

  // Calculate capacity percentage for "FILLING_FAST" status
  const capacityPercentage = training.maxParticipants 
    ? (training.currentParticipants / training.maxParticipants) * 100 
    : 0;
  
  const isFillingFast = capacityPercentage >= 75 && status === "REGISTRATION_OPEN";
  const displayStatus = isFillingFast ? "FILLING_FAST" : status;
  const displayStatusConfig = isFillingFast ? STATUS_CONFIG.FILLING_FAST : statusConfig;

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const handleCardClick = () => {
    navigate(`/training/${training.trainingId}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer ${isClosed ? 'opacity-95 bg-gray-50' : ''}`}
    >
      <div className="p-6 md:flex justify-between gap-6">
        {/* Left Content */}
        <div className={`flex-grow ${isClosed ? 'opacity-60' : ''}`}>
          {/* Category and Status Badges */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full ${categoryColors.bg} ${categoryColors.text} text-xs font-bold ${categoryColors.border} border uppercase tracking-wide`}>
              {training.trainingCategory || "Training"}
            </span>
            <span className={`flex items-center gap-1 ${displayStatusConfig.color} text-xs font-bold`}>
              <span className={`h-2 w-2 rounded-full ${displayStatusConfig.dotColor}`}></span>
              {displayStatusConfig.text}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold ${isClosed ? 'text-gray-600' : 'text-brand-navy'} font-display mb-2 group-hover:text-brand-blue transition-colors`}>
            {training.trainingName}
          </h3>

          {/* Description */}
          <p className={`${isClosed ? 'text-gray-500' : 'text-gray-600'} mb-6 max-w-2xl text-sm leading-relaxed`}>
            {training.description || "Comprehensive training program designed to help you excel in your entrance examinations."}
          </p>

          {/* Training Details Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${isClosed ? 'grayscale' : ''}`}>
            <div className={`flex items-center gap-2 ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              <span className={`material-icons-round ${isClosed ? 'text-gray-400' : 'text-gray-400'} text-xl`}>schedule</span>
              <div>
                <p className={`text-xs ${isClosed ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                <p className="font-semibold">{training.trainingHours ? `${training.trainingHours} Hours` : "TBD"}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              <span className={`material-icons-round ${isClosed ? 'text-gray-400' : 'text-gray-400'} text-xl`}>payments</span>
              <div>
                <p className={`text-xs ${isClosed ? 'text-gray-400' : 'text-gray-500'}`}>Price</p>
                <p className="font-semibold">NPR {training.price ? training.price.toLocaleString() : "TBD"}</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              <span className={`material-icons-round ${isClosed ? 'text-gray-400' : 'text-gray-400'} text-xl`}>group</span>
              <div>
                <p className={`text-xs ${isClosed ? 'text-gray-400' : 'text-gray-500'}`}>Capacity</p>
                <p className="font-semibold">
                  {training.currentParticipants || 0} <span className="text-gray-400 font-normal">/ {training.maxParticipants || 0} filled</span>
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              <span className={`material-icons-round ${isClosed ? 'text-gray-400' : 'text-gray-400'} text-xl`}>calendar_month</span>
              <div>
                <p className={`text-xs ${isClosed ? 'text-gray-400' : 'text-gray-500'}`}>Dates</p>
                <p className="font-semibold">
                  {formatDate(training.startDate)} - {formatDate(training.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className={`mt-6 md:mt-0 md:w-48 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l ${isClosed ? 'border-gray-200' : 'border-gray-100'} pt-6 md:pt-0 md:pl-6`}>
          {/* Format */}
          <div className="text-center md:text-right mb-2">
            <span className="block text-xs text-gray-500">Format</span>
            <span className={`font-medium ${isClosed ? 'text-gray-600' : 'text-brand-navy'} flex items-center justify-center md:justify-end gap-1`}>
              <span className="material-icons-round text-sm">{typeConfig.icon}</span>
              {typeConfig.label}
            </span>
          </div>

          {/* CTA Buttons */}
          {isClosed ? (
            <>
              <button
                disabled
                className="w-full bg-gray-200 text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed text-sm uppercase tracking-wide"
              >
                Closed
              </button>
              <Link
                to={`/training/${training.trainingId}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-center text-gray-500 hover:text-brand-blue font-medium text-sm transition-colors flex items-center justify-center gap-1"
              >
                <span>Join Waitlist</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/training/${training.trainingId}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-navy font-bold py-3 px-4 rounded-lg shadow-sm transition-colors text-sm uppercase tracking-wide text-center"
              >
                Enroll Now
              </Link>
              <Link
                to={`/training/${training.trainingId}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-center text-brand-blue hover:text-brand-navy font-medium text-sm transition-colors flex items-center justify-center gap-1"
              >
                <span>View Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainingListCard;
