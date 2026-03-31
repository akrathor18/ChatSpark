"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Lock,
    ShieldCheck,
    XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { resetPassword } from "@/services/auth.service"

const schema = z
    .object({
        password: z
            .string()
            .min(8, "Must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type FormValues = z.infer<typeof schema>
type PageState = "validating" | "idle" | "loading" | "success" | "expired" | "error"

// Password strength rules
const strengthRules = [
    { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
    { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
    { label: "One number", test: (v: string) => /[0-9]/.test(v) },
    { label: "One special character", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

function getStrength(password: string) {
    const passed = strengthRules.filter((r) => r.test(password)).length
    if (passed === 0) return { score: 0, label: "", color: "" }
    if (passed === 1) return { score: 1, label: "Weak", color: "bg-destructive" }
    if (passed === 2) return { score: 2, label: "Fair", color: "bg-orange-500" }
    if (passed === 3) return { score: 3, label: "Good", color: "bg-yellow-500" }
    return { score: 4, label: "Strong", color: "bg-primary" }
}

// No pre-validation endpoint, so we initialize state to idle

export default function ResetPasswordPage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = use(params)
    const router = useRouter()

    const decodedToken = decodeURIComponent(token)
    const [pageState, setPageState] = useState<PageState>("idle")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [watchedPassword, setWatchedPassword] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    const passwordValue = watch("password", "")
    const strength = getStrength(passwordValue)

    const onSubmit = async (data: FormValues) => {
        setPageState("loading")
        try {
            await resetPassword(decodedToken, data.password)
            setPageState("success")
        } catch (error: any) {
            console.error("Reset password error:", error)
            const errorMessage = typeof error === 'string' ? error.toLowerCase() : ""
            if (errorMessage.includes("token") || errorMessage.includes("expired") || errorMessage.includes("invalid")) {
                setPageState("expired")
            } else {
                setPageState("error")
            }
        }
    }

    // ── Expired / Invalid token ───────────────────────────────────────────────
    if (pageState === "expired") {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-xl shadow-black/5 md:p-8">
                    <div className="mb-6 flex flex-col items-center gap-4 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
                            <XCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Link expired
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                This password reset link is invalid or has expired. Reset links are only
                                valid for 15 minutes.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/forgot-password">
                            <Button className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90">
                                Request a new link
                            </Button>
                        </Link>
                        <Link
                            href="/sign-in"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // ── Success state ─────────────────────────────────────────────────────────
    if (pageState === "success") {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
                    <div className="mb-6 flex flex-col items-center gap-4 text-center">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Password updated
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Your password has been reset successfully. You can now sign in with your
                                new password.
                            </p>
                        </div>
                    </div>

                    {/* Security note */}
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            All other active sessions have been signed out for your security.
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push("/sign-in")}
                        className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
                    >
                        Sign in to ChatSpark
                    </Button>
                </div>
            </div>
        )
    }

    
    return (
        <div className="w-full max-w-md">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/sign-in"
                        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to sign in
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                            <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                Reset your password
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Choose a new, strong password for your account.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* New password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            New password
                        </Label>
                        <div className="relative">
                            <Lock
                                className={cn(
                                    "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                                    errors.password ? "text-destructive" : "text-muted-foreground"
                                )}
                            />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                autoFocus
                                {...register("password")}
                                className={cn(
                                    "h-11 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                    "focus-visible:ring-primary focus-visible:border-primary",
                                    errors.password && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Strength meter — only shown when typing */}
                        {passwordValue.length > 0 && (
                            <div className="space-y-2">
                                {/* Bar */}
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-1 gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                                                    i <= strength.score ? strength.color : "bg-secondary"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {strength.label && (
                                        <span
                                            className={cn(
                                                "text-xs font-medium transition-colors",
                                                strength.score === 1 && "text-destructive",
                                                strength.score === 2 && "text-orange-500",
                                                strength.score === 3 && "text-yellow-500",
                                                strength.score === 4 && "text-primary"
                                            )}
                                        >
                                            {strength.label}
                                        </span>
                                    )}
                                </div>

                                {/* Rule checklist */}
                                <ul className="space-y-1.5">
                                    {strengthRules.map((rule) => {
                                        const passed = rule.test(passwordValue)
                                        return (
                                            <li
                                                key={rule.label}
                                                className={cn(
                                                    "flex items-center gap-2 text-xs transition-colors",
                                                    passed ? "text-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                {passed ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                                ) : (
                                                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
                                                )}
                                                {rule.label}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}

                        {errors.password && passwordValue.length === 0 && (
                            <div className="flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                            Confirm new password
                        </Label>
                        <div className="relative">
                            <Lock
                                className={cn(
                                    "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                                    errors.confirmPassword ? "text-destructive" : "text-muted-foreground"
                                )}
                            />
                            <Input
                                id="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                autoComplete="new-password"
                                {...register("confirmPassword")}
                                className={cn(
                                    "h-11 rounded-xl border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                    "focus-visible:ring-primary focus-visible:border-primary",
                                    errors.confirmPassword && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((p) => !p)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={showConfirm ? "Hide password" : "Show password"}
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 overflow-hidden transition-all duration-200",
                            errors.confirmPassword ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                            <p className="text-xs text-destructive">{errors.confirmPassword?.message}</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={pageState === "loading" || !isValid}
                        className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-60"
                    >
                        {pageState === "loading" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating password...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Reset password
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Token info */}
            <p className="mt-4 text-center text-xs text-muted-foreground">
                This link expires 15 minutes after it was sent.{" "}
                <Link href="/forgot-password" className="text-primary transition-colors hover:text-primary/80">
                    Request a new one
                </Link>
            </p>
        </div>
    )
}
