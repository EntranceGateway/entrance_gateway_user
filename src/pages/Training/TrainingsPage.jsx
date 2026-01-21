import React, { useEffect, useState } from "react";

import { getTrainings } from "../../http/trainingApi";
import SortButtons from "../../components/Training/SortButtons";
import SkeletonCard from "../../components/Training/SkeletonCard";
import TrainingCard from "../../components/Training/TrainingCard";
import DashboardLayout from "../../components/layout/DashboardLayout";

function TrainingsPage() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    fetchTrainings();
  }, [sortDir]);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const data = await getTrainings(0, 10, sortDir);
      setTrainings(data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section – Attractive & Motivational */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://thumbs.dreamstime.com/b/business-people-listening-to-businessman-asking-questions-conference-rear-view-interactive-diverse-caucasian-raising-140593343.jpg"
            alt="Professional training workshop"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/60 via-amber-600/50 to-red-600/40 mix-blend-multiply" />
        </div>

        <div className="relative px-6 py-24 md:py-32 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Unlock Your Potential
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto font-medium drop-shadow">
            Explore top-tier trainings designed to accelerate your career and skills
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-lg font-semibold border border-white/30 shadow-lg">
              {trainings.length > 0 ? `${trainings.length}+ Trainings` : "Discover Now"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Available Trainings
          </h2>
          <div className="mt-4 md:mt-0">
            <SortButtons sortDir={sortDir} setSortDir={setSortDir} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : trainings.map((training) => (
                <TrainingCard key={training.trainingId} training={training} />
              ))}
        </div>

        {/* Optional: Show message when no trainings */}
        {!loading && trainings.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-xl">No trainings available at the moment.</p>
            <p className="mt-2">Check back soon or adjust your filters!</p>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}

export default TrainingsPage;