import { Button } from "@/components/ui/button";
import { useAuthClient } from "@/lib/auth";
import { Leaf, Loader2, Lock, LogIn } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AuthGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AuthGate({
  children,
  title = "Login Required",
  description = "Please log in to access this feature and keep your data private.",
}: AuthGateProps) {
  const { isAuthenticated, isInitializing, isLoggingIn, login } =
    useAuthClient();

  if (isInitializing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 gap-4"
        data-ocid="auth.loading_state"
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 gap-6 text-center"
        data-ocid="auth.panel"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-3 h-3 text-primary-foreground" />
          </div>
          Your diagnoses are securely stored under your identity
        </div>
        <Button
          size="lg"
          className="rounded-full px-8 gap-2"
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="auth.primary_button"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {isLoggingIn ? "Logging in…" : "Log In to Continue"}
        </Button>
      </motion.div>
    );
  }

  return <>{children}</>;
}
