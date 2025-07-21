import React from "react";
import { Switch, Route, Router as WouterRouter, BaseLocationHook, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import NotFound from "@/pages/not-found";
import MainLayout from "@/pages/main-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLayout} />
      <Route path="/tool/:toolId" component={MainLayout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <WouterRouter>
          <Router />
        </WouterRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
