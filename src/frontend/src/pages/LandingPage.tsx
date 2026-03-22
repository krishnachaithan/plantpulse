import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bug,
  Camera,
  ChevronRight,
  ClipboardList,
  Droplets,
  Facebook,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Capture Photo",
    description:
      "Take a clear photo of your plant using your phone camera or upload an existing image from your gallery.",
  },
  {
    icon: Microscope,
    step: "02",
    title: "AI Analysis",
    description:
      "Our advanced AI analyzes visual patterns, color variations, and leaf morphology to detect health issues.",
  },
  {
    icon: ClipboardList,
    step: "03",
    title: "Get Recommendations",
    description:
      "Receive tailored fertilizer, pesticide, and care recommendations to restore your plant to full health.",
  },
];

const features = [
  {
    icon: Droplets,
    color: "bg-blue-50 text-blue-600",
    title: "Smart Fertilizer Recommendations",
    description:
      "Get precise fertilizer prescriptions based on detected nutrient deficiencies in your plant's leaves and growth patterns.",
  },
  {
    icon: Bug,
    color: "bg-orange-50 text-orange-600",
    title: "Targeted Pesticide Guidance",
    description:
      "Identify specific pests and diseases instantly, with safe and effective pesticide recommendations tailored to your plant.",
  },
  {
    icon: Activity,
    color: "bg-red-50 text-red-600",
    title: "Disease Detection",
    description:
      "Detect over 50 plant diseases including fungal infections, bacterial blights, and viral conditions early on.",
  },
  {
    icon: Heart,
    color: "bg-primary/10 text-primary",
    title: "Personalized Care Tips",
    description:
      "Receive actionable care instructions including watering schedules, sunlight requirements, and seasonal advice.",
  },
];

const stats = [
  { value: "10,000+", label: "Plants Diagnosed" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "50+", label: "Conditions Detected" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-mint py-20 md:py-28 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  🌿 AI-Powered Plant Health
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                  Diagnose Your Plant's{" "}
                  <span className="text-primary">Health Instantly</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  Upload a photo of your plant and get expert AI-powered
                  diagnosis — fertilizer prescriptions, pesticide guidance, and
                  personalized care tips in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/diagnose">
                    <Button
                      size="lg"
                      className="rounded-full px-8 gap-2"
                      data-ocid="hero.primary_button"
                    >
                      Diagnose Now <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8"
                      data-ocid="hero.secondary_button"
                    >
                      Learn More
                    </Button>
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex-1 flex justify-center relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-full max-w-md">
                  <img
                    src="/assets/generated/hero-person-plant.dim_400x500.png"
                    alt="Person diagnosing plant health with smartphone"
                    className="w-full rounded-2xl shadow-card"
                  />
                  <div className="absolute -bottom-4 -left-4 hidden md:block">
                    <img
                      src="/assets/generated/hero-plants-left.dim_600x500.png"
                      alt=""
                      className="w-40 rounded-xl opacity-80"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-card p-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        95% Accuracy
                      </p>
                      <p className="text-xs text-muted-foreground">
                        AI Diagnosis
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps to diagnose and treat your plant in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="text-center p-8 rounded-2xl border border-border hover:shadow-card transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl font-extrabold text-border mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-mint">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Comprehensive Plant Care
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to keep your plants healthy and thriving.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 shadow-card flex items-start gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}
                  >
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Impact
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Trusted by plant enthusiasts and farmers worldwide.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0 border border-border rounded-2xl overflow-hidden">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`flex-1 text-center py-12 px-8 ${
                    i < stats.length - 1
                      ? "border-b md:border-b-0 md:border-r border-border"
                      : ""
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div className="text-5xl font-extrabold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/diagnose">
                <Button
                  size="lg"
                  className="rounded-full px-10"
                  data-ocid="impact.primary_button"
                >
                  Start Diagnosing Free{" "}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-footer-green text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">PlantPulse</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                AI-powered plant health diagnostics for home gardeners and
                professional farmers alike.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#impact"
                    className="hover:text-white transition-colors"
                  >
                    Impact
                  </a>
                </li>
                <li>
                  <Link
                    to="/history"
                    className="hover:text-white transition-colors"
                  >
                    Diagnosis History
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@plantpulse.ai</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 234-5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Social Media</h4>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/50 text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-white/80 transition-colors underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
