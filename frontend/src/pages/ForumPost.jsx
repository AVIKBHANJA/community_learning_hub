import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const ForumPost = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const { earnCredits } = useCredits();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Mock data for frontend development
  const mockPost = {
    _id: "post1",
    title: "How to structure a React application for scalability?",
    body: "I'm working on a large-scale React application and I'm wondering what folder structure and patterns would be best for maintainability and scalability. Would love to hear your experiences with different approaches.\n\nCurrently, I'm leaning towards a feature-based structure rather than the typical components/containers split. Has anyone tried this at scale?",
    author: {
      _id: "user1",
      name: "Jane Developer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "member",
    },
    category: "web-development",
    tags: ["react", "javascript", "architecture", "best-practices"],
    viewCount: 126,
    createdAt: "2025-04-15T10:30:00Z",
    likes: ["user2", "user3", "user4", "user5"],
    isSolved: false,
  };

  const mockComments = [
    {
      _id: "comment1",
      post: "post1",
      body: "I've worked on several large React applications, and I've found that a feature-based structure works really well. Each feature folder contains all the components, hooks, utils, etc. related to that feature.\n\nThis makes it much easier to understand the codebase, especially for new developers, since everything related to a specific feature is in one place. It also makes it easier to delete features if they're no longer needed.",
      author: {
        _id: "user2",
        name: "Alex Engineer",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "expert",
      },
      likes: ["user1", "user3", "user5"],
      createdAt: "2025-04-15T11:15:00Z",
      replies: [
        {
          _id: "reply1",
          post: "post1",
          parentComment: "comment1",
          body: "I completely agree. I've also found that this approach makes it easier to implement lazy loading for different features, which helps with initial load time.",
          author: {
            _id: "user3",
            name: "Sam Coder",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg",
            role: "member",
          },
          likes: ["user2"],
          createdAt: "2025-04-15T13:45:00Z",
        },
        {
          _id: "reply2",
          post: "post1",
          parentComment: "comment1",
          body: "Can you share an example of how you typically structure a feature folder?",
          author: {
            _id: "user1",
            name: "Jane Developer",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            role: "member",
          },
          likes: [],
          createdAt: "2025-04-15T14:20:00Z",
        },
      ],
      isAcceptedAnswer: false,
    },
    {
      _id: "comment2",
      post: "post1",
      body: "Another approach worth considering is the Atomic Design methodology. It breaks UI components down into atoms, molecules, organisms, templates, and pages.\n\nI've found it really useful for maintaining consistency across large applications, especially when paired with a good design system.",
      author: {
        _id: "user4",
        name: "Taylor UI",
        avatar: "https://randomuser.me/api/portraits/men/35.jpg",
        role: "member",
      },
      likes: ["user1", "user5"],
      createdAt: "2025-04-15T12:30:00Z",
      replies: [],
      isAcceptedAnswer: false,
    },
    {
      _id: "comment3",
      post: "post1",
      body: "Here's what has worked well for us at scale:\n\n```\nsrc/\n  features/\n    auth/\n      components/\n      hooks/\n      utils/\n      types.ts\n      index.ts\n    dashboard/\n      components/\n      hooks/\n      utils/\n      types.ts\n      index.ts\n  shared/\n    components/\n    hooks/\n    utils/\n    types.ts\n  app.tsx\n  main.tsx\n```\n\nEach feature is self-contained, and the shared folder contains reusable components and utilities. We also use barrel files (index.ts) to control what gets exported from each feature.\n\nThis has been very maintainable for us as the app has grown to over 100k lines of code.",
      author: {
        _id: "user5",
        name: "Robin Architect",
        avatar: "https://randomuser.me/api/portraits/women/75.jpg",
        role: "expert",
      },
      likes: ["user1", "user2", "user3", "user4"],
      createdAt: "2025-04-15T15:45:00Z",
      replies: [],
      isAcceptedAnswer: false,
    },
  ];

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPost(mockPost);
        setComments(mockComments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setIsLoading(false);
        setErrorMessage("Failed to load the post. Please try again later.");
      }
    };

    fetchPostData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to post a comment.");
      return;
    }

    if (!commentText.trim()) {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    try {
      console.log("Submitting comment:", commentText);

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new comment
      const newComment = {
        _id: `comment${Date.now()}`,
        post: id,
        body: commentText,
        author: {
          _id: currentUser?._id || "currentUser",
          name: currentUser?.name || "Current User",
          avatar:
            currentUser?.avatar ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
          role: currentUser?.role || "member",
        },
        likes: [],
        createdAt: new Date().toISOString(),
        replies: [],
        isAcceptedAnswer: false,
      };

      // Add to comments state
      setComments([...comments, newComment]);

      // Clear input
      setCommentText("");

      // Show success message
      setSuccessMessage("Your comment has been posted successfully!");
      setErrorMessage("");

      // Award credits (in a real app)
      earnCredits(2, "Posted a comment in the forum");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to post your comment. Please try again.");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to post a reply.");
      return;
    }

    if (!replyText.trim()) {
      setErrorMessage("Reply cannot be empty.");
      return;
    }

    try {
      console.log("Submitting reply to:", replyingTo);
      console.log("Reply text:", replyText);

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new reply
      const newReply = {
        _id: `reply${Date.now()}`,
        post: id,
        parentComment: replyingTo,
        body: replyText,
        author: {
          _id: currentUser?._id || "currentUser",
          name: currentUser?.name || "Current User",
          avatar:
            currentUser?.avatar ||
            "https://randomuser.me/api/portraits/lego/1.jpg",
          role: currentUser?.role || "member",
        },
        likes: [],
        createdAt: new Date().toISOString(),
      };

      // Add reply to the appropriate comment
      const updatedComments = comments.map((comment) => {
        if (comment._id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      });

      setComments(updatedComments);

      // Clear input and replying state
      setReplyText("");
      setReplyingTo(null);

      // Show success message
      setSuccessMessage("Your reply has been posted successfully!");
      setErrorMessage("");

      // Award credits (in a real app)
      earnCredits(1, "Posted a reply in the forum");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting reply:", error);
      setErrorMessage("Failed to post your reply. Please try again.");
    }
  };

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to like a post.");
      return;
    }

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const currentUserId = currentUser?._id || "currentUser";

      // Toggle like
      if (post.likes.includes(currentUserId)) {
        // Unlike
        setPost({
          ...post,
          likes: post.likes.filter((id) => id !== currentUserId),
        });
      } else {
        // Like
        setPost({
          ...post,
          likes: [...post.likes, currentUserId],
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setErrorMessage("Failed to like the post. Please try again.");
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to like a comment.");
      return;
    }

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const currentUserId = currentUser?._id || "currentUser";

      // Update the comment or reply
      const updatedComments = comments.map((comment) => {
        // If this is the comment to update
        if (comment._id === commentId) {
          if (comment.likes.includes(currentUserId)) {
            // Unlike
            return {
              ...comment,
              likes: comment.likes.filter((id) => id !== currentUserId),
            };
          } else {
            // Like
            return {
              ...comment,
              likes: [...comment.likes, currentUserId],
            };
          }
        }

        // Check if the like is for a reply
        if (comment.replies && comment.replies.length > 0) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply._id === commentId) {
              if (reply.likes.includes(currentUserId)) {
                // Unlike
                return {
                  ...reply,
                  likes: reply.likes.filter((id) => id !== currentUserId),
                };
              } else {
                // Like
                return {
                  ...reply,
                  likes: [...reply.likes, currentUserId],
                };
              }
            }
            return reply;
          });

          return {
            ...comment,
            replies: updatedReplies,
          };
        }

        return comment;
      });

      setComments(updatedComments);
    } catch (error) {
      console.error("Error liking comment:", error);
      setErrorMessage("Failed to like the comment. Please try again.");
    }
  };

  const handleAcceptAnswer = async (commentId) => {
    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to accept an answer.");
      return;
    }

    // In a real app, check if the current user is the post author
    if (currentUser?._id !== post.author._id && currentUser?.role !== "admin") {
      setErrorMessage("Only the post author can accept an answer.");
      return;
    }

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update post
      setPost({
        ...post,
        isSolved: true,
      });

      // Update the comment
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            isAcceptedAnswer: true,
          };
        } else {
          // Ensure only one answer is accepted
          return {
            ...comment,
            isAcceptedAnswer: false,
          };
        }
      });

      setComments(updatedComments);

      // Show success message
      setSuccessMessage("Answer has been accepted successfully!");
      setErrorMessage("");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error accepting answer:", error);
      setErrorMessage("Failed to accept the answer. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-128px)]">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-700">Post Not Found</h2>
          <p className="mt-2 text-gray-500">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/forum"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-128px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/forum"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Forum
          </Link>
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Post */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-900">
                      {post.author.name}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.createdAt)}</span>
                    {post.author.role === "expert" && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Expert
                        </span>
                      </>
                    )}
                    {post.author.role === "admin" && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {post.isSolved && (
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Solved
                </div>
              )}
            </div>

            {/* Post Body */}
            <div className="prose max-w-none mb-6">
              {post.body.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Post Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={handleLikePost}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    post.likes.includes(currentUser?._id || "currentUser")
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill={
                      post.likes.includes(currentUser?._id || "currentUser")
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  {post.likes.length}
                </button>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.viewCount} views
                </div>
              </div>

              <div className="text-gray-500 text-sm">
                <span className="mr-2">Category:</span>
                <span className="font-medium">
                  {post.category
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h3>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment._id}
                id={`comment-${comment._id}`}
                className={`bg-white rounded-lg shadow-sm border ${
                  comment.isAcceptedAnswer
                    ? "border-green-500"
                    : "border-gray-200"
                }`}
              >
                {/* Comment Header */}
                <div
                  className={`p-4 flex items-start justify-between border-b ${
                    comment.isAcceptedAnswer
                      ? "bg-green-50 border-green-200"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">
                          {comment.author.name}
                        </h4>
                        {comment.author.role === "expert" && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Expert
                          </span>
                        )}
                        {comment.author.role === "admin" && (
                          <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>

                  {comment.isAcceptedAnswer && (
                    <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        Accepted Answer
                      </span>
                    </div>
                  )}
                </div>

                {/* Comment Body */}
                <div className="p-4">
                  <div className="prose max-w-none mb-4">
                    {comment.body.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          comment.likes.includes(
                            currentUser?._id || "currentUser"
                          )
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill={
                            comment.likes.includes(
                              currentUser?._id || "currentUser"
                            )
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        {comment.likes.length}
                      </button>

                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="text-sm text-gray-700 hover:text-blue-600"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Accept Answer Button - only shown to post author and if not already accepted */}
                    {isAuthenticated &&
                      (currentUser?._id === post.author._id ||
                        currentUser?.role === "admin") &&
                      !post.isSolved &&
                      !comment.isAcceptedAnswer && (
                        <button
                          onClick={() => handleAcceptAnswer(comment._id)}
                          className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                        >
                          Accept as Answer
                        </button>
                      )}
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Replying to {comment.author.name}
                    </h5>
                    <form onSubmit={handleReplySubmit}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        required
                      ></textarea>
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          Post Reply
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="border-t border-gray-100">
                    <div className="p-4 bg-gray-50">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "Reply" : "Replies"}
                      </h5>

                      <div className="space-y-4">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="bg-white p-3 rounded-md border border-gray-200"
                          >
                            <div className="flex items-start">
                              <img
                                src={reply.author.avatar}
                                alt={reply.author.name}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h6 className="text-sm font-medium text-gray-900">
                                    {reply.author.name}
                                  </h6>
                                  {reply.author.role === "expert" && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                      Expert
                                    </span>
                                  )}
                                  {reply.author.role === "admin" && (
                                    <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                  {formatDate(reply.createdAt)}
                                </p>
                                <div className="text-sm text-gray-700 mb-2">
                                  {reply.body}
                                </div>

                                <button
                                  onClick={() => handleLikeComment(reply._id)}
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                    reply.likes.includes(
                                      currentUser?._id || "currentUser"
                                    )
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill={
                                      reply.likes.includes(
                                        currentUser?._id || "currentUser"
                                      )
                                        ? "currentColor"
                                        : "none"
                                    }
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                    />
                                  </svg>
                                  {reply.likes.length}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Leave a Comment
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or answer the question..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-600 mb-3">
                  You must be logged in to post a comment.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
