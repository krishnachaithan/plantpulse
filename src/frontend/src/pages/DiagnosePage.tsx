import { useCamera } from "@/camera/useCamera";
import AuthGate from "@/components/AuthGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalyzePlantImage } from "@/hooks/useQueries";
import { shareOrCopy } from "@/lib/share";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bug,
  Camera,
  CheckCircle,
  Droplets,
  FlipHorizontal,
  Heart,
  History,
  Leaf,
  Loader2,
  RotateCcw,
  Share2,
  Upload,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { DiagnosisResult } from "../backend";

type View = "capture" | "preview" | "loading" | "results";

function HealthBadge({ status }: { status: DiagnosisResult["healthStatus"] }) {
  const config = {
    healthy: {
      label: "Healthy",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    mild: {
      label: "Mild Issue",
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${c.className}`}
    >
      <Icon className="w-4 h-4" />
      {c.label}
    </span>
  );
}

function RecommendationList({
  items,
  icon: Icon,
  color,
}: { items: string[]; icon: React.ElementType; color: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <div
            className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
          >
            <Icon className="w-3 h-3" />
          </div>
          <span className="text-sm text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DiagnoseContent() {
  const [view, setView] = useState<View>("capture");
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [capturedBytes, setCapturedBytes] =
    useState<Uint8Array<ArrayBuffer> | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const analyzeMutation = useAnalyzePlantImage();
  const navigate = useNavigate();

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    quality: 0.9,
    format: "image/jpeg",
  });

  const handleCapture = useCallback(async () => {
    const file = await capturePhoto();
    if (!file) return;
    const arrayBuf = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuf) as Uint8Array<ArrayBuffer>;
    const url = URL.createObjectURL(file);
    setCapturedBytes(bytes);
    setCapturedImageUrl(url);
    stopCamera();
    setView("preview");
  }, [capturePhoto, stopCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuf = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf) as Uint8Array<ArrayBuffer>;
        const url = URL.createObjectURL(file);
        setCapturedBytes(bytes);
        setCapturedImageUrl(url);
        setView("preview");
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleAnalyze = useCallback(async () => {
    if (!capturedBytes) return;
    setAnalyzeError(null);
    setView("loading");
    try {
      const res = await analyzeMutation.mutateAsync({
        imageBytes: capturedBytes,
      });
      setResult(res);
      setView("results");
    } catch {
      setAnalyzeError(
        "Analysis failed. Please check your connection and try again.",
      );
      setView("preview");
    }
  }, [capturedBytes, analyzeMutation]);

  const handleReset = useCallback(() => {
    setCapturedImageUrl(null);
    setCapturedBytes(null);
    setResult(null);
    setAnalyzeError(null);
    setView("capture");
  }, []);

  const handleShare = useCallback(() => {
    if (!result) return;
    shareOrCopy(result, capturedImageUrl ?? undefined);
  }, [result, capturedImageUrl]);

  return (
    <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
      <AnimatePresence mode="wait">
        {/* Capture view */}
        {view === "capture" && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">
                Diagnose Your Plant
              </h1>
              <p className="text-muted-foreground">
                Use camera or upload a photo to get started
              </p>
            </div>

            {/* Camera area */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
              {isSupported === false ? (
                <div
                  className="h-72 flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  data-ocid="diagnose.error_state"
                >
                  <Camera className="w-12 h-12 opacity-30" />
                  <p className="text-sm">
                    Camera not supported in this browser
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      style={{ display: isActive ? "block" : "none" }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {!isActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <Camera className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Camera is off
                        </p>
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-8 border-2 border-white/60 rounded-xl" />
                        <div className="absolute top-8 left-8 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-sm" />
                        <div className="absolute top-8 right-8 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-sm" />
                        <div className="absolute bottom-8 left-8 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-sm" />
                        <div className="absolute bottom-8 right-8 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-sm" />
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div
                      className="p-4 bg-destructive/10 text-destructive text-sm flex items-center gap-2"
                      data-ocid="diagnose.error_state"
                    >
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      {cameraError.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!isActive ? (
                <Button
                  onClick={startCamera}
                  disabled={cameraLoading || isSupported === false}
                  className="rounded-full gap-2"
                  data-ocid="diagnose.primary_button"
                >
                  {cameraLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  {cameraLoading ? "Starting..." : "Start Camera"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCapture}
                    disabled={!isActive || cameraLoading}
                    className="rounded-full gap-2"
                    data-ocid="diagnose.primary_button"
                  >
                    <Camera className="w-4 h-4" /> Capture Photo
                  </Button>
                  <Button
                    onClick={() => switchCamera()}
                    variant="outline"
                    disabled={cameraLoading}
                    className="rounded-full gap-2"
                    data-ocid="diagnose.secondary_button"
                  >
                    <FlipHorizontal className="w-4 h-4" /> Switch
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="rounded-full"
                    data-ocid="diagnose.secondary_button"
                  >
                    Stop
                  </Button>
                </>
              )}

              {/* Native camera input for mobile */}
              <input
                ref={nativeCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                className="rounded-full gap-2"
                onClick={() => nativeCameraInputRef.current?.click()}
                data-ocid="diagnose.secondary_button"
              >
                <Camera className="w-4 h-4" /> Take Photo
              </Button>

              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  data-ocid="diagnose.upload_button"
                />
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="diagnose.upload_button"
                >
                  <Upload className="w-4 h-4" /> Upload Image
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview view */}
        {view === "preview" && capturedImageUrl && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">
                Review Your Photo
              </h1>
              <p className="text-muted-foreground">
                Does this photo clearly show the plant issue?
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
              <img
                src={capturedImageUrl}
                alt="Captured plant"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="rounded-full px-8 gap-2"
                data-ocid="diagnose.submit_button"
              >
                <Leaf className="w-4 h-4" /> Analyze Plant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2"
                onClick={handleReset}
                data-ocid="diagnose.secondary_button"
              >
                <RotateCcw className="w-4 h-4" /> Retake
              </Button>
            </div>

            {analyzeError && (
              <div
                className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-xl flex items-center gap-2"
                data-ocid="diagnose.error_state"
              >
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {analyzeError}
              </div>
            )}
          </motion.div>
        )}

        {/* Loading view */}
        {view === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
            data-ocid="diagnose.loading_state"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Analyzing your plant...
              </h2>
              <p className="text-muted-foreground text-sm">
                Our AI is examining the image for conditions and deficiencies
              </p>
            </div>
            <div className="flex gap-2">
              {([0, 0.2, 0.4] as const).map((delay) => (
                <motion.div
                  key={delay}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Results view */}
        {view === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">
                Diagnosis Results
              </h1>
              <p className="text-muted-foreground">
                Here&#39;s what we found about your plant
              </p>
            </div>

            {/* Plant header card */}
            <div className="bg-white rounded-2xl shadow-card p-6 mb-4 flex items-center gap-4">
              {capturedImageUrl && (
                <img
                  src={capturedImageUrl}
                  alt="Plant"
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {result.plantName}
                </h2>
                <div className="mt-2">
                  <HealthBadge status={result.healthStatus} />
                </div>
              </div>
            </div>

            {/* Conditions */}
            {result.conditions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />{" "}
                  Identified Conditions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.conditions.map((c) => (
                    <Badge key={c} variant="secondary" className="rounded-full">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Fertilizer */}
            {result.fertilizerRecommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" /> Fertilizer
                  Recommendations
                </h3>
                <RecommendationList
                  items={result.fertilizerRecommendations}
                  icon={Droplets}
                  color="bg-blue-50 text-blue-600"
                />
              </div>
            )}

            {/* Pesticide */}
            {result.pesticideRecommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-orange-500" /> Pesticide
                  Recommendations
                </h3>
                <RecommendationList
                  items={result.pesticideRecommendations}
                  icon={Bug}
                  color="bg-orange-50 text-orange-600"
                />
              </div>
            )}

            {/* Care tips */}
            {result.careTips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" /> Care Tips
                </h3>
                <RecommendationList
                  items={result.careTips}
                  icon={Heart}
                  color="bg-primary/10 text-primary"
                />
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={handleReset}
                size="lg"
                className="rounded-full px-8 gap-2"
                data-ocid="diagnose.primary_button"
              >
                <Camera className="w-4 h-4" /> Diagnose Another Plant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2"
                onClick={() => navigate({ to: "/history" })}
                data-ocid="diagnose.secondary_button"
              >
                <History className="w-4 h-4" /> View History
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2"
                onClick={handleShare}
                data-ocid="diagnose.secondary_button"
              >
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function DiagnosePage() {
  return (
    <div className="flex-1 bg-mint">
      <AuthGate
        title="Log In to Diagnose"
        description="Sign in to diagnose your plants and keep a private history of all your diagnoses."
      >
        <DiagnoseContent />
      </AuthGate>
    </div>
  );
}
