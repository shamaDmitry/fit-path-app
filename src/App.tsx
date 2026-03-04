import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store, useAppSelector } from "@/store";

import AppLayout from "@/components/layout/AppLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import AppointmentDetail from "@/pages/appointments/AppointmentDetail";
import { Toaster } from "@/components/ui/sonner";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import FindTrainers from "@/pages/user/FindTrainers";
import UserBookings from "@/pages/user/UserBookings";
import TrainerProfile from "@/pages/trainers/TrainerProfile";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const homeRedirect = () => {
    if (!isAuthenticated) return "/login";

    if (user?.role === "admin") return "/admin";

    if (user?.role === "trainer") return "/trainer";

    return "/dashboard";
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={homeRedirect()} replace /> : <Login />
        }
      />
      <Route path="/" element={<Navigate to={homeRedirect()} replace />} />

      {/* User routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainers"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <FindTrainers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserBookings />
          </ProtectedRoute>
        }
      />

      {/* Shared detail routes */}
      <Route
        path="/trainers/:id"
        element={
          <ProtectedRoute>
            <TrainerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/:id"
        element={
          <ProtectedRoute>
            <AppointmentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />

          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  );
}

export default App;
