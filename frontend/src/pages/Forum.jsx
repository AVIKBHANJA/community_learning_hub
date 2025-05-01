import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const Forum = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { earnCredits } = useCredits();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    sortBy: "latest",
    search: "",
  });
  const [formError, setFormError] = useState("");
  const [newPostModal, setNewPostModal] = useState(false);
  const [newPostForm, setNewPostForm] = useState({
    title: "",
    body: "",
    category: "",
    tags: [],
  });

  // Mock data for forum posts
  const mockPosts = [
    {
      _id: "post1",
      title: "Best way to structure React components?",
      content:
        "I'm working on a large-scale React application and wondering what's the best approach to structure components. Should I use functional components with hooks exclusively? How do you organize your folders?",
      category: "react",
      tags: ["react", "components", "architecture"],
      author: {
        _id: "user1",
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      createdAt: "2025-04-22T15:30:00Z",
      upvotes: 24,
      downvotes: 2,
      commentCount: 8,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      _id: "post2",
      title: "Learning path recommendation for backend development",
      content:
        "I've been focusing on frontend development for the past year and now want to expand my skills to backend. Any recommendations on what technologies to learn first? Node.js, Python/Django, or something else?",
      category: "backend",
      tags: ["backend", "node.js", "python", "career"],
      author: {
        _id: "user2",
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      createdAt: "2025-04-23T09:15:00Z",
      upvotes: 18,
      downvotes: 1,
      commentCount: 12,
      isUpvoted: true,
      isDownvoted: false,
    },
    {
      _id: "post3",
      title: "State management in 2025: Redux vs Context API vs Zustand",
      content:
        "With so many state management options available now, I'm confused about what to use for my new project. What are the pros and cons of each approach? Is Redux still relevant?",
      category: "react",
      tags: ["react", "redux", "state-management", "context-api"],
      author: {
        _id: "user3",
        name: "Alex Rivera",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      createdAt: "2025-04-24T11:45:00Z",
      upvotes: 32,
      downvotes: 3,
      commentCount: 15,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      _id: "post4",
      title: "How to implement authentication in a MERN stack application?",
      content:
        "I'm building a MERN stack application and need to implement user authentication. Should I use JWT, sessions, or OAuth? Are there any good libraries or tutorials you would recommend?",
      category: "security",
      tags: ["authentication", "mern", "jwt", "security"],
      author: {
        _id: "user4",
        name: "David Kim",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      createdAt: "2025-04-25T14:20:00Z",
      upvotes: 15,
      downvotes: 0,
      commentCount: 7,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      _id: "post5",
      title: "Transitioning from junior to mid-level developer",
      content:
        "I've been working as a junior developer for almost 2 years now, and I feel ready to move up. What skills should I focus on to make this transition? Any advice from those who have done it?",
      category: "career",
      tags: ["career", "professional-development", "skills"],
      author: {
        _id: "user5",
        name: "Emma Wilson",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      },
      createdAt: "2025-04-26T08:10:00Z",
      upvotes: 29,
      downvotes: 1,
      commentCount: 18,
      isUpvoted: false,
      isDownvoted: false,
    },
    {
      _id: "post6",
      title: "Optimizing React performance: Tips and tricks",
      content:
        "I've noticed my React app is getting slower as it grows. What are some effective ways to improve performance? I've heard about memo, useMemo, and useCallback, but I'm not sure when to use them.",
      category: "react",
      tags: ["react", "performance", "optimization"],
      author: {
        _id: "user6",
        name: "Chris Taylor",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      createdAt: "2025-04-26T16:45:00Z",
      upvotes: 21,
      downvotes: 2,
      commentCount: 9,
      isUpvoted: false,
      isDownvoted: false,
    },
  ];

  // Mock data for categories
  const mockCategories = [
    {
      _id: "cat1",
      name: "react",
      displayName: "React",
      description: "Discussions about React.js and its ecosystem",
      icon: "📚",
      postCount: 108,
    },
    {
      _id: "cat2",
      name: "backend",
      displayName: "Backend Development",
      description: "Server-side technologies and APIs",
      icon: "🖥️",
      postCount: 87,
    },
    {
      _id: "cat3",
      name: "career",
      displayName: "Career & Professional Development",
      description: "Career advice, interviews, and professional growth",
      icon: "📈",
      postCount: 62,
    },
    {
      _id: "cat4",
      name: "security",
      displayName: "Security",
      description: "Web security, authentication, and best practices",
      icon: "🔒",
      postCount: 45,
    },
    {
      _id: "cat5",
      name: "css",
      displayName: "CSS & Design",
      description: "CSS, UI/UX design, and styling techniques",
      icon: "🎨",
      postCount: 76,
    },
    {
      _id: "cat6",
      name: "devops",
      displayName: "DevOps & Deployment",
      description: "CI/CD, Docker, Kubernetes, and cloud services",
      icon: "🚀",
      postCount: 39,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be API calls
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setPosts(mockPosts);
        setCategories(mockCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching forum data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to create a post");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // In a real app, this would be an API call
      console.log("Creating new post:", newPost);

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new post object
      const createdPost = {
        _id: `post${Date.now()}`,
        ...newPost,
        author: {
          _id: currentUser?.id || "user-temp",
          name: currentUser?.name || "Current User",
          avatar:
            currentUser?.avatar ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        isUpvoted: false,
        isDownvoted: false,
      };

      // Update posts state
      setPosts([createdPost, ...posts]);

      // Reset form
      setNewPost({
        title: "",
        content: "",
        category: "",
        tags: [],
      });

      // Close modal
      setIsCreateModalOpen(false);

      // Award credits for creating a post
      earnCredits(5, "Created a forum post");

      // Show success message
      alert("Post created successfully! You earned 5 credits.");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleVote = async (postId, voteType) => {
    if (!isAuthenticated) {
      alert("Please log in to vote");
      return;
    }

    try {
      // In a real app, this would be an API call
      console.log(`Voting ${voteType} for post ${postId}`);

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update post votes in state
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            if (voteType === "upvote") {
              // If already upvoted, remove upvote
              if (post.isUpvoted) {
                return {
                  ...post,
                  upvotes: post.upvotes - 1,
                  isUpvoted: false,
                };
              }
              // If downvoted, remove downvote and add upvote
              else if (post.isDownvoted) {
                return {
                  ...post,
                  upvotes: post.upvotes + 1,
                  downvotes: post.downvotes - 1,
                  isUpvoted: true,
                  isDownvoted: false,
                };
              }
              // Otherwise, add upvote
              else {
                return {
                  ...post,
                  upvotes: post.upvotes + 1,
                  isUpvoted: true,
                };
              }
            } else if (voteType === "downvote") {
              // If already downvoted, remove downvote
              if (post.isDownvoted) {
                return {
                  ...post,
                  downvotes: post.downvotes - 1,
                  isDownvoted: false,
                };
              }
              // If upvoted, remove upvote and add downvote
              else if (post.isUpvoted) {
                return {
                  ...post,
                  upvotes: post.upvotes - 1,
                  downvotes: post.downvotes + 1,
                  isUpvoted: false,
                  isDownvoted: true,
                };
              }
              // Otherwise, add downvote
              else {
                return {
                  ...post,
                  downvotes: post.downvotes + 1,
                  isDownvoted: true,
                };
              }
            }
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error voting on post:", error);
      alert("Failed to register vote. Please try again.");
    }
  };

  const handleAddTag = () => {
    if (
      currentTag.trim() &&
      !newPost.tags.includes(currentTag.trim().toLowerCase())
    ) {
      setNewPost({
        ...newPost,
        tags: [...newPost.tags, currentTag.trim().toLowerCase()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setFormError("Please log in to create a post");
      return;
    }

    if (
      !newPostForm.title.trim() ||
      !newPostForm.body.trim() ||
      !newPostForm.category
    ) {
      setFormError("Please fill in all required fields");
      return;
    }

    try {
      // In a real app, this would be an API call
      console.log("Creating new post:", newPostForm);

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new post object
      const createdPost = {
        _id: `post${Date.now()}`,
        title: newPostForm.title,
        content: newPostForm.body,
        category: newPostForm.category,
        tags: newPostForm.tags,
        author: {
          _id: currentUser?.id || "user-temp",
          name: currentUser?.name || "Current User",
          avatar:
            currentUser?.avatar ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        isUpvoted: false,
        isDownvoted: false,
      };

      // Update posts state
      setPosts([createdPost, ...posts]);

      // Reset form
      setNewPostForm({
        title: "",
        body: "",
        category: "",
        tags: [],
      });

      // Close modal
      setNewPostModal(false);
      setFormError("");

      // Award credits for creating a post
      earnCredits(5, "Created a forum post");

      // Show success message
      alert("Post created successfully! You earned 5 credits.");
    } catch (error) {
      console.error("Error creating post:", error);
      setFormError("Failed to create post. Please try again.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    // Filter by category
    if (filter.category && post.category !== filter.category) {
      return false;
    }

    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const contentMatch = post.content.toLowerCase().includes(searchTerm);
      const tagMatch = post.tags.some((tag) => tag.includes(searchTerm));

      if (!titleMatch && !contentMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filter.sortBy === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filter.sortBy === "popular") {
      const aScore = a.upvotes - a.downvotes;
      const bScore = b.upvotes - b.downvotes;
      return bScore - aScore;
    } else if (filter.sortBy === "commented") {
      return b.commentCount - a.commentCount;
    }
    return 0;
  });

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
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Community Forum
            </h1>
            <p className="mt-2 text-gray-600">
              Join the conversation, ask questions, and share your knowledge
              with the community.
            </p>
          </div>
          <button
            onClick={() => setNewPostModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={filter.search}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter & Sort */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="sort-latest"
                    name="sort"
                    type="radio"
                    checked={filter.sortBy === "latest"}
                    onChange={() => setFilter({ ...filter, sortBy: "latest" })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sort-latest"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Latest
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sort-popular"
                    name="sort"
                    type="radio"
                    checked={filter.sortBy === "popular"}
                    onChange={() => setFilter({ ...filter, sortBy: "popular" })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sort-popular"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Most Popular
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sort-commented"
                    name="sort"
                    type="radio"
                    checked={filter.sortBy === "commented"}
                    onChange={() =>
                      setFilter({ ...filter, sortBy: "commented" })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="sort-commented"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Most Commented
                  </label>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Categories</h3>
                {filter.category && (
                  <button
                    onClick={() => setFilter({ ...filter, category: "" })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() =>
                      setFilter({ ...filter, category: category.name })
                    }
                    className={`w-full flex items-center justify-between p-2 rounded-md ${
                      filter.category === category.name
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.displayName}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                      {category.postCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:w-3/4">
            {sortedPosts.length > 0 ? (
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        {/* Voting */}
                        <div className="flex flex-col items-center mr-4">
                          <button
                            onClick={() => handleVote(post._id, "upvote")}
                            className={`p-1 rounded-full ${
                              post.isUpvoted
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-400 hover:text-blue-600"
                            }`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 17a1 1 0 01-.707-.293l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 111.414 1.414l-7 7A1 1 0 0110 17z"
                                clipRule="evenodd"
                                transform="rotate(180, 10, 10)"
                              />
                            </svg>
                          </button>
                          <span className="text-sm font-medium my-1">
                            {post.upvotes - post.downvotes}
                          </span>
                          <button
                            onClick={() => handleVote(post._id, "downvote")}
                            className={`p-1 rounded-full ${
                              post.isDownvoted
                                ? "text-red-600 bg-red-50"
                                : "text-gray-400 hover:text-red-600"
                            }`}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 17a1 1 0 01-.707-.293l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 111.414 1.414l-7 7A1 1 0 0110 17z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mr-2">
                              {categories.find((c) => c.name === post.category)
                                ?.displayName || post.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              Posted{" "}
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link to={`/forum/${post._id}`}>
                            <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                              {post.title}
                            </h2>
                          </Link>
                          <p className="text-gray-600 mb-3 line-clamp-3">
                            {post.content}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {post.author.name}
                              </span>
                            </div>
                            <Link
                              to={`/forum/${post._id}`}
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <svg
                                className="w-5 h-5 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {post.commentCount}{" "}
                              {post.commentCount === 1 ? "Comment" : "Comments"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No discussions found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters or start a new discussion.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() =>
                      isAuthenticated
                        ? setNewPostModal(true)
                        : (window.location.href = "/login")
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start a Discussion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Post Modal */}
        {newPostModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Start a New Discussion
                </h3>
                <button
                  onClick={() => {
                    setNewPostModal(false);
                    setFormError("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {formError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleNewPostSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPostForm.title}
                    onChange={(e) =>
                      setNewPostForm({ ...newPostForm, title: e.target.value })
                    }
                    placeholder="What's your question or discussion topic?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPostForm.body}
                    onChange={(e) =>
                      setNewPostForm({ ...newPostForm, body: e.target.value })
                    }
                    placeholder="Describe your question or start a discussion..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPostForm.category}
                    onChange={(e) =>
                      setNewPostForm({
                        ...newPostForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPostForm.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setNewPostForm({
                              ...newPostForm,
                              tags: newPostForm.tags.filter((t) => t !== tag),
                            })
                          }
                          className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add a tag (e.g. react, javascript)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const tag = e.target.value
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          if (tag && !newPostForm.tags.includes(tag)) {
                            setNewPostForm({
                              ...newPostForm,
                              tags: [...newPostForm.tags, tag],
                            });
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        const tag = input.value
                          .trim()
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        if (tag && !newPostForm.tags.includes(tag)) {
                          setNewPostForm({
                            ...newPostForm,
                            tags: [...newPostForm.tags, tag],
                          });
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Press Enter or click Add to add a tag. Tags make your post
                    more discoverable.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPostModal(false);
                      setFormError("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
