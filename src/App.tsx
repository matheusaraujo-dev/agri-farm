
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/organisms/ProtectedRoute";
import Navigation from "./components/organisms/Navigation";
import Index from "./pages/Index";
import ProducersPage from "./pages/ProducersPage";
import FarmsPage from "./pages/FarmsPage";
import CropsPage from "./pages/CropsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/producers" element={<ProducersPage />} />
                    <Route path="/farms" element={<FarmsPage />} />
                    <Route path="/crops" element={<CropsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
