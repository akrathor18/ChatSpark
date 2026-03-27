"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from "lucide-react"
import OAuthButtons from "@/components/auth/oauth-buttons"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
export default function SignUpPage() {
  const router = useRouter()
  const { register, error, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password strength checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  }
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    } else if (passwordStrength < 3) {
      newErrors.password = "Please create a stronger password"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const success = await register(formData.name, formData.email, formData.password)
    if (success) {
      router.push("/onboarding")
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with ChatSpark for free
          </p>
        </div>

        {/* Social Login */}
        <OAuthButtons />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            {/* Password strength indicator */}
            {formData.password && (
              <div className="space-y-3 pt-2">
                {/* Strength bar */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwordStrength >= level
                          ? passwordStrength <= 2
                            ? "bg-destructive"
                            : passwordStrength === 3
                              ? "bg-yellow-500"
                              : "bg-online"
                          : "bg-secondary"
                      )}
                    />
                  ))}
                </div>

                {/* Password requirements */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    { check: passwordChecks.length, label: "8+ characters" },
                    { check: passwordChecks.uppercase, label: "Uppercase" },
                    { check: passwordChecks.lowercase, label: "Lowercase" },
                    { check: passwordChecks.number, label: "Number" },
                  ].map(({ check, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs">
                      {check ? (
                        <Check className="h-3 w-3 text-online" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={check ? "text-foreground" : "text-muted-foreground"}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
