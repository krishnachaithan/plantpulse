import AuthGate from "@/components/AuthGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllUsersDiagnoses, useIsCallerAdmin } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Crown,
  Leaf,
  Loader2,
  ShieldX,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { DiagnosisResult, UserWithDiagnoses } from "../backend";

function HealthBadge({ status }: { status: DiagnosisResult["healthStatus"] }) {
  const config = {
    healthy: {
      label: "Healthy",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    mild: {
      label: "Mild",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: AlertTriangle,
    },
    moderate: {
      label: "Moderate",
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: AlertTriangle,
    },
    severe: {
      label: "Severe",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.className}`}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function formatDate(timestamp: bigint) {
  return new Date(Number(timestamp) / 1_000_000).toLocaleString();
}

function UserDiagnosesRow({
  entry,
  index,
}: { entry: UserWithDiagnoses; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const displayName =
    entry.profile?.name ?? `${entry.user.toString().slice(0, 14)}…`;
  const count = entry.diagnoses.length;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`admin.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
        data-ocid={`admin.toggle.${index + 1}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-foreground block truncate">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {entry.user.toString().slice(0, 22)}…
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Leaf className="w-3 h-3" />
            {count} diagnosis{count !== 1 ? "es" : ""}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border pt-4">
              {count === 0 ? (
                <p className="text-sm text-muted-foreground italic py-4 text-center">
                  No diagnoses recorded for this user.
                </p>
              ) : (
                <div className="space-y-3">
                  {entry.diagnoses.map((d, di) => (
                    <div
                      key={Number(d.timestamp)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                      data-ocid={`admin.row.${index + 1}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">
                            {d.plantName}
                          </span>
                          <HealthBadge status={d.healthStatus} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(d.timestamp)}
                        </p>
                        {d.conditions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {d.conditions.map((c) => (
                              <Badge
                                key={c}
                                variant="secondary"
                                className="rounded-full text-xs py-0"
                              >
                                {c}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="hidden sm:block text-xs text-muted-foreground flex-shrink-0">
                        #{di + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdminContent() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const {
    data: allDiagnoses,
    isLoading,
    refetch,
    isRefetching,
  } = useGetAllUsersDiagnoses();

  if (isAdminLoading) {
    return (
      <main
        className="flex-1 flex items-center justify-center py-32"
        data-ocid="admin.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">
            Verifying admin access…
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex-1 flex items-center justify-center py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
          data-ocid="admin.error_state"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            This page is only accessible to PlantPulse admins.
          </p>
          <Link to="/">
            <Button className="rounded-full">Go Home</Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  const totalDiagnoses =
    allDiagnoses?.reduce((sum, u) => sum + u.diagnoses.length, 0) ?? 0;

  return (
    <main className="flex-1 container mx-auto px-6 py-10 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground ml-[52px]">
          View all users and their plant diagnoses across the platform.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Users
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {allDiagnoses?.length ?? "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Diagnoses
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {totalDiagnoses}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-border p-5 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-2"
            onClick={() => refetch()}
            disabled={isRefetching}
            data-ocid="admin.secondary_button"
          >
            {isRefetching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading all user diagnoses…
          </p>
        </div>
      ) : !allDiagnoses || allDiagnoses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-12 text-center"
          data-ocid="admin.empty_state"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            No data yet
          </h2>
          <p className="text-muted-foreground text-sm">
            No users have submitted any diagnoses yet.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {allDiagnoses.map((entry, i) => (
            <UserDiagnosesRow
              key={entry.user.toString()}
              entry={entry}
              index={i}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <div className="flex-1 bg-mint">
      <AuthGate
        title="Log In to Access Admin"
        description="Admin dashboard is restricted. Please log in to continue."
      >
        <AdminContent />
      </AuthGate>
    </div>
  );
}
