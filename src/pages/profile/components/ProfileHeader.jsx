export default function ProfileHeader({ user }) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image with Gradient */}
      <div className="h-40 bg-gradient-to-br from-brand-navy via-brand-blue to-indigo-600 relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
      
      {/* Avatar - Positioned below cover */}
      <div className="relative px-8 -mt-16 mb-4">
        <div className="relative inline-block">
          <div className="h-32 w-32 rounded-2xl bg-white p-1.5 shadow-xl">
            <div className="h-full w-full rounded-xl bg-gradient-to-br from-brand-gold to-amber-400 flex items-center justify-center">
              <span className="text-4xl font-bold text-brand-navy">
                {getInitials(user?.fullname)}
              </span>
            </div>
          </div>
          {/* Verified Badge */}
          {user?.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
              <span className="material-symbols-outlined text-white text-lg">
                verified
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-roboto text-brand-navy flex items-center gap-2 mb-2">
              {user?.fullname || "User Name"}
            </h1>
            <p className="text-gray-600 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">school</span>
              {user?.interested ? `${user.interested} Candidate` : "Student"}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-2 ${
              user?.isVerified 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            } text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5`}>
              <span className="material-symbols-outlined text-sm">
                {user?.isVerified ? "check_circle" : "pending"}
              </span>
              {user?.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-blue text-xl">
                  info
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Basic Information
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-purple-600 text-lg">
                    mail
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Email Address</dt>
                  <dd className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email || "N/A"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-600 text-lg">
                    phone
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Contact Number</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {user?.contact || "N/A"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-red-600 text-lg">
                    location_on
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Address</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {user?.address || "N/A"}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 text-xl">
                  school
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Academic Details
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-blue-600 text-lg">
                    favorite
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Interested Course</dt>
                  <dd className="text-sm font-semibold text-brand-blue">
                    {user?.interested || "N/A"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-indigo-600 text-lg">
                    workspace_premium
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Latest Qualification</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {user?.latestQualification || "N/A"}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-pink-600 text-lg">
                    cake
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-gray-500 font-medium mb-1">Date of Birth</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {formatDate(user?.dob)}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
