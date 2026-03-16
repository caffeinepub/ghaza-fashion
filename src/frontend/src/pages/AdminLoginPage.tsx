import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ADMIN_PASSWORD = "mshd1981!";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("ghaza_admin_auth", "true");
      navigate({ to: "/admin/dashboard" });
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-bold text-foreground">
            GHAZA
          </div>
          <div className="font-display text-xs italic text-muted-foreground tracking-widest mb-1">
            Fashion
          </div>
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body text-xs uppercase tracking-wider">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="rounded-none pr-10"
                autoComplete="current-password"
                data-ocid="admin.input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p
                className="text-xs text-destructive mt-1"
                data-ocid="admin.error_state"
              >
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!password}
            className="w-full rounded-none bg-foreground text-primary-foreground hover:bg-accent font-body text-xs uppercase tracking-widest py-3 h-auto"
            data-ocid="admin.submit_button"
          >
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
