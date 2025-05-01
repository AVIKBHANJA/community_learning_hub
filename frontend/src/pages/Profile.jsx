import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCredits } from "../contexts/CreditContext";

const Profile = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { credits, transactions } = useCredits();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileStats, setProfileStats] = useState({
    contentSaved: 0,
    contentShared: 0,
    creditsEarned: 0,
    creditsSpent: 0,
  });

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // In a real app, this would be a fetch call to get user stats
    const fetchUserStats = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Calculate stats from transactions
        const saved = transactions.filter((t) =>
          t.description.includes("Saved content")
        ).length;
        const shared = transactions.filter((t) =>
          t.description.includes("Shared content")
        ).length;
        const earned = transactions.reduce(
          (total, t) => (t.amount > 0 ? total + t.amount : total),
          0
        );
        const spent = transactions.reduce(
          (total, t) => (t.amount < 0 ? total + Math.abs(t.amount) : total),
          0
        );

        setProfileStats({
          contentSaved: saved,
          contentShared: shared,
          creditsEarned: earned,
          creditsSpent: spent,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [isAuthenticated, navigate, transactions]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-semibold border-4 border-white">
                {currentUser.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {currentUser.name || "User"}
                </h1>
                <p className="text-blue-100">{currentUser.email}</p>
                <div className="flex items-center mt-2">
                  <div className="bg-blue-200 bg-opacity-30 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Member since{" "}
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "April 2025"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("credit-history")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "credit-history"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Credit History
              </button>
              <button
                onClick={() => setActiveTab("saved-content")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "saved-content"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Saved Content
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Profile Information
                  </h2>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Log Out
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-500">
                        Credits Balance
                      </h3>
                      <span className="text-xs text-blue-600 font-medium">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-3xl font-bold text-gray-900">
                        {credits}
                      </p>
                      <p className="ml-2 text-sm text-gray-600">points</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-500">
                        Account Status
                      </h3>
                      <span className="text-xs text-green-600 font-medium">
                        Good standing
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-lg font-medium text-gray-900">
                        Standard Member
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Upgrade to Premium for exclusive content
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Activity Summary
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Content Saved
                    </h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {profileStats.contentSaved}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Content Shared
                    </h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {profileStats.contentShared}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Credits Earned
                    </h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {profileStats.creditsEarned}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Credits Spent
                    </h4>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {profileStats.creditsSpent}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Account Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Receive updates about new content
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-email"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle-email"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Weekly Digest
                        </h4>
                        <p className="text-sm text-gray-500">
                          Get a summary of top content weekly
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle-digest"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          htmlFor="toggle-digest"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Credit History Tab */}
            {activeTab === "credit-history" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Credit Transactions
                  </h2>
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                    <span className="font-semibold">Current Balance:</span>{" "}
                    {credits} credits
                  </div>
                </div>

                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Balance After
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                transaction.timestamp
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                transaction.amount > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.balanceAfter}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No credit transactions yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start interacting with content to earn credits!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Content Tab */}
            {activeTab === "saved-content" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Saved Content
                </h2>

                {/* Fetch saved items from localStorage */}
                {(() => {
                  const savedItems = JSON.parse(
                    localStorage.getItem("savedItems") || "[]"
                  );

                  if (savedItems.length > 0) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedItems.map((item) => (
                          <div
                            key={item.id}
                            className="border rounded-lg overflow-hidden flex"
                          >
                            <div className="w-1/3 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                From {item.source} •{" "}
                                {new Date(
                                  item.publishedAt
                                ).toLocaleDateString()}
                              </p>
                              <div className="mt-auto flex justify-between items-center">
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Visit Source
                                </a>
                                <button
                                  onClick={() => {
                                    const updatedItems = savedItems.filter(
                                      (i) => i.id !== item.id
                                    );
                                    localStorage.setItem(
                                      "savedItems",
                                      JSON.stringify(updatedItems)
                                    );
                                    // Force re-render
                                    window.location.reload();
                                  }}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
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
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No saved content
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Browse the feed and save items for later.
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #fff;
          right: 4px;
          top: 0;
        }
        .toggle-label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
