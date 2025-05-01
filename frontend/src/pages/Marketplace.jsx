import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const Marketplace = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { earnCredits, spendCredits } = useCredits();
  const [rewards, setRewards] = useState([]);
  const [userRedemptions, setUserRedemptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isRedemptionHistoryOpen, setIsRedemptionHistoryOpen] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  // Mock data for rewards
  const mockRewards = [
    {
      _id: "reward1",
      title: "Premium Course Access",
      description:
        "Get 30 days of premium access to any course of your choice.",
      type: "premium_content",
      imageUrl: "https://picsum.photos/seed/reward1/400/300",
      cost: 50,
      availableQuantity: -1, // unlimited
      isActive: true,
      featured: true,
      createdAt: "2025-03-15T10:00:00Z",
      redemptionInstructions:
        "You'll receive an email with a coupon code within 24 hours.",
      isAvailable: true,
      canAfford: true,
    },
    {
      _id: "reward2",
      title: "1-on-1 Mentoring Session",
      description:
        "30-minute video call with an expert in your area of interest.",
      type: "mentorship",
      imageUrl: "https://picsum.photos/seed/reward2/400/300",
      cost: 100,
      availableQuantity: 5,
      isActive: true,
      featured: true,
      createdAt: "2025-03-20T14:30:00Z",
      redemptionInstructions:
        "We'll reach out to schedule a session that works for you.",
      isAvailable: true,
      canAfford: false,
    },
    {
      _id: "reward3",
      title: "Exclusive Programming E-Book",
      description:
        "Download our specially curated e-book on advanced programming concepts.",
      type: "premium_content",
      imageUrl: "https://picsum.photos/seed/reward3/400/300",
      cost: 30,
      availableQuantity: -1, // unlimited
      isActive: true,
      featured: false,
      createdAt: "2025-04-01T09:15:00Z",
      redemptionInstructions:
        "You'll receive a download link instantly after redemption.",
      isAvailable: true,
      canAfford: true,
    },
    {
      _id: "reward4",
      title: "Community Hero Badge",
      description:
        "Display this exclusive badge on your profile to show your contributions.",
      type: "badge",
      imageUrl: "https://picsum.photos/seed/reward4/400/300",
      cost: 25,
      availableQuantity: -1, // unlimited
      isActive: true,
      featured: false,
      createdAt: "2025-04-05T16:45:00Z",
      redemptionInstructions:
        "Badge will be automatically added to your profile.",
      isAvailable: true,
      canAfford: true,
    },
    {
      _id: "reward5",
      title: "Limited Edition Dev T-Shirt",
      description:
        "High-quality cotton t-shirt with our community logo. Shipping included.",
      type: "merchandise",
      imageUrl: "https://picsum.photos/seed/reward5/400/300",
      cost: 70,
      availableQuantity: 15,
      isActive: true,
      featured: true,
      createdAt: "2025-04-10T11:30:00Z",
      redemptionInstructions:
        "Provide your shipping address and size when prompted.",
      isAvailable: true,
      canAfford: false,
    },
    {
      _id: "reward6",
      title: "Full-Stack Project Certificate",
      description:
        "Certification for completing a real-world project. Looks great on your resume!",
      type: "certificate",
      imageUrl: "https://picsum.photos/seed/reward6/400/300",
      cost: 85,
      availableQuantity: -1, // unlimited
      isActive: true,
      featured: false,
      createdAt: "2025-04-15T13:20:00Z",
      redemptionInstructions:
        "Complete the associated project to receive your certificate.",
      isAvailable: true,
      canAfford: false,
    },
    {
      _id: "reward7",
      title: "50% Off Annual Pro Subscription",
      description: "Get half off our annual Professional tier subscription.",
      type: "discount",
      imageUrl: "https://picsum.photos/seed/reward7/400/300",
      cost: 60,
      availableQuantity: 20,
      isActive: true,
      featured: false,
      createdAt: "2025-04-18T09:00:00Z",
      redemptionInstructions:
        "You'll receive a unique discount code via email.",
      isAvailable: true,
      canAfford: true,
    },
    {
      _id: "reward8",
      title: "Plant a Tree Donation",
      description:
        "We'll plant a tree on your behalf through our environmental partner.",
      type: "donation",
      imageUrl: "https://picsum.photos/seed/reward8/400/300",
      cost: 15,
      availableQuantity: -1, // unlimited
      isActive: true,
      featured: false,
      createdAt: "2025-04-22T10:45:00Z",
      redemptionInstructions:
        "Your donation will be processed immediately. Thank you!",
      isAvailable: true,
      canAfford: true,
    },
  ];

  // Mock data for user redemptions
  const mockRedemptions = [
    {
      _id: "redemption1",
      reward: {
        _id: "reward3",
        title: "Exclusive Programming E-Book",
        description:
          "Download our specially curated e-book on advanced programming concepts.",
        type: "premium_content",
        imageUrl: "https://picsum.photos/seed/reward3/400/300",
        cost: 30,
        redemptionInstructions:
          "You'll receive a download link instantly after redemption.",
      },
      creditsCost: 30,
      status: "fulfilled",
      createdAt: "2025-04-22T14:30:00Z",
      fulfilledAt: "2025-04-22T14:35:00Z",
      fulfillmentDetails:
        "Download Link: https://example.com/download/ebook-xyz",
    },
    {
      _id: "redemption2",
      reward: {
        _id: "reward4",
        title: "Community Hero Badge",
        description:
          "Display this exclusive badge on your profile to show your contributions.",
        type: "badge",
        imageUrl: "https://picsum.photos/seed/reward4/400/300",
        cost: 25,
        redemptionInstructions:
          "Badge will be automatically added to your profile.",
      },
      creditsCost: 25,
      status: "fulfilled",
      createdAt: "2025-04-15T09:20:00Z",
      fulfilledAt: "2025-04-15T09:21:00Z",
      fulfillmentDetails: "Badge has been added to your profile.",
    },
    {
      _id: "redemption3",
      reward: {
        _id: "reward2",
        title: "1-on-1 Mentoring Session",
        description:
          "30-minute video call with an expert in your area of interest.",
        type: "mentorship",
        imageUrl: "https://picsum.photos/seed/reward2/400/300",
        cost: 100,
        redemptionInstructions:
          "We'll reach out to schedule a session that works for you.",
      },
      creditsCost: 100,
      status: "pending",
      createdAt: "2025-04-25T11:15:00Z",
    },
  ];

  // Categories derived from reward types
  const mockCategories = [
    { id: "premium_content", name: "Premium Content", icon: "📚" },
    { id: "mentorship", name: "Mentorship", icon: "👨‍🏫" },
    { id: "badge", name: "Badges", icon: "🏅" },
    { id: "certificate", name: "Certificates", icon: "📜" },
    { id: "merchandise", name: "Merchandise", icon: "👕" },
    { id: "discount", name: "Discounts", icon: "💰" },
    { id: "donation", name: "Donations", icon: "🌱" },
    { id: "exclusive_event", name: "Events", icon: "🎟️" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API latency

        // Update rewards and check which ones the user can afford
        const updatedRewards = mockRewards.map((reward) => {
          if (isAuthenticated) {
            // Mock user credits - in a real app, this would come from the user profile
            const userCreditsValue = 75; // Just for demonstration
            setUserCredits(userCreditsValue);
            return {
              ...reward,
              canAfford: reward.cost <= userCreditsValue,
            };
          }
          return reward;
        });

        setRewards(updatedRewards);
        setUserRedemptions(mockRedemptions);
        setCategories(mockCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const openRewardModal = (reward) => {
    setSelectedReward(reward);
    setIsRewardModalOpen(true);
  };

  const handleRedeemReward = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (!selectedReward) return;

    try {
      // In a real app, this would be an API call
      console.log(`Redeeming reward: ${selectedReward.title}`);

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate spending credits
      spendCredits(
        selectedReward.cost,
        `Redeemed reward: ${selectedReward.title}`
      );

      // Update user credits
      setUserCredits((prev) => prev - selectedReward.cost);

      // Add to user redemptions
      const newRedemption = {
        _id: `redemption${Date.now()}`,
        reward: selectedReward,
        creditsCost: selectedReward.cost,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setUserRedemptions((prev) => [newRedemption, ...prev]);

      // Update which rewards the user can now afford
      setRewards(
        rewards.map((reward) => ({
          ...reward,
          canAfford: reward.cost <= userCredits - selectedReward.cost,
        }))
      );

      // Close modal and show confirmation
      setIsRewardModalOpen(false);
      setConfirmationMessage({
        type: "success",
        text: `Successfully redeemed "${selectedReward.title}" for ${selectedReward.cost} credits!`,
      });

      // Clear confirmation message after 5 seconds
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      setConfirmationMessage({
        type: "error",
        text: "Failed to redeem reward. Please try again.",
      });
    }
  };

  // Filter rewards based on selected category
  const filteredRewards = selectedCategory
    ? rewards.filter((reward) => reward.type === selectedCategory)
    : rewards;

  // Sort rewards based on sort option
  const sortedRewards = [...filteredRewards].sort((a, b) => {
    if (sortOption === "featured") {
      // Featured first, then by creation date
      return a.featured === b.featured
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : a.featured
        ? -1
        : 1;
    } else if (sortOption === "price-low") {
      return a.cost - b.cost;
    } else if (sortOption === "price-high") {
      return b.cost - a.cost;
    } else if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const getRewardTypeIcon = (type) => {
    const category = categories.find((cat) => cat.id === type);
    return category ? category.icon : "🎁";
  };

  const getRewardTypeLabel = (type) => {
    const category = categories.find((cat) => cat.id === type);
    return category ? category.name : type.replace("_", " ");
  };

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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="mt-2 text-gray-600">
                Redeem your hard-earned credits for exclusive rewards and
                benefits.
              </p>
            </div>
            {isAuthenticated && (
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm7 0a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1zm-7 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {userCredits} Credits Available
                  </span>
                </div>
                <button
                  onClick={() => setIsRedemptionHistoryOpen(true)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  View Redemption History
                </button>
              </div>
            )}
          </div>

          {/* Confirmation Message */}
          {confirmationMessage && (
            <div
              className={`mt-4 p-4 rounded-md ${
                confirmationMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {confirmationMessage.type === "success" ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {confirmationMessage.text}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter and Sort Options */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filter by Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="sort-option"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort by
                </label>
                <select
                  id="sort-option"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            {isAuthenticated && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="affordable-filter"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRewards(
                        rewards.map((reward) => ({
                          ...reward,
                          isAffordable: reward.cost <= userCredits,
                        }))
                      );
                    } else {
                      setRewards(
                        mockRewards.map((reward) => ({
                          ...reward,
                          canAfford: reward.cost <= userCredits,
                        }))
                      );
                    }
                  }}
                />
                <label
                  htmlFor="affordable-filter"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show only what I can afford
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Rewards Grid */}
        {sortedRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedRewards.map((reward) => (
              <div
                key={reward._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  {reward.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {reward.cost} Credits
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">
                      {getRewardTypeIcon(reward.type)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      {getRewardTypeLabel(reward.type)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {reward.description}
                  </p>
                  {reward.availableQuantity > 0 && (
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500">
                        {reward.availableQuantity}{" "}
                        {reward.availableQuantity === 1 ? "item" : "items"}{" "}
                        remaining
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => openRewardModal(reward)}
                    disabled={isAuthenticated && !reward.canAfford}
                    className={`w-full py-2 px-4 rounded text-center transition-colors ${
                      isAuthenticated
                        ? reward.canAfford
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isAuthenticated
                      ? reward.canAfford
                        ? "Redeem Reward"
                        : `Need ${reward.cost - userCredits} more credits`
                      : "Log in to Redeem"}
                  </button>
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
              No rewards available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filter options or check back later.
            </p>
          </div>
        )}

        {/* Reward Modal */}
        {isRewardModalOpen && selectedReward && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Redeem Reward
                </h3>
                <button
                  onClick={() => setIsRewardModalOpen(false)}
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <img
                    src={selectedReward.imageUrl}
                    alt={selectedReward.title}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedReward.title}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className="text-blue-600 font-medium">
                        {selectedReward.cost} Credits
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500">
                        {getRewardTypeLabel(selectedReward.type)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {selectedReward.description}
                </p>

                {selectedReward.redemptionInstructions && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">
                            Redemption Instructions:{" "}
                          </span>
                          {selectedReward.redemptionInstructions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        Your current balance:
                      </span>
                      <span className="text-sm font-medium">
                        {userCredits} Credits
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Cost:</span>
                      <span className="text-sm font-medium">
                        - {selectedReward.cost} Credits
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-700">
                        New balance:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          userCredits - selectedReward.cost < 0
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {userCredits - selectedReward.cost} Credits
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsRewardModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeemReward}
                  disabled={isAuthenticated && !selectedReward.canAfford}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isAuthenticated
                      ? selectedReward.canAfford
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isAuthenticated
                    ? selectedReward.canAfford
                      ? "Confirm Redemption"
                      : `Need ${selectedReward.cost - userCredits} more credits`
                    : "Log in to Redeem"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Redemption History Modal */}
        {isRedemptionHistoryOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Your Redemption History
                </h3>
                <button
                  onClick={() => setIsRedemptionHistoryOpen(false)}
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {userRedemptions.length > 0 ? (
                <div className="space-y-4">
                  {userRedemptions.map((redemption) => (
                    <div
                      key={redemption._id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-4 bg-white flex flex-col sm:flex-row">
                        <div className="sm:w-1/4 mb-4 sm:mb-0">
                          <img
                            src={redemption.reward.imageUrl}
                            alt={redemption.reward.title}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        </div>
                        <div className="sm:w-3/4 sm:pl-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                            <h4 className="text-md font-semibold text-gray-900">
                              {redemption.reward.title}
                            </h4>
                            <div className="mt-1 sm:mt-0 flex items-center">
                              <span className="text-blue-600 font-medium mr-3">
                                {redemption.creditsCost} Credits
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  redemption.status === "fulfilled"
                                    ? "bg-green-100 text-green-800"
                                    : redemption.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {redemption.status.charAt(0).toUpperCase() +
                                  redemption.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Redeemed on{" "}
                            {new Date(
                              redemption.createdAt
                            ).toLocaleDateString()}
                          </p>
                          {redemption.status === "fulfilled" &&
                            redemption.fulfillmentDetails && (
                              <div className="bg-gray-50 p-3 rounded-md text-sm mt-3">
                                <p className="font-medium text-gray-700">
                                  Fulfillment Details:
                                </p>
                                <p className="text-gray-600 break-words">
                                  {redemption.fulfillmentDetails}
                                </p>
                              </div>
                            )}
                          {redemption.status === "pending" && (
                            <p className="text-sm text-yellow-600 mt-2">
                              Your redemption is being processed.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
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
                    No redemptions yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start redeeming rewards to see your history here.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsRedemptionHistoryOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
