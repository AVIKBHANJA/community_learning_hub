import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const Credits = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { creditBalance, getCreditBalance } = useCredits();

  const [activeTab, setActiveTab] = useState("marketplace");
  const [rewards, setRewards] = useState([]);
  const [userRedemptions, setUserRedemptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [filterType, setFilterType] = useState("");
  const [redeemStatus, setRedeemStatus] = useState({ message: "", type: "" });

  // Mock data for frontend development
  const mockRewards = [
    {
      _id: "1",
      title: "Premium Tutorial Access",
      description:
        "Get access to our exclusive premium tutorials and workshops for 30 days.",
      type: "premium_content",
      imageUrl: "https://picsum.photos/seed/reward1/400/250",
      cost: 50,
      isAvailable: true,
      availableQuantity: -1,
      featured: true,
    },
    {
      _id: "2",
      title: "1-on-1 Code Review Session",
      description:
        "Schedule a 30-minute code review session with one of our expert mentors.",
      type: "mentorship",
      imageUrl: "https://picsum.photos/seed/reward2/400/250",
      cost: 100,
      isAvailable: true,
      availableQuantity: 5,
    },
    {
      _id: "3",
      title: "Advanced Developer Badge",
      description: "Show off your expertise with this exclusive profile badge.",
      type: "badge",
      imageUrl: "https://picsum.photos/seed/reward3/400/250",
      cost: 75,
      isAvailable: true,
      availableQuantity: -1,
    },
    {
      _id: "4",
      title: "Community Expert Certificate",
      description:
        "Earn an official certificate recognizing your contributions to the community.",
      type: "certificate",
      imageUrl: "https://picsum.photos/seed/reward4/400/250",
      cost: 150,
      isAvailable: true,
      availableQuantity: -1,
    },
    {
      _id: "5",
      title: "Learning Hub T-Shirt",
      description:
        "Get a premium quality Community Learning Hub t-shirt delivered to your door.",
      type: "merchandise",
      imageUrl: "https://picsum.photos/seed/reward5/400/250",
      cost: 120,
      isAvailable: true,
      availableQuantity: 20,
    },
    {
      _id: "6",
      title: "Exclusive Online Workshop Ticket",
      description:
        "Join our upcoming exclusive workshop on advanced development techniques.",
      type: "exclusive_event",
      imageUrl: "https://picsum.photos/seed/reward6/400/250",
      cost: 80,
      isAvailable: true,
      availableQuantity: 15,
      expiresAt: "2025-06-30T00:00:00Z",
    },
  ];

  // Mock transaction history data
  const mockTransactions = [
    {
      _id: "t1",
      type: "earn",
      amount: 5,
      purpose: "create_forum_post",
      description: "Created forum post: Getting started with React Hooks",
      createdAt: "2025-04-25T14:32:00Z",
    },
    {
      _id: "t2",
      type: "earn",
      amount: 10,
      purpose: "complete_learning_content",
      description: "Completed module in Web Development Fundamentals",
      createdAt: "2025-04-24T16:45:00Z",
    },
    {
      _id: "t3",
      type: "earn",
      amount: 2,
      purpose: "create_forum_comment",
      description: "Posted a comment on a forum post",
      createdAt: "2025-04-23T11:20:00Z",
    },
    {
      _id: "t4",
      type: "spend",
      amount: 50,
      purpose: "redeem_reward",
      description: "Redeemed reward: Premium Tutorial Access",
      createdAt: "2025-04-22T09:15:00Z",
    },
    {
      _id: "t5",
      type: "earn",
      amount: 20,
      purpose: "complete_learning_path",
      description: "Completed learning path: JavaScript Essentials",
      createdAt: "2025-04-21T18:30:00Z",
    },
  ];

  // Mock redemption history data
  const mockRedemptions = [
    {
      _id: "r1",
      reward: {
        _id: "1",
        title: "Premium Tutorial Access",
        description:
          "Get access to our exclusive premium tutorials and workshops for 30 days.",
        type: "premium_content",
        imageUrl: "https://picsum.photos/seed/reward1/400/250",
        cost: 50,
        redemptionInstructions:
          "Your access code is: PREM-123456. Use this at premium.learninghub.com",
      },
      creditsCost: 50,
      status: "fulfilled",
      createdAt: "2025-04-22T09:15:00Z",
      fulfilledAt: "2025-04-22T09:20:00Z",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real application, these would be API calls
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API latency

        // Load data based on active tab
        if (activeTab === "marketplace") {
          setRewards(mockRewards);
        } else if (activeTab === "history") {
          setTransactions(mockTransactions);
        } else if (activeTab === "redemptions") {
          setUserRedemptions(mockRedemptions);
        }

        // Get credit balance
        getCreditBalance();

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, getCreditBalance]);

  // Filter and sort rewards
  const filteredRewards = rewards
    .filter((reward) => !filterType || reward.type === filterType)
    .sort((a, b) => {
      if (sortOption === "cost-asc") return a.cost - b.cost;
      if (sortOption === "cost-desc") return b.cost - a.cost;
      if (sortOption === "featured") return b.featured ? 1 : -1;
      return 0;
    });

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      // Close modal first
      setIsConfirmModalOpen(false);

      // In a real app, this would be an API call
      console.log(`Redeeming reward: ${selectedReward._id}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user has enough credits
      if (creditBalance < selectedReward.cost) {
        setRedeemStatus({
          message: "You don't have enough credits for this reward.",
          type: "error",
        });
        return;
      }

      // Add to redemptions
      const newRedemption = {
        _id: `r${userRedemptions.length + 1}`,
        reward: selectedReward,
        creditsCost: selectedReward.cost,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setUserRedemptions([newRedemption, ...userRedemptions]);

      // Add transaction
      const newTransaction = {
        _id: `t${transactions.length + 1}`,
        type: "spend",
        amount: selectedReward.cost,
        purpose: "redeem_reward",
        description: `Redeemed reward: ${selectedReward.title}`,
        createdAt: new Date().toISOString(),
      };

      setTransactions([newTransaction, ...transactions]);

      // Update credit balance locally (getCreditBalance would be called in a real app)
      getCreditBalance();

      // Show success message
      setRedeemStatus({
        message: `Successfully redeemed "${selectedReward.title}" for ${selectedReward.cost} credits!`,
        type: "success",
      });

      // Switch to redemptions tab after a delay
      setTimeout(() => {
        setActiveTab("redemptions");
        setRedeemStatus({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      setRedeemStatus({
        message: "Failed to redeem reward. Please try again.",
        type: "error",
      });
    }
  };

  // Reward type to display name mapping
  const typeDisplayNames = {
    premium_content: "Premium Content",
    exclusive_event: "Exclusive Event",
    mentorship: "Mentorship",
    badge: "Profile Badge",
    certificate: "Certificate",
    merchandise: "Merchandise",
    discount: "Discount",
    donation: "Donation",
    other: "Other",
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
        {/* Header with Credit Balance */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Credits & Rewards
            </h1>
            <p className="mt-1 text-gray-600">
              Earn credits by participating in the community and spend them on
              exclusive rewards.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">
              Your Credit Balance
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {creditBalance} credits
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {redeemStatus.message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              redeemStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {redeemStatus.message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "marketplace"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab("redemptions")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "redemptions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Redemptions
            </button>
          </nav>
        </div>

        {/* Marketplace Tab */}
        {activeTab === "marketplace" && (
          <div>
            {/* Filters */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {Object.entries(typeDisplayNames).map(([key, name]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="cost-asc">Price: Low to High</option>
                    <option value="cost-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rewards Grid */}
            {filteredRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => (
                  <div
                    key={reward._id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${
                      !reward.isAvailable ? "opacity-75" : ""
                    }`}
                  >
                    {/* Featured badge */}
                    {reward.featured && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-lg z-10">
                        Featured
                      </div>
                    )}

                    {/* Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800`}
                        >
                          {typeDisplayNames[reward.type]}
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          {reward.cost} credits
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {reward.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 flex-1">
                        {reward.description}
                      </p>

                      {/* Availability Info */}
                      {reward.availableQuantity !== -1 &&
                        reward.availableQuantity > 0 && (
                          <div className="text-xs text-gray-500 mb-2">
                            Only {reward.availableQuantity} left
                          </div>
                        )}

                      {reward.expiresAt && (
                        <div className="text-xs text-gray-500 mb-2">
                          Available until{" "}
                          {new Date(reward.expiresAt).toLocaleDateString()}
                        </div>
                      )}

                      {!reward.isAvailable && reward.unavailableReason && (
                        <div className="text-xs text-red-600 mb-2">
                          {reward.unavailableReason}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => handleRedeemClick(reward)}
                        disabled={
                          !reward.isAvailable || creditBalance < reward.cost
                        }
                        className={`mt-4 w-full py-2 px-4 rounded font-medium ${
                          !reward.isAvailable
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : creditBalance < reward.cost
                            ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {!reward.isAvailable
                          ? "Unavailable"
                          : creditBalance < reward.cost
                          ? `Need ${reward.cost - creditBalance} more credits`
                          : "Redeem Reward"}
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
                  No rewards found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {transactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <li key={transaction._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description}
                          </p>
                          <p className="mt-1 sm:mt-0 sm:ml-4 text-xs text-gray-500">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              transaction.createdAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        <div
                          className={`ml-2 flex-shrink-0 font-bold ${
                            transaction.type === "earn"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earn" ? "+" : "-"}
                          {transaction.amount} credits
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-xs text-gray-500">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize bg-gray-100 text-gray-800">
                              {transaction.purpose.replace(/_/g, " ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No transactions yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start participating in the community to earn credits.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Redemptions Tab */}
        {activeTab === "redemptions" && (
          <div>
            {userRedemptions.length > 0 ? (
              <div className="space-y-6">
                {userRedemptions.map((redemption) => (
                  <div
                    key={redemption._id}
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                  >
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {redemption.reward.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Redeemed on{" "}
                          {new Date(redemption.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          redemption.status === "fulfilled"
                            ? "bg-green-100 text-green-800"
                            : redemption.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {redemption.status.charAt(0).toUpperCase() +
                          redemption.status.slice(1)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {typeDisplayNames[redemption.reward.type]}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Cost
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {redemption.creditsCost} credits
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Description
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {redemption.reward.description}
                          </dd>
                        </div>
                        {redemption.status === "fulfilled" &&
                          redemption.reward.redemptionInstructions && (
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">
                                Redemption Instructions
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                                {redemption.reward.redemptionInstructions}
                              </dd>
                            </div>
                          )}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-lg">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m-8-4l8 4m8 4l-8 4m-8-4l8 4m-8-4v-8m16 0v8"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No rewards redeemed yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check out the marketplace to redeem your credits for rewards.
                </p>
                <button
                  onClick={() => setActiveTab("marketplace")}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedReward && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Redemption
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to redeem{" "}
              <strong>{selectedReward.title}</strong> for{" "}
              <strong>{selectedReward.cost} credits</strong>?
            </p>

            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-gray-600">
                  Your credit balance after redemption will be{" "}
                  {creditBalance - selectedReward.cost} credits.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;
