import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  setSession,
  fetchProfile,
  setLoading,
  getHomeRoute,
} from "@/store/slices/authSlice";

import AppLayout from "@/components/layout/AppLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import AppointmentDetail from "@/pages/appointments/AppointmentDetail";
import { Toaster } from "@/components/ui/sonner";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import FindTrainers from "@/pages/user/FindTrainers";
import UserBookings from "@/pages/user/UserBookings";
import TrainerProfile from "@/pages/trainers/TrainerProfile";
import TrainerDashboard from "@/pages/trainer/TrainerDashboard";
import TrainerAppointments from "@/pages/trainer/TrainerAppointments";
import TrainerTimeslots from "@/pages/trainer/TrainerTimeslots";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTrainers from "@/pages/admin/AdminTrainers";
import AdminAppointments from "@/pages/admin/AdminAppointments";
import AddTrainer from "@/pages/admin/AddTrainer";
import EditTrainer from "@/pages/admin/EditTrainer";
import { Skeleton } from "@/components/ui/skeleton";
import Colors from "@/pages/colors/Colors";

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, user, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <Skeleton className="w-12 h-12 rounded-full mx-auto" />
          <Skeleton className="w-48 h-4 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        dispatch(setSession({ session, user: null }));

        dispatch(fetchProfile(session.user.id));
      } else {
        dispatch(setLoading(false));
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("event, session", { event, session });

      if (session) {
        dispatch(setSession({ session, user: null }));

        dispatch(fetchProfile(session.user.id));

        if (event === "PASSWORD_RECOVERY") {
          navigate("/reset-password");
        }
      } else {
        dispatch(setSession({ session: null, user: null }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRoute(user?.role)} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRoute(user?.role)} replace />
          ) : (
            <Signup />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRoute(user?.role)} replace />
          ) : (
            <ForgotPassword />
          )
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={<Navigate to={getHomeRoute(user?.role)} replace />}
      />

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

      {/* Trainer routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/appointments"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer/timeslots"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerTimeslots />
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
      <Route
        path="/colors"
        element={
          <ProtectedRoute>
            <Colors />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trainers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTrainers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-trainer"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddTrainer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-trainer/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditTrainer />
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
