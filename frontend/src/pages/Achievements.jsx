import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Achievements = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState("all");

  // Sample data - in a real app, this would come from your API
  const mockAchievements = [
    {
      _id: "1",
      name: "Welcome Aboard",
      description: "Complete your profile setup",
      icon: "🎯",
      badgeImage: "https://picsum.photos/seed/ach1/200",
      requirements: "Fill in all the required fields in your profile",
      rewardCredits: 10,
      type: "onboarding",
      criteria: {
        profileCompleted: true,
      },
      progress: {
        current: 1,
        total: 1,
      },
      dateEarned: "2025-03-15T10:00:00Z",
      isEarned: true,
    },
    {
      _id: "2",
      name: "Content Explorer",
      description: "View 10 different content pieces",
      icon: "🔍",
      badgeImage: "https://picsum.photos/seed/ach2/200",
      requirements: "Access 10 unique content resources",
      rewardCredits: 15,
      type: "learning",
      criteria: {
        uniqueContentViewed: 10,
      },
      progress: {
        current: 8,
        total: 10,
      },
      isEarned: false,
    },
    {
      _id: "3",
      name: "Engaged Learner",
      description: "Spend 5 hours learning on the platform",
      icon: "⏱️",
      badgeImage: "https://picsum.photos/seed/ach3/200",
      requirements: "Accumulate 5 hours of learning time",
      rewardCredits: 20,
      type: "learning",
      criteria: {
        learningTime: 5 * 60, // 5 hours in minutes
      },
      progress: {
        current: 180, // 3 hours in minutes
        total: 300, // 5 hours in minutes
      },
      isEarned: false,
    },
    {
      _id: "4",
      name: "First Comment",
      description: "Leave your first comment on the forum",
      icon: "💬",
      badgeImage: "https://picsum.photos/seed/ach4/200",
      requirements: "Post a comment on any forum topic",
      rewardCredits: 5,
      type: "social",
      criteria: {
        commentsMade: 1,
      },
      progress: {
        current: 1,
        total: 1,
      },
      dateEarned: "2025-03-20T14:30:00Z",
      isEarned: true,
    },
    {
      _id: "5",
      name: "Content Creator",
      description: "Create your first forum post",
      icon: "✍️",
      badgeImage: "https://picsum.photos/seed/ach5/200",
      requirements: "Create a new forum topic",
      rewardCredits: 15,
      type: "social",
      criteria: {
        postsCreated: 1,
      },
      progress: {
        current: 1,
        total: 1,
      },
      dateEarned: "2025-03-25T09:15:00Z",
      isEarned: true,
    },
    {
      _id: "6",
      name: "Credit Hoarder",
      description: "Accumulate 100 credits",
      icon: "💰",
      badgeImage: "https://picsum.photos/seed/ach6/200",
      requirements: "Earn a total of 100 credits through platform activity",
      rewardCredits: 25,
      type: "credits",
      criteria: {
        creditsEarned: 100,
      },
      progress: {
        current: 75,
        total: 100,
      },
      isEarned: false,
    },
    {
      _id: "7",
      name: "Path Pioneer",
      description: "Complete your first learning path",
      icon: "🛤️",
      badgeImage: "https://picsum.photos/seed/ach7/200",
      requirements: "Finish all modules in any learning path",
      rewardCredits: 30,
      type: "learning",
      criteria: {
        pathsCompleted: 1,
      },
      progress: {
        current: 0,
        total: 1,
      },
      isEarned: false,
    },
    {
      _id: "8",
      name: "Social Butterfly",
      description: "Connect with 5 other users",
      icon: "🦋",
      badgeImage: "https://picsum.photos/seed/ach8/200",
      requirements: "Follow or connect with 5 other platform users",
      rewardCredits: 20,
      type: "social",
      criteria: {
        connections: 5,
      },
      progress: {
        current: 3,
        total: 5,
      },
      isEarned: false,
    },
    {
      _id: "9",
      name: "Regular Visitor",
      description: "Log in for 7 consecutive days",
      icon: "📅",
      badgeImage: "https://picsum.photos/seed/ach9/200",
      requirements: "Access the platform for a week straight",
      rewardCredits: 25,
      type: "engagement",
      criteria: {
        consecutiveLogins: 7,
      },
      progress: {
        current: 4,
        total: 7,
      },
      isEarned: false,
    },
    {
      _id: "10",
      name: "Resource Collector",
      description: "Save 10 resources to your library",
      icon: "📚",
      badgeImage: "https://picsum.photos/seed/ach10/200",
      requirements: "Add 10 different content items to your personal library",
      rewardCredits: 15,
      type: "learning",
      criteria: {
        savedResources: 10,
      },
      progress: {
        current: 6,
        total: 10,
      },
      isEarned: false,
    },
    {
      _id: "11",
      name: "Feedback Provider",
      description: "Rate 5 different content pieces",
      icon: "⭐",
      badgeImage: "https://picsum.photos/seed/ach11/200",
      requirements: "Leave ratings on 5 unique content resources",
      rewardCredits: 10,
      type: "engagement",
      criteria: {
        contentRated: 5,
      },
      progress: {
        current: 3,
        total: 5,
      },
      isEarned: false,
    },
    {
      _id: "12",
      name: "Forum Enthusiast",
      description: "Create 5 forum posts and 10 comments",
      icon: "🗣️",
      badgeImage: "https://picsum.photos/seed/ach12/200",
      requirements: "Be an active forum participant",
      rewardCredits: 35,
      type: "social",
      criteria: {
        postsCreated: 5,
        commentsMade: 10,
      },
      progress: {
        current: {
          postsCreated: 2,
          commentsMade: 8,
        },
        total: {
          postsCreated: 5,
          commentsMade: 10,
        },
      },
      isEarned: false,
    },
  ];

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        // In a real app, you would call your API
        // const response = await fetch('/api/achievements');
        // const data = await response.json();

        // Simulating API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setAchievements(mockAchievements);
        setUserAchievements(
          mockAchievements.filter((achievement) => achievement.isEarned)
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load achievements. Please try again later.");
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowDetailModal(true);
  };

  const getFilteredAchievements = () => {
    switch (filter) {
      case "earned":
        return achievements.filter((a) => a.isEarned);
      case "progress":
        return achievements.filter((a) => !a.isEarned);
      case "onboarding":
      case "learning":
      case "social":
      case "credits":
      case "engagement":
        return achievements.filter((a) => a.type === filter);
      default:
        return achievements;
    }
  };

  // Calculate overall achievement progress
  const totalAchievements = achievements.length;
  const earnedAchievements = achievements.filter((a) => a.isEarned).length;
  const achievementCompletionPercentage =
    totalAchievements > 0
      ? Math.round((earnedAchievements / totalAchievements) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header with achievement stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="mt-2 text-gray-600">
            Track your progress and earn rewards as you engage with the platform
          </p>

          {/* Achievement progress card */}
          <div className="mt-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Achievement Progress
                </h2>
                <p className="mt-1 text-gray-600">
                  {earnedAchievements} of {totalAchievements} achievements
                  unlocked ({achievementCompletionPercentage}%)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">
                  Recent reward:
                </span>
                {userAchievements.length > 0 ? (
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 text-yellow-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {userAchievements[0].rewardCredits}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">None yet</span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${achievementCompletionPercentage}%` }}
              ></div>
            </div>

            {/* Next achievements to earn */}
            {achievements.filter((a) => !a.isEarned).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Next achievements to earn:
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {achievements
                    .filter((a) => !a.isEarned)
                    .slice(0, 3)
                    .map((achievement) => (
                      <div
                        key={achievement._id}
                        className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center cursor-pointer hover:bg-gray-200"
                        onClick={() => handleAchievementClick(achievement)}
                      >
                        <span className="mr-1">{achievement.icon}</span>
                        <span className="font-medium">{achievement.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("earned")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "earned"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Earned
          </button>
          <button
            onClick={() => setFilter("progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("learning")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "learning"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Learning
          </button>
          <button
            onClick={() => setFilter("social")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "social"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Social
          </button>
          <button
            onClick={() => setFilter("engagement")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === "engagement"
                ? "bg-blue-100 text-blue-800"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Engagement
          </button>
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredAchievements().length > 0 ? (
            getFilteredAchievements().map((achievement) => (
              <div
                key={achievement._id}
                className={`bg-white rounded-lg overflow-hidden shadow-sm border ${
                  achievement.isEarned ? "border-green-200" : "border-gray-200"
                } hover:shadow-md transition cursor-pointer`}
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-2xl ${
                          achievement.isEarned ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {achievement.isEarned && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Earned
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress section */}
                  <div className="mt-4">
                    {!achievement.isEarned ? (
                      <>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          {typeof achievement.progress.current === "object" ? (
                            <span>Multiple criteria</span>
                          ) : (
                            <span>
                              {achievement.progress.current} /{" "}
                              {achievement.progress.total}
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width:
                                typeof achievement.progress.current === "object"
                                  ? `${
                                      (Object.values(
                                        achievement.progress.current
                                      ).reduce((a, b) => a + b, 0) /
                                        Object.values(
                                          achievement.progress.total
                                        ).reduce((a, b) => a + b, 0)) *
                                      100
                                    }%`
                                  : `${
                                      (achievement.progress.current /
                                        achievement.progress.total) *
                                      100
                                    }%`,
                            }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {achievement.dateEarned
                            ? new Date(
                                achievement.dateEarned
                              ).toLocaleDateString()
                            : "Date unknown"}
                        </div>
                        <div className="flex items-center text-sm">
                          <svg
                            className="h-4 w-4 text-yellow-500 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            {achievement.rewardCredits}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No achievements found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your filter selection or continue using the
                platform to earn achievements.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Achievement detail modal */}
      {showDetailModal && selectedAchievement && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
            <div className="relative">
              <img
                src={selectedAchievement.badgeImage}
                alt={selectedAchievement.name}
                className="w-full h-48 object-cover"
              />

              {/* Badge overlay for earned achievements */}
              {selectedAchievement.isEarned && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  EARNED
                </div>
              )}

              {/* Close button */}
              <button
                className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-50 rounded-full p-1"
                onClick={() => setShowDetailModal(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Badge icon */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full text-3xl border-4 border-white ${
                    selectedAchievement.isEarned
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {selectedAchievement.icon}
                </div>
              </div>
            </div>

            <div className="px-6 pt-10 pb-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedAchievement.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">
                  Requirements
                </h4>
                <p className="mt-1 text-sm text-gray-800">
                  {selectedAchievement.requirements}
                </p>
              </div>

              {!selectedAchievement.isEarned ? (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Your Progress
                  </h4>
                  <div className="mt-2">
                    {typeof selectedAchievement.progress.current ===
                    "object" ? (
                      <div className="space-y-2">
                        {Object.entries(
                          selectedAchievement.progress.current
                        ).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase() +
                                  key
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()
                                    .slice(1)}
                              </span>
                              <span>
                                {value} /{" "}
                                {selectedAchievement.progress.total[key]}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${
                                    (value /
                                      selectedAchievement.progress.total[key]) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>
                            {selectedAchievement.progress.current} /{" "}
                            {selectedAchievement.progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (selectedAchievement.progress.current /
                                  selectedAchievement.progress.total) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Earned On
                  </h4>
                  <p className="mt-1 text-sm text-gray-800">
                    {selectedAchievement.dateEarned
                      ? new Date(
                          selectedAchievement.dateEarned
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date unknown"}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Reward</h4>
                <div className="mt-1 flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    {selectedAchievement.rewardCredits} credits
                  </span>
                </div>
              </div>

              {/* Share & Close buttons */}
              <div className="mt-6 flex space-x-3">
                {selectedAchievement.isEarned && (
                  <button className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share
                  </button>
                )}
                <button
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  onClick={() => setShowDetailModal(false)}
                >
                  {selectedAchievement.isEarned ? "Close" : "Keep Working"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
