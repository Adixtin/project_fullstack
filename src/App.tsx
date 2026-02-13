import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import ChartPage from "./pages/ChartPage";
import FormPage from "./pages/FormPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/chart" element={<ChartPage />} />
                    <Route path="/form" element={<FormPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
