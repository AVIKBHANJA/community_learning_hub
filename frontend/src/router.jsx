import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";

// Import layouts and components
import RootLayout from "./components/layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/Profile"));
const Credits = lazy(() => import("./pages/Credits"));
const Achievements = lazy(() => import("./pages/Achievements"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LearningPaths = lazy(() => import("./pages/LearningPaths"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Forum = lazy(() => import("./pages/Forum"));
const ForumPost = lazy(() => import("./pages/ForumPost"));
const LearningPathDetail = lazy(() => import("./pages/LearningPathDetail"));

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Home />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Register />
          </Suspense>
        ),
      },
      {
        path: "feed",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Feed />
          </Suspense>
        ),
      },
      {
        path: "learning-paths",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <LearningPaths />
          </Suspense>
        ),
      },
      {
        path: "learning-paths/:id",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <LearningPathDetail />
          </Suspense>
        ),
      },
      {
        path: "forum",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Forum />
          </Suspense>
        ),
      },
      {
        path: "forum/:id",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <ForumPost />
          </Suspense>
        ),
      },
      {
        path: "marketplace",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <Marketplace />
          </Suspense>
        ),
      },
      // Protected routes that require authentication
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "credits",
            element: (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                <Credits />
              </Suspense>
            ),
          },
          {
            path: "achievements",
            element: (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                <Achievements />
              </Suspense>
            ),
          },
        ],
      },
      // Protected routes that require admin role
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            path: "admin",
            element: (
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                <AdminDashboard />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                Loading...
              </div>
            }
          >
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
