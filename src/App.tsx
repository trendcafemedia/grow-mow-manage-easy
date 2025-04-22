import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Calendar from "./pages/Calendar";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth/Auth";
import AuthCallback from "./pages/auth/AuthCallback";
import Map from "./pages/Map";
import LoginPage from "./pages/auth/LoginPage";

const queryClient = new QueryClient();

// App with Auth Provider
const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

// Routes component
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const isDevelopment = import.meta.env.DEV;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/auth" 
          element={!user && !isDevelopment ? <LoginPage /> : <Navigate to="/" replace />} 
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected routes - bypass auth check in development */}
        <Route 
          element={user || isDevelopment ? <MainLayout /> : <Navigate to="/auth" replace />}
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/map" element={<Map />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <AppWithAuth />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
