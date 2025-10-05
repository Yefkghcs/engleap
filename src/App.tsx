import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import VocabularyHome from "./pages/VocabularyHome";
import VocabularyBook from "./pages/VocabularyBook";
import Learn from "./pages/Learn";
import LearnCards from "./pages/LearnCards";
import Challenge from "./pages/Challenge";
import Mistakes from "./pages/Mistakes";
import LearnedWords from "./pages/LearnedWords";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/vocabulary" element={<VocabularyHome />} />
          <Route path="/vocabulary/custom/:customId" element={<VocabularyBook />} />
          <Route path="/vocabulary/custom/:customId/learn" element={<Learn />} />
          <Route path="/vocabulary/custom/:customId/learn-cards" element={<LearnCards />} />
          <Route path="/vocabulary/custom/:customId/challenge" element={<Challenge />} />
          <Route path="/vocabulary/mistakes/learn" element={<Learn />} />
          <Route path="/vocabulary/learned/learn" element={<Learn />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/vocabulary/learned" element={<LearnedWords />} />
          <Route path="/vocabulary/:bookId" element={<VocabularyBook />} />
          <Route path="/vocabulary/:bookId/learn" element={<Learn />} />
          <Route path="/vocabulary/:bookId/learn-cards" element={<LearnCards />} />
          <Route path="/vocabulary/:bookId/challenge" element={<Challenge />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
