import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Load Poppins and Remix Icon fonts
    const poppinsLink = document.createElement("link");
    poppinsLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    poppinsLink.rel = "stylesheet";
    document.head.appendChild(poppinsLink);

    const remixIconLink = document.createElement("link");
    remixIconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
    remixIconLink.rel = "stylesheet";
    document.head.appendChild(remixIconLink);

    // Update document title
    document.title = "MemeChakra - AI-Powered Desi Meme Revolution";

    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(remixIconLink);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
