import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";
import { Link } from "react-router-dom";

const LearningPaths = () => {
  const { isAuthenticated } = useAuth();
  const { earnCredits } = useCredits();
  const [learningPaths, setLearningPaths] = useState([]);
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
  });
  const [categories] = useState([
    "web development",
    "data science",
    "machine learning",
    "mobile development",
    "cloud computing",
    "devops",
    "cybersecurity",
  ]);

  // Mock data for frontend development
  const mockLearningPaths = [
    {
      _id: "1",
      title: "Web Development Fundamentals",
      description:
        "Learn the core technologies that power the modern web: HTML, CSS, and JavaScript.",
      difficulty: "beginner",
      category: "web development",
      estimatedHours: 15,
      tags: ["html", "css", "javascript", "frontend"],
      image: "https://picsum.photos/seed/webdev/400/250",
      averageRating: 4.7,
      enrolledUsers: [{ user: "user1" }, { user: "user2" }, { user: "user3" }],
    },
    {
      _id: "2",
      title: "Advanced React Patterns",
      description:
        "Master advanced patterns and techniques used in professional React applications.",
      difficulty: "advanced",
      category: "web development",
      estimatedHours: 12,
      tags: ["react", "javascript", "frontend", "hooks"],
      image: "https://picsum.photos/seed/reactadv/400/250",
      averageRating: 4.9,
      enrolledUsers: [
        { user: "user1" },
        { user: "user4" },
        { user: "user5" },
        { user: "user6" },
      ],
    },
    {
      _id: "3",
      title: "Introduction to Data Science with Python",
      description:
        "Learn fundamental data science concepts and tools using Python.",
      difficulty: "intermediate",
      category: "data science",
      estimatedHours: 20,
      tags: ["python", "data science", "pandas", "numpy"],
      image: "https://picsum.photos/seed/datascience/400/250",
      averageRating: 4.5,
      enrolledUsers: [{ user: "user2" }, { user: "user7" }, { user: "user8" }],
    },
    {
      _id: "4",
      title: "DevOps Essentials: CI/CD Pipelines",
      description:
        "Master continuous integration and continuous deployment practices for modern software delivery.",
      difficulty: "intermediate",
      category: "devops",
      estimatedHours: 18,
      tags: ["devops", "ci/cd", "jenkins", "github actions"],
      image: "https://picsum.photos/seed/devops/400/250",
      averageRating: 4.6,
      enrolledUsers: [{ user: "user3" }, { user: "user9" }],
    },
    {
      _id: "5",
      title: "Cloud Architecture with AWS",
      description:
        "Design and implement scalable, reliable, and secure applications on AWS.",
      difficulty: "advanced",
      category: "cloud computing",
      estimatedHours: 25,
      tags: ["aws", "cloud", "serverless", "s3", "ec2", "lambda"],
      image: "https://picsum.photos/seed/aws/400/250",
      averageRating: 4.8,
      enrolledUsers: [
        { user: "user1" },
        { user: "user5" },
        { user: "user10" },
        { user: "user11" },
        { user: "user12" },
      ],
    },
    {
      _id: "6",
      title: "Mobile App Development with React Native",
      description:
        "Build cross-platform mobile applications using React Native and JavaScript.",
      difficulty: "intermediate",
      category: "mobile development",
      estimatedHours: 22,
      tags: ["react native", "javascript", "mobile", "ios", "android"],
      image: "https://picsum.photos/seed/reactnative/400/250",
      averageRating: 4.4,
      enrolledUsers: [{ user: "user2" }, { user: "user6" }, { user: "user13" }],
    },
  ];

  // Mock enrolled paths for frontend development
  const mockEnrolledPaths = [
    {
      _id: "2",
      title: "Advanced React Patterns",
      description:
        "Master advanced patterns and techniques used in professional React applications.",
      difficulty: "advanced",
      category: "web development",
      estimatedHours: 12,
      tags: ["react", "javascript", "frontend", "hooks"],
      image: "https://picsum.photos/seed/reactadv/400/250",
      averageRating: 4.9,
      userProgress: 75,
      enrolledAt: "2025-04-20T10:15:00Z",
    },
    {
      _id: "5",
      title: "Cloud Architecture with AWS",
      description:
        "Design and implement scalable, reliable, and secure applications on AWS.",
      difficulty: "advanced",
      category: "cloud computing",
      estimatedHours: 25,
      tags: ["aws", "cloud", "serverless", "s3", "ec2", "lambda"],
      image: "https://picsum.photos/seed/aws/400/250",
      averageRating: 4.8,
      userProgress: 30,
      enrolledAt: "2025-04-25T08:30:00Z",
    },
  ];

  // Mock recommended paths for frontend development
  const mockRecommendedPaths = [
    {
      _id: "1",
      title: "Web Development Fundamentals",
      description:
        "Learn the core technologies that power the modern web: HTML, CSS, and JavaScript.",
      difficulty: "beginner",
      category: "web development",
      estimatedHours: 15,
      tags: ["html", "css", "javascript", "frontend"],
      image: "https://picsum.photos/seed/webdev/400/250",
      averageRating: 4.7,
    },
    {
      _id: "3",
      title: "Introduction to Data Science with Python",
      description:
        "Learn fundamental data science concepts and tools using Python.",
      difficulty: "intermediate",
      category: "data science",
      estimatedHours: 20,
      tags: ["python", "data science", "pandas", "numpy"],
      image: "https://picsum.photos/seed/datascience/400/250",
      averageRating: 4.5,
    },
    {
      _id: "4",
      title: "DevOps Essentials: CI/CD Pipelines",
      description:
        "Master continuous integration and continuous deployment practices for modern software delivery.",
      difficulty: "intermediate",
      category: "devops",
      estimatedHours: 18,
      tags: ["devops", "ci/cd", "jenkins", "github actions"],
      image: "https://picsum.photos/seed/devops/400/250",
      averageRating: 4.6,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real application, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API latency

        setLearningPaths(mockLearningPaths);

        if (isAuthenticated) {
          setEnrolledPaths(mockEnrolledPaths);
          setRecommendedPaths(mockRecommendedPaths);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching learning paths:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Apply filters to learning paths
  const filteredPaths = learningPaths.filter((path) => {
    const categoryMatch = filters.category
      ? path.category === filters.category
      : true;
    const difficultyMatch = filters.difficulty
      ? path.difficulty === filters.difficulty
      : true;
    return categoryMatch && difficultyMatch;
  });

  // Get paths based on active tab
  const displayedPaths =
    activeTab === "all"
      ? filteredPaths
      : activeTab === "enrolled"
      ? enrolledPaths
      : recommendedPaths;

  const handleEnroll = async (pathId) => {
    try {
      // In a real app, this would be an API call
      console.log(`Enrolling in path: ${pathId}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For mock purposes, move the path from regular to enrolled
      const path = learningPaths.find((p) => p._id === pathId);
      if (path) {
        const newEnrolledPath = {
          ...path,
          userProgress: 0,
          enrolledAt: new Date().toISOString(),
        };

        setEnrolledPaths([...enrolledPaths, newEnrolledPath]);

        // Remove from recommended if it's there
        if (recommendedPaths.some((p) => p._id === pathId)) {
          setRecommendedPaths(recommendedPaths.filter((p) => p._id !== pathId));
        }

        // Award credits
        if (isAuthenticated) {
          earnCredits(5, `Enrolled in learning path: ${path.title}`);
        }

        // Show success message (in a real app, this would be a toast notification)
        alert(
          `Successfully enrolled in "${path.title}". You earned 5 credits!`
        );
      }
    } catch (error) {
      console.error("Error enrolling in learning path:", error);
      alert("Failed to enroll in learning path. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
          <div className="mt-4 text-primary-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-128px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="inline-block bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Learning Paths
            </span>
          </h1>
          <p className="mt-2 text-xl text-gray-600 max-w-3xl mx-auto">
            Structured learning journeys to guide your education.
            {isAuthenticated &&
              " Enroll in a path and earn credits as you progress!"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <nav className="flex space-x-8 p-1 bg-white rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              All Paths
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveTab("enrolled")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === "enrolled"
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  My Paths{" "}
                  <span className="ml-1 text-xs">({enrolledPaths.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("recommended")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === "recommended"
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Recommended{" "}
                  <span className="ml-1 text-xs">
                    ({recommendedPaths.length})
                  </span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Filters (shown only on all paths tab) */}
        {activeTab === "all" && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-card border border-gray-100 backdrop-blur-sm max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({ ...filters, difficulty: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {filteredPaths.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                Showing {filteredPaths.length} learning path
                {filteredPaths.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        {/* Learning Paths Grid */}
        {displayedPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPaths.map((path) => (
              <div
                key={path._id}
                className="group bg-white rounded-xl shadow-card overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-end">
                        <span className="text-white text-xs uppercase font-medium tracking-wider px-2 py-1 rounded-full bg-primary-600 shadow-lg shadow-primary-600/30">
                          {path.category}
                        </span>
                        <div className="flex items-center bg-black/60 rounded-full px-2 py-1 backdrop-blur-sm">
                          <svg
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-xs text-white font-medium">
                            {path.averageRating?.toFixed(1) || "New"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        path.difficulty === "beginner"
                          ? "bg-green-100 text-green-800"
                          : path.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {path.difficulty.charAt(0).toUpperCase() +
                        path.difficulty.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 font-medium flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {path.estimatedHours} hours
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                    {path.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {path.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {path.tags.length > 4 && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                        +{path.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Progress (for enrolled paths) */}
                  {activeTab === "enrolled" && "userProgress" in path && (
                    <div className="mb-5">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-primary-600 font-semibold">
                          {path.userProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                          style={{ width: `${path.userProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    {activeTab === "enrolled" ? (
                      <Link
                        to={`/learning-paths/${path._id}`}
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Continue Learning
                      </Link>
                    ) : isAuthenticated ? (
                      enrolledPaths.some((p) => p._id === path._id) ? (
                        <Link
                          to={`/learning-paths/${path._id}`}
                          className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Already Enrolled
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(path._id)}
                          className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Enroll Now
                        </button>
                      )
                    ) : (
                      <Link
                        to="/login"
                        className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Log in to Enroll
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 max-w-xl mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {activeTab === "all"
                ? "No learning paths found"
                : activeTab === "enrolled"
                ? "You haven't enrolled in any learning paths yet"
                : "No recommended learning paths found"}
            </h3>
            <p className="mt-1 text-gray-500 max-w-md mx-auto">
              {activeTab === "all"
                ? "Try adjusting your filters or check back later"
                : activeTab === "enrolled"
                ? "Explore our learning paths and enroll to track your progress"
                : "Continue interacting with content to get personalized recommendations"}
            </p>
            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Explore All Paths
              </button>
            )}
          </div>
        )}

        {/* Jump to courses section */}
        {displayedPaths.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl shadow-sm border border-primary-200 text-center">
            <h2 className="text-xl font-bold text-primary-800 mb-3">
              Looking for specific courses?
            </h2>
            <p className="text-primary-700 mb-5 max-w-3xl mx-auto">
              Our community is constantly creating and curating high-quality
              learning paths to help you advance your skills.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-5 py-2.5 bg-white text-primary-700 font-medium rounded-lg shadow-sm hover:bg-primary-50 border border-primary-300 transition-all hover:shadow"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Individual Courses
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPaths;
