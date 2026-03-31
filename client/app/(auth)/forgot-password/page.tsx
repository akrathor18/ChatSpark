"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Mail,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { forgotPassword } from "@/services/auth.service"

const schema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
})

type FormValues = z.infer<typeof schema>

// Page state for handling the UI transition
type PageState = "idle" | "loading" | "success" | "error"

export default function ForgotPasswordPage() {
    const [pageState, setPageState] = useState<PageState>("idle")
    const [submittedEmail, setSubmittedEmail] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, dirtyFields },
        getValues,
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    const onSubmit = async (data: FormValues) => {
        setPageState("loading")
        try {
            await forgotPassword(data.email)
            setSubmittedEmail(data.email)
            setPageState("success")
        } catch (error) {
            console.error("Forgot password error:", error)
            setPageState("error")
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0) return
        setResendCooldown(60)
        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        // Call API again
        try {
            const currentEmail = getValues("email")
            await forgotPassword(currentEmail)
        } catch (error) {
            console.error("Resend error:", error)
        }
    }

    const handleTryAgain = () => {
        setPageState("idle")
        reset()
    }

    // ── Success state ─────────────────────────────────────────────────────────
    if (pageState === "success") {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 md:p-8">
                    {/* Animated checkmark */}
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
                                Check your inbox
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                We sent a password reset link to{" "}
                                <span className="font-medium text-foreground">{submittedEmail}</span>.
                                It expires in 15 minutes.
                            </p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="mb-6 space-y-3 rounded-xl border border-border/60 bg-secondary/30 p-4">
                        {[
                            { step: "1", text: "Open the email from ChatSpark" },
                            { step: "2", text: "Click \"Reset your password\"" },
                            { step: "3", text: "Create a new secure password" },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-center gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                                    {step}
                                </span>
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Resend */}
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="outline"
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            className="h-11 w-full rounded-xl border-border bg-secondary/50 text-foreground transition-all duration-200 hover:bg-secondary disabled:opacity-50"
                        >
                            <RefreshCw className={cn("mr-2 h-4 w-4", resendCooldown > 0 && "animate-spin")} />
                            {resendCooldown > 0
                                ? `Resend in ${resendCooldown}s`
                                : "Resend reset link"}
                        </Button>
                        <Link
                            href="/sign-in"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>

                {/* Spam notice */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Didn&apos;t receive it? Check your spam folder or{" "}
                    <button
                        onClick={handleTryAgain}
                        className="text-primary transition-colors hover:text-primary/80"
                    >
                        try a different email
                    </button>
                    .
                </p>
            </div>
        )
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (pageState === "error") {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-xl shadow-black/5 md:p-8">
                    <div className="mb-6 flex flex-col items-center gap-4 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
                            <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Something went wrong
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                We couldn&apos;t send the reset link right now. This is usually temporary.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleTryAgain}
                            className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90"
                        >
                            Try again
                        </Button>
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

    // ── Idle / Loading state ───────────────────────────────────────────────────
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
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">
                                Forgot your password?
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                No worries — we&apos;ll send you a reset link.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email address
                        </Label>
                        <div className="relative">
                            <Mail
                                className={cn(
                                    "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                                    errors.email
                                        ? "text-destructive"
                                        : dirtyFields.email && !errors.email
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                )}
                            />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                autoFocus
                                {...register("email")}
                                className={cn(
                                    "h-11 rounded-xl border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground transition-all duration-200",
                                    "focus-visible:ring-primary focus-visible:border-primary",
                                    errors.email && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
                                    dirtyFields.email && !errors.email && "border-primary/50"
                                )}
                            />
                        </div>

                        {/* Inline error */}
                        <div className={cn(
                            "flex items-center gap-1.5 overflow-hidden transition-all duration-200",
                            errors.email ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                        )}>
                            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                            <p className="text-xs text-destructive">{errors.email?.message}</p>
                        </div>
                    </div>

                    {/* Helper text */}
                    <p className="rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                        Enter the email you used to create your ChatSpark account. We&apos;ll send a secure
                        link that expires in 15 minutes.
                    </p>

                    <Button
                        type="submit"
                        disabled={pageState === "loading" || !isValid}
                        className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-60"
                    >
                        {pageState === "loading" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send reset link
                            </>
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Remembered your password?{" "}
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
