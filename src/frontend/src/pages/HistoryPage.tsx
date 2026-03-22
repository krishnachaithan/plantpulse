import AuthGate from "@/components/AuthGate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useClearDiagnosisHistory,
  useGetDiagnosisHistory,
} from "@/hooks/useQueries";
import { useAuthClient } from "@/lib/auth";
import { shareOrCopy } from "@/lib/share";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bug,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Droplets,
  Heart,
  Leaf,
  Loader2,
  Share2,
  Trash2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { DiagnosisResult } from "../backend";

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

function DiagnosisCard({
  result,
  index,
}: { result: DiagnosisResult; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-ocid={`history.item.${index + 1}`}
    >
      <button
        type="button"
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
        data-ocid={`history.toggle.${index + 1}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground">
              {result.plantName}
            </span>
            <HealthBadge status={result.healthStatus} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(result.timestamp)}
          </p>
          {result.conditions.length > 0 && (
            <p className="text-xs text-muted-foreground truncate">
              {result.conditions.join(", ")}
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
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
            <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
              {result.conditions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Conditions
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.conditions.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="rounded-full text-xs"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.fertilizerRecommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-500" /> Fertilizer
                  </h4>
                  <ul className="space-y-1">
                    {result.fertilizerRecommendations.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.pesticideRecommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-orange-500" /> Pesticide
                  </h4>
                  <ul className="space-y-1">
                    {result.pesticideRecommendations.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.careTips.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-primary" /> Care Tips
                  </h4>
                  <ul className="space-y-1">
                    {result.careTips.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full"
                  onClick={() => shareOrCopy(result)}
                  data-ocid={`history.secondary_button.${index + 1}`}
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Diagnosis
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HistoryContent() {
  const { principal } = useAuthClient();
  const { data: history, isLoading } = useGetDiagnosisHistory(principal);
  const clearMutation = useClearDiagnosisHistory();

  const handleClear = async () => {
    if (!principal) return;
    await clearMutation.mutateAsync(principal);
  };

  return (
    <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-1">
            Diagnosis History
          </h1>
          <p className="text-muted-foreground">All your past plant diagnoses</p>
        </div>

        {history && history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 flex-shrink-0"
                data-ocid="history.open_modal_button"
              >
                <Trash2 className="w-4 h-4" /> Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="history.dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your past diagnoses. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="history.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClear}
                  className="bg-destructive hover:bg-destructive/90"
                  data-ocid="history.confirm_button"
                >
                  {clearMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="history.loading_state"
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your history...
          </p>
        </div>
      ) : !history || history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-12 text-center"
          data-ocid="history.empty_state"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            No diagnoses yet
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Start by diagnosing a plant to see your history here.
          </p>
          <Link to="/diagnose">
            <Button
              className="rounded-full gap-2"
              data-ocid="history.primary_button"
            >
              <Camera className="w-4 h-4" /> Diagnose a Plant
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {history.map((item, i) => (
            <DiagnosisCard
              key={Number(item.timestamp)}
              result={item}
              index={i}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function HistoryPage() {
  return (
    <div className="flex-1 bg-mint">
      <AuthGate
        title="Log In to View History"
        description="Your diagnosis history is private. Log in to see all your past plant diagnoses."
      >
        <HistoryContent />
      </AuthGate>
    </div>
  );
}
