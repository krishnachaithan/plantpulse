import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useAuthClient } from "@/lib/auth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Crown,
  History,
  Leaf,
  Loader2,
  LogIn,
  LogOut,
  Microscope,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

function useProfileName(isAuthenticated: boolean) {
  const { actor, isFetching } = useActor();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !actor || isFetching) return;
    actor
      .getCallerUserProfile()
      .then((profile) => {
        setDisplayName(profile?.name ?? null);
      })
      .catch(() => {});
  }, [actor, isFetching, isAuthenticated]);

  return displayName;
}

export default function NavBar() {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    logout,
    principal,
  } = useAuthClient();

  const displayName = useProfileName(isAuthenticated);
  const { data: isAdmin } = useIsCallerAdmin();
  const location = useLocation();
  const path = location.pathname;

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">PlantPulse</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/diagnose"
            className={navLinkClass(path === "/diagnose")}
            data-ocid="nav.link"
          >
            <Microscope className="w-4 h-4" />
            Diagnose
          </Link>
          <Link
            to="/history"
            className={navLinkClass(path === "/history")}
            data-ocid="nav.link"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className={navLinkClass(path === "/profile")}
              data-ocid="nav.link"
            >
              <UserCircle className="w-4 h-4" />
              Profile
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                path === "/admin"
                  ? "bg-amber-100 text-amber-700"
                  : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              }`}
              data-ocid="nav.link"
            >
              <Crown className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isInitializing ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium truncate max-w-[140px]"
                data-ocid="nav.link"
              >
                {isAdmin && (
                  <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
                )}
                {displayName ?? `${principal?.toString().slice(0, 10)}…`}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={logout}
                data-ocid="nav.secondary_button"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="gap-2 rounded-full"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoggingIn ? "Logging in…" : "Log In"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
