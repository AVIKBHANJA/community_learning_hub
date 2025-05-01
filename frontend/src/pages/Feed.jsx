import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const Feed = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { earnCredits } = useCredits();
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedItems, setSavedItems] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);

  // Mock data for frontend development
  const mockFeedItems = [
    {
      id: "1",
      title: "Introduction to Machine Learning Concepts",
      description:
        "Learn the fundamentals of machine learning algorithms and how they can be applied to real-world problems.",
      source: "twitter",
      author: "TechLearning",
      imageUrl: "https://picsum.photos/seed/ml101/400/250",
      url: "https://twitter.com/techlearning/status/1234567890",
      publishedAt: "2025-04-25T15:30:00Z",
      tags: ["machine learning", "AI", "technology"],
      engagement: {
        likes: 245,
        shares: 78,
        comments: 42,
      },
    },
    {
      id: "2",
      title: "React Hooks Deep Dive Tutorial",
      description:
        "Comprehensive guide on using React hooks effectively to build cleaner, more maintainable components.",
      source: "reddit",
      author: "r/reactjs",
      imageUrl: "https://picsum.photos/seed/reacthooks/400/250",
      url: "https://reddit.com/r/reactjs/comments/hooks_tutorial",
      publishedAt: "2025-04-26T10:15:00Z",
      tags: ["react", "javascript", "webdev"],
      engagement: {
        likes: 189,
        shares: 53,
        comments: 37,
      },
    },
    {
      id: "3",
      title: "Building Scalable Microservices Architecture",
      description:
        "Best practices for designing and implementing scalable microservices that can grow with your application needs.",
      source: "linkedin",
      author: "Cloud Engineering Network",
      imageUrl: "https://picsum.photos/seed/microservices/400/250",
      url: "https://linkedin.com/pulse/microservices-architecture",
      publishedAt: "2025-04-24T08:45:00Z",
      tags: ["microservices", "architecture", "cloud"],
      engagement: {
        likes: 312,
        shares: 97,
        comments: 54,
      },
    },
    {
      id: "4",
      title: "Data Visualization Techniques for Data Scientists",
      description:
        "Explore powerful visualization techniques to better communicate insights from complex datasets.",
      source: "twitter",
      author: "DataScienceDaily",
      imageUrl: "https://picsum.photos/seed/dataviz/400/250",
      url: "https://twitter.com/datasciencedaily/status/9876543210",
      publishedAt: "2025-04-23T14:20:00Z",
      tags: ["data science", "visualization", "analytics"],
      engagement: {
        likes: 278,
        shares: 86,
        comments: 39,
      },
    },
    {
      id: "5",
      title: "Getting Started with Kubernetes for Deployment",
      description:
        "A beginner-friendly introduction to using Kubernetes for container orchestration and deployment.",
      source: "reddit",
      author: "r/devops",
      imageUrl: "https://picsum.photos/seed/kubernetes/400/250",
      url: "https://reddit.com/r/devops/comments/kubernetes_beginners",
      publishedAt: "2025-04-22T16:50:00Z",
      tags: ["kubernetes", "devops", "containers"],
      engagement: {
        likes: 203,
        shares: 62,
        comments: 48,
      },
    },
    {
      id: "6",
      title: "The Future of Web Development: What's Coming in 2026",
      description:
        "Industry experts share predictions for the biggest trends that will shape web development in the coming year.",
      source: "linkedin",
      author: "Web Platform Trends",
      imageUrl: "https://picsum.photos/seed/webfuture/400/250",
      url: "https://linkedin.com/pulse/web-development-2026",
      publishedAt: "2025-04-21T11:30:00Z",
      tags: ["web development", "trends", "future"],
      engagement: {
        likes: 356,
        shares: 124,
        comments: 67,
      },
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch feed items
    const fetchFeedItems = async () => {
      // In a real app, this would be a fetch call to your backend
      try {
        setIsLoading(true);
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFeedItems(mockFeedItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching feed items:", error);
        setIsLoading(false);
      }
    };

    // Load saved items from localStorage
    const loadSavedItems = () => {
      const saved = localStorage.getItem("savedItems");
      if (saved) {
        setSavedItems(JSON.parse(saved));
      }
    };

    // Load user interests from localStorage
    const loadUserInterests = () => {
      const interests = localStorage.getItem("userInterests");
      if (interests) {
        setUserInterests(JSON.parse(interests));
      }
    };

    fetchFeedItems();
    loadSavedItems();
    loadUserInterests();
  }, []);

  // Generate recommendations based on user interests and behavior
  useEffect(() => {
    if (feedItems.length > 0 && userInterests.length > 0) {
      // Simple algorithm: recommend items that match user interests
      const recommendations = feedItems
        .filter(
          (item) =>
            item.tags.some((tag) => userInterests.includes(tag)) &&
            !savedItems.some((saved) => saved.id === item.id)
        )
        .slice(0, 3); // Limit to 3 recommendations

      setRecommendedItems(recommendations);
    }
  }, [feedItems, userInterests, savedItems]);

  const handleSaveItem = (item) => {
    const isAlreadySaved = savedItems.some(
      (savedItem) => savedItem.id === item.id
    );

    if (isAlreadySaved) {
      // Remove from saved items
      const updatedSavedItems = savedItems.filter(
        (savedItem) => savedItem.id !== item.id
      );
      setSavedItems(updatedSavedItems);
      localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
    } else {
      // Add to saved items
      const updatedSavedItems = [...savedItems, item];
      setSavedItems(updatedSavedItems);
      localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));

      // Award credits for saving content if user is authenticated
      if (isAuthenticated) {
        earnCredits(2, "Saved content item to collection");
      }
    }
  };

  const handleReportItem = (item) => {
    setSelectedItem(item);
    setIsReportModalOpen(true);
  };

  const submitReport = async () => {
    if (!reportReason || !selectedItem) return;

    try {
      // In a real app, this would be a POST request to your backend
      console.log("Reporting item:", selectedItem.id, "Reason:", reportReason);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Award credits for reporting inappropriate content
      if (isAuthenticated) {
        earnCredits(1, "Reported content for review");
      }

      // Close modal and reset state
      setIsReportModalOpen(false);
      setSelectedItem(null);
      setReportReason("");

      // Show success message (in a real app, this would be a toast notification)
      alert(
        "Content reported successfully. Thank you for helping keep our community safe!"
      );
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  const handleShareItem = async (item) => {
    try {
      // In a real app, this would use the Web Share API or a custom sharing solution
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url,
        });

        // Award credits for sharing content
        if (isAuthenticated) {
          earnCredits(3, "Shared content with others");
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(item.url);
        alert("Link copied to clipboard!");

        if (isAuthenticated) {
          earnCredits(1, "Copied content link to clipboard");
        }
      }
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const toggleInterestsModal = () => {
    setIsInterestsModalOpen(!isInterestsModalOpen);
  };

  const handleInterestToggle = (interest) => {
    if (userInterests.includes(interest)) {
      setUserInterests(userInterests.filter((i) => i !== interest));
    } else {
      setUserInterests([...userInterests, interest]);
    }
  };

  const saveInterests = () => {
    localStorage.setItem("userInterests", JSON.stringify(userInterests));
    setIsInterestsModalOpen(false);

    // Award credits for updating interests if user is authenticated
    if (isAuthenticated) {
      earnCredits(2, "Updated learning interests");
    }
  };

  // All available tags for interests
  const allTags = [
    "machine learning",
    "AI",
    "technology",
    "react",
    "javascript",
    "webdev",
    "microservices",
    "architecture",
    "cloud",
    "data science",
    "visualization",
    "analytics",
    "kubernetes",
    "devops",
    "containers",
    "web development",
    "trends",
    "future",
  ];

  const filteredItems =
    activeFilter === "all"
      ? feedItems
      : activeFilter === "saved"
      ? savedItems
      : activeFilter === "recommended"
      ? recommendedItems
      : feedItems.filter((item) => item.source === activeFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-128px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feed Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Feed</h1>
          <p className="mt-2 text-gray-600">
            Discover curated content from around the web to accelerate your
            learning journey.
            {isAuthenticated && " Save and share content to earn credits!"}
          </p>

          {/* Interests button */}
          <button
            onClick={toggleInterestsModal}
            className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Customize Interests{" "}
            {userInterests.length > 0 && `(${userInterests.length})`}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveFilter("twitter")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "twitter"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Twitter
            </button>
            <button
              onClick={() => setActiveFilter("reddit")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "reddit"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reddit
            </button>
            <button
              onClick={() => setActiveFilter("linkedin")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "linkedin"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              LinkedIn
            </button>
            <button
              onClick={() => setActiveFilter("saved")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "saved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Saved ({savedItems.length})
            </button>
            <button
              onClick={() => setActiveFilter("recommended")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === "recommended"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              For You{" "}
              {recommendedItems.length > 0 && `(${recommendedItems.length})`}
            </button>
          </nav>
        </div>

        {/* Recommendations Banner - show only on "all" tab when not empty */}
        {activeFilter === "all" &&
          recommendedItems.length > 0 &&
          !showRecommendations && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4 flex items-start justify-between">
              <div>
                <h3 className="text-md font-medium text-blue-800">
                  Personalized recommendations
                </h3>
                <p className="text-sm text-blue-600">
                  We've found {recommendedItems.length} items matching your
                  interests
                </p>
              </div>
              <button
                onClick={() => setActiveFilter("recommended")}
                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Recommendations
              </button>
            </div>
          )}

        {/* Feed Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium uppercase">
                    {item.source}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{item.author}</span>
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More
                    </a>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveItem(item)}
                        className={`rounded-full p-1.5 ${
                          savedItems.some(
                            (savedItem) => savedItem.id === item.id
                          )
                            ? "text-yellow-500 hover:text-yellow-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={
                          savedItems.some(
                            (savedItem) => savedItem.id === item.id
                          )
                            ? "Unsave"
                            : "Save for later"
                        }
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShareItem(item)}
                        className="text-gray-400 hover:text-gray-600 rounded-full p-1.5"
                        title="Share"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleReportItem(item)}
                        className="text-gray-400 hover:text-gray-600 rounded-full p-1.5"
                        title="Report"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "saved"
                ? "You haven't saved any items yet."
                : "No items available for the selected filter."}
            </p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Report Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please tell us why you're reporting this content:
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content title:
              </label>
              <p className="text-sm text-gray-900">{selectedItem.title}</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="reportReason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason for report:
              </label>
              <select
                id="reportReason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a reason...</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="misinformation">Misinformation</option>
                <option value="spam">Spam or advertising</option>
                <option value="duplicate">Duplicate content</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setSelectedItem(null);
                  setReportReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                disabled={!reportReason}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  reportReason
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interests Modal */}
      {isInterestsModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Customize Your Learning Interests
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select topics you're interested in to get personalized
              recommendations:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {allTags.map((tag) => (
                <div
                  key={tag}
                  onClick={() => handleInterestToggle(tag)}
                  className={`cursor-pointer p-2 rounded ${
                    userInterests.includes(tag)
                      ? "bg-blue-100 border border-blue-500 text-blue-800"
                      : "bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-sm">{tag}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsInterestsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveInterests}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Interests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
