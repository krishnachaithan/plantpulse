import AuthGate from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { Loader2, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function ProfileForm() {
  const { actor, isFetching } = useActor();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getCallerUserProfile()
      .then((profile) => {
        if (profile) setName(profile.name);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [actor, isFetching]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setIsSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: name.trim() });
      toast.success("Profile saved!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12"
    >
      <Card className="w-full max-w-md shadow-lg" data-ocid="profile.card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>
            Set your display name to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex justify-center py-8"
              data-ocid="profile.loading_state"
            >
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Krishna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  data-ocid="profile.input"
                />
                <p className="text-xs text-muted-foreground">
                  This name will appear in the navigation bar.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 rounded-full"
                disabled={isSaving || !name.trim()}
                data-ocid="profile.submit_button"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving…" : "Save Profile"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProfilePage() {
  return (
    <main className="flex-1">
      <AuthGate
        title="Login to Set Your Profile"
        description="You need to be logged in to set and save your display name."
      >
        <ProfileForm />
      </AuthGate>
    </main>
  );
}
