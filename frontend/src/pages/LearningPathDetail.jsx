import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const LearningPathDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const { earnCredits } = useCredits();
  const [learningPath, setLearningPath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeContent, setActiveContent] = useState(null);
  const [completedContent, setCompletedContent] = useState([]);
  const [progress, setProgress] = useState(0);
  const [userEnrolled, setUserEnrolled] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");

  // Mock data for frontend development
  const mockLearningPath = {
    _id: id,
    title: "Web Development Fundamentals",
    description:
      "Learn the core technologies that power the modern web: HTML, CSS, and JavaScript.",
    difficulty: "beginner",
    category: "web development",
    estimatedHours: 15,
    tags: ["html", "css", "javascript", "frontend"],
    image: "https://picsum.photos/seed/webdev/800/400",
    averageRating: 4.7,
    createdBy: {
      _id: "creator1",
      name: "Web Dev Academy",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    modules: [
      {
        _id: "module1",
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and elements",
        content: [
          {
            _id: "content1",
            contentId: {
              _id: "content1",
              title: "HTML Document Structure",
              description:
                "Understanding the basic structure of HTML documents",
              source: "article",
              url: "https://example.com/html-structure",
              imageUrl: "https://picsum.photos/seed/html1/400/250",
              tags: ["html", "basics"],
            },
            order: 1,
          },
          {
            _id: "content2",
            contentId: {
              _id: "content2",
              title: "HTML Elements and Attributes",
              description: "Learn about HTML elements and their attributes",
              source: "video",
              url: "https://example.com/html-elements",
              imageUrl: "https://picsum.photos/seed/html2/400/250",
              tags: ["html", "elements"],
            },
            order: 2,
          },
        ],
      },
      {
        _id: "module2",
        title: "CSS Fundamentals",
        description: "Learn how to style your HTML with CSS",
        content: [
          {
            _id: "content3",
            contentId: {
              _id: "content3",
              title: "CSS Selectors",
              description: "Understanding CSS selectors and specificity",
              source: "article",
              url: "https://example.com/css-selectors",
              imageUrl: "https://picsum.photos/seed/css1/400/250",
              tags: ["css", "selectors"],
            },
            order: 1,
          },
          {
            _id: "content4",
            contentId: {
              _id: "content4",
              title: "CSS Box Model",
              description: "Learn about the CSS box model and layout",
              source: "video",
              url: "https://example.com/css-box-model",
              imageUrl: "https://picsum.photos/seed/css2/400/250",
              tags: ["css", "box model"],
            },
            order: 2,
          },
        ],
      },
      {
        _id: "module3",
        title: "JavaScript Basics",
        description: "Introduction to JavaScript programming",
        content: [
          {
            _id: "content5",
            contentId: {
              _id: "content5",
              title: "JavaScript Variables and Data Types",
              description: "Learn about variables and data types in JavaScript",
              source: "article",
              url: "https://example.com/js-variables",
              imageUrl: "https://picsum.photos/seed/js1/400/250",
              tags: ["javascript", "variables"],
            },
            order: 1,
          },
          {
            _id: "content6",
            contentId: {
              _id: "content6",
              title: "JavaScript Functions",
              description: "Understanding functions in JavaScript",
              source: "video",
              url: "https://example.com/js-functions",
              imageUrl: "https://picsum.photos/seed/js2/400/250",
              tags: ["javascript", "functions"],
            },
            order: 2,
          },
        ],
      },
    ],
    enrolledUsers: [],
    ratings: [
      {
        user: "user1",
        rating: 5,
        review: "Great course for beginners! Highly recommend.",
        createdAt: "2025-04-15T10:30:00Z",
      },
      {
        user: "user2",
        rating: 4,
        review: "Good content, could use more examples.",
        createdAt: "2025-04-10T14:45:00Z",
      },
    ],
  };

  // Mock completed content for frontend development
  const mockCompletedContent = ["content1", "content2", "content3"];

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch request to your API
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLearningPath(mockLearningPath);

        // Check if user is enrolled
        if (isAuthenticated) {
          const enrolled = mockLearningPath.enrolledUsers.some(
            (enrollment) => enrollment.user === currentUser?.id
          );
          setUserEnrolled(enrolled);

          // If enrolled, get completed content and calculate progress
          if (enrolled) {
            setCompletedContent(mockCompletedContent);

            // Calculate total content items
            let totalContentItems = 0;
            mockLearningPath.modules.forEach((module) => {
              totalContentItems += module.content.length;
            });

            // Calculate progress
            const progressPercentage = Math.round(
              (mockCompletedContent.length / totalContentItems) * 100
            );
            setProgress(progressPercentage);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching learning path:", error);
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [id, isAuthenticated, currentUser]);

  const handleEnroll = async () => {
    try {
      // In a real app, this would be a POST request to your API
      console.log(`Enrolling in learning path: ${id}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update enrollment status
      setUserEnrolled(true);

      // Award credits
      if (isAuthenticated) {
        earnCredits(5, `Enrolled in learning path: ${learningPath.title}`);
      }

      // Show success message
      alert(
        `Successfully enrolled in "${learningPath.title}". You earned 5 credits!`
      );
    } catch (error) {
      console.error("Error enrolling in learning path:", error);
      alert("Failed to enroll in learning path. Please try again.");
    }
  };

  const handleContentComplete = async (contentId) => {
    try {
      // In a real app, this would be a PUT request to your API
      console.log(`Completing content: ${contentId}`);

      // Check if already completed
      if (completedContent.includes(contentId)) {
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update completed content
      const updatedCompletedContent = [...completedContent, contentId];
      setCompletedContent(updatedCompletedContent);

      // Calculate total content items
      let totalContentItems = 0;
      learningPath.modules.forEach((module) => {
        totalContentItems += module.content.length;
      });

      // Calculate new progress
      const newProgress = Math.round(
        (updatedCompletedContent.length / totalContentItems) * 100
      );
      setProgress(newProgress);

      // Award credits
      if (isAuthenticated) {
        earnCredits(
          2,
          `Completed content in learning path: ${learningPath.title}`
        );

        // Award bonus credits if path is now 100% completed
        if (newProgress === 100) {
          earnCredits(
            20,
            `Completed entire learning path: ${learningPath.title}`
          );
          alert(
            `Congratulations! You've completed the entire learning path and earned 20 bonus credits!`
          );
        } else {
          alert(`Content marked as completed. You earned 2 credits!`);
        }
      }
    } catch (error) {
      console.error("Error completing content:", error);
      alert("Failed to mark content as completed. Please try again.");
    }
  };

  const handleRatingSubmit = async (event) => {
    event.preventDefault();

    try {
      // In a real app, this would be a POST request to your API
      console.log(
        `Rating learning path: ${id}, Rating: ${userRating}, Review: ${userReview}`
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Award credits for rating
      if (isAuthenticated) {
        earnCredits(3, `Rated learning path: ${learningPath.title}`);
      }

      // Close modal and update UI
      setIsRatingModalOpen(false);

      // In a real app, you would refetch the learning path or update the state
      alert(
        `Thanks for your feedback! You earned 3 credits for rating this learning path.`
      );
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Learning Path Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The learning path you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/learning-paths"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-128px)]">
      {/* Hero Banner */}
      <div
        className="relative bg-cover bg-center h-64 sm:h-80 md:h-96"
        style={{ backgroundImage: `url(${learningPath.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-white text-sm mb-4">
            <span className="bg-blue-600 px-2 py-1 rounded-full uppercase tracking-wide font-medium">
              {learningPath.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full uppercase tracking-wide font-medium ${
                learningPath.difficulty === "beginner"
                  ? "bg-green-600"
                  : learningPath.difficulty === "intermediate"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {learningPath.difficulty}
            </span>
            <span className="bg-gray-700 px-2 py-1 rounded-full">
              {learningPath.estimatedHours} hours
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {learningPath.title}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-3xl">
            {learningPath.description}
          </p>
          <div className="flex items-center mt-4">
            <img
              src={learningPath.createdBy.avatar}
              alt={learningPath.createdBy.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-white">
              Created by <strong>{learningPath.createdBy.name}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Sidebar - Module Navigation */}
          <div className="lg:w-1/4 mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              {/* User Progress */}
              {userEnrolled && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      Your Progress
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  {progress >= 50 && !isRatingModalOpen && (
                    <button
                      onClick={() => setIsRatingModalOpen(true)}
                      className="mt-3 w-full text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Rate this learning path
                    </button>
                  )}
                </div>
              )}

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Modules
              </h3>
              <div className="space-y-2">
                {learningPath.modules.map((module, index) => (
                  <button
                    key={module._id}
                    onClick={() => {
                      setActiveModule(index);
                      setActiveContent(null);
                    }}
                    className={`w-full text-left p-3 rounded-md text-sm font-medium ${
                      activeModule === index
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{module.title}</span>
                      {userEnrolled && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                          {
                            module.content.filter((content) =>
                              completedContent.includes(content._id)
                            ).length
                          }
                          /{module.content.length}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Enrollment Button - show only if not enrolled */}
              {!userEnrolled && (
                <div className="mt-6">
                  {isAuthenticated ? (
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                    >
                      Enroll Now (Free)
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center block"
                    >
                      Log in to Enroll
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Current Module */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {learningPath.modules[activeModule].title}
              </h2>
              <p className="text-gray-600 mb-6">
                {learningPath.modules[activeModule].description}
              </p>

              {/* Content List */}
              {activeContent === null ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Module Content
                  </h3>
                  {learningPath.modules[activeModule].content.map((content) => (
                    <div
                      key={content._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {content.contentId.source === "video" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            )}
                          </svg>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-base font-medium text-gray-900">
                              {content.contentId.title}
                            </h4>
                            {userEnrolled && (
                              <span>
                                {completedContent.includes(content._id) ? (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Completed
                                  </span>
                                ) : (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {content.contentId.description}
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => setActiveContent(content)}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded text-blue-600 bg-white hover:bg-blue-50"
                            >
                              View Content
                            </button>
                            {userEnrolled &&
                              !completedContent.includes(content._id) && (
                                <button
                                  onClick={() =>
                                    handleContentComplete(content._id)
                                  }
                                  className="inline-flex items-center px-3 py-1.5 border border-green-600 text-sm font-medium rounded text-green-600 bg-white hover:bg-green-50"
                                >
                                  Mark as Completed
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setActiveContent(null)}
                    className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to module
                  </button>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {activeContent.contentId.title}
                    </h3>
                    <div className="aspect-w-16 aspect-h-9 mb-6">
                      <img
                        src={activeContent.contentId.imageUrl}
                        alt={activeContent.contentId.title}
                        className="rounded-lg object-cover w-full h-64"
                      />
                    </div>
                    <p className="text-gray-700 mb-6">
                      {activeContent.contentId.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeContent.contentId.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={activeContent.contentId.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        {activeContent.contentId.source === "video"
                          ? "Watch Video"
                          : "Read Article"}
                      </a>

                      {userEnrolled &&
                        !completedContent.includes(activeContent._id) && (
                          <button
                            onClick={() =>
                              handleContentComplete(activeContent._id)
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            Mark as Completed
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ratings and Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ratings & Reviews
              </h3>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(learningPath.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-lg font-medium text-gray-900">
                  {learningPath.averageRating.toFixed(1)}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  ({learningPath.ratings.length} reviews)
                </span>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {learningPath.ratings.length > 0 ? (
                  learningPath.ratings.map((rating, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= rating.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{rating.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No reviews yet for this learning path.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Rate this Learning Path
            </h3>
            <form onSubmit={handleRatingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating:
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Review (Optional):
                </label>
                <textarea
                  id="review"
                  rows={4}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience with this learning path..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userRating === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    userRating > 0
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathDetail;
