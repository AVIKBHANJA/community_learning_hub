import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});

  // Mock data for frontend development
  const mockUsers = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "user",
      status: "active",
      joinedDate: "2025-01-15T10:30:00Z",
      lastActive: "2025-04-27T09:45:00Z",
      credits: 475,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      status: "active",
      joinedDate: "2025-01-03T14:20:00Z",
      lastActive: "2025-04-27T11:10:00Z",
      credits: 720,
    },
    {
      id: "3",
      name: "David Chen",
      email: "david.chen@example.com",
      role: "user",
      status: "inactive",
      joinedDate: "2025-02-10T08:15:00Z",
      lastActive: "2025-04-10T16:30:00Z",
      credits: 150,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "user",
      status: "active",
      joinedDate: "2025-03-05T11:40:00Z",
      lastActive: "2025-04-26T13:25:00Z",
      credits: 310,
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "moderator",
      status: "active",
      joinedDate: "2025-01-20T09:10:00Z",
      lastActive: "2025-04-27T10:05:00Z",
      credits: 890,
    },
  ];

  const mockContent = [
    {
      id: "1",
      title: "Getting Started with React Hooks",
      source: "Medium",
      category: "programming",
      status: "approved",
      views: 3245,
      upvotes: 42,
      createdAt: "2025-04-24T10:30:00Z",
    },
    {
      id: "2",
      title: "Introduction to Machine Learning",
      source: "Dev.to",
      category: "data-science",
      status: "approved",
      views: 2180,
      upvotes: 38,
      createdAt: "2025-04-25T14:15:00Z",
    },
    {
      id: "3",
      title: "Controversial Tech Opinions",
      source: "User Contribution",
      category: "technology",
      status: "pending",
      views: 0,
      upvotes: 0,
      createdAt: "2025-04-27T09:20:00Z",
    },
    {
      id: "4",
      title: "Understanding Blockchain Technology",
      source: "freeCodeCamp",
      category: "technology",
      status: "approved",
      views: 1845,
      upvotes: 51,
      createdAt: "2025-04-23T16:20:00Z",
    },
    {
      id: "5",
      title: "Web Scraping Ethics",
      source: "User Contribution",
      category: "programming",
      status: "rejected",
      views: 0,
      upvotes: 0,
      createdAt: "2025-04-26T13:10:00Z",
      rejectionReason:
        "Content promotes unauthorized data collection practices",
    },
  ];

  const mockReports = [
    {
      id: "1",
      contentId: "2",
      contentTitle: "Introduction to Machine Learning",
      reportedBy: "David Chen",
      reason: "Inaccurate information",
      description:
        "The article contains misleading information about neural networks.",
      status: "pending",
      createdAt: "2025-04-27T08:30:00Z",
    },
    {
      id: "2",
      contentId: "4",
      contentTitle: "Understanding Blockchain Technology",
      reportedBy: "Sarah Williams",
      reason: "Outdated content",
      description:
        "The article references deprecated technologies and methods.",
      status: "resolved",
      createdAt: "2025-04-26T15:45:00Z",
      resolvedAt: "2025-04-27T10:15:00Z",
      resolution: "Content updated with current information",
    },
    {
      id: "3",
      contentId: "1",
      contentTitle: "Getting Started with React Hooks",
      reportedBy: "Michael Brown",
      reason: "Plagiarism",
      description:
        "This content appears to be copied from React official documentation without attribution.",
      status: "pending",
      createdAt: "2025-04-27T11:20:00Z",
    },
  ];

  const mockStats = {
    totalUsers: 5032,
    activeUsers: 4218,
    totalContent: 12457,
    pendingContent: 37,
    totalCreditsIssued: 982750,
    reportsPending: 14,
    newUsersToday: 78,
    contentAddedToday: 113,
  };

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setUsers(mockUsers);
      setContent(mockContent);
      setReports(mockReports);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (id, newStatus, type) => {
    if (type === "user") {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    } else if (type === "content") {
      setContent(
        content.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } else if (type === "report") {
      setReports(
        reports.map((report) =>
          report.id === id
            ? {
                ...report,
                status: "resolved",
                resolvedAt: new Date().toISOString(),
                resolution: "Issue addressed by admin",
              }
            : report
        )
      );
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
    <div className="bg-gray-50 min-h-[calc(100vh-128px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, content, and community reports.
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-green-600">
              +{stats.newUsersToday} today
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Total Content</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalContent}
            </p>
            <p className="text-xs text-green-600">
              +{stats.contentAddedToday} today
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Pending Content</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.pendingContent}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Pending Reports</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.reportsPending}
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* Users tab */}
        {activeTab === "users" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Users
              </h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm px-4 py-2 mr-2"
                />
                <select className="border-gray-300 rounded-md shadow-sm px-4 py-2">
                  <option value="all">All roles</option>
                  <option value="user">Users</option>
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Credits
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Active
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "moderator"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        {user.status === "active" ? (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "inactive", "user")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "active", "user")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Enable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content tab */}
        {activeTab === "content" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Content
              </h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search content..."
                  className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm px-4 py-2 mr-2"
                />
                <select className="border-gray-300 rounded-md shadow-sm px-4 py-2">
                  <option value="all">All status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Source
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Views
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.source}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  item.id,
                                  "approved",
                                  "content"
                                )
                              }
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  item.id,
                                  "rejected",
                                  "content"
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports tab */}
        {activeTab === "reports" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Reports
              </h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm px-4 py-2 mr-2"
                />
                <select className="border-gray-300 rounded-md shadow-sm px-4 py-2">
                  <option value="all">All status</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Content
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reported By
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reason
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report.contentTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {report.reportedBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.reason}
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Content
                        </button>
                        {report.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                report.id,
                                "resolved",
                                "report"
                              )
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
