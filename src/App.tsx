import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import Videos from "./pages/Videos";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Index />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/profile" element={<Profile />} /> */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={isAuthenticated ? <Index /> : <Login />}
            />
            <Route
              path="/calculator"
              element={isAuthenticated ? <Calculator /> : <Login />}
            />
            <Route
              path="/videos"
              element={isAuthenticated ? <Videos /> : <Login />}
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;