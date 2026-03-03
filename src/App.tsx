import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
// import AppLayout from "@/components/layout/AppLayout";

// function ProtectedRoute({
//   children,
//   allowedRoles,
// }: {
//   children: React.ReactNode;
//   allowedRoles?: string[];
// }) {
//   const { isAuthenticated, user } = useAppSelector((s) => s.auth);

//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/login" replace />;
//   }

//   return <AppLayout>{children}</AppLayout>;
// }

function AppRoutes() {
  // const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const isAuthenticated = false;
  const user = { role: "guest" };

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
