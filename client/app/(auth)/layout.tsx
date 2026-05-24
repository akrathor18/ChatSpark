"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { getCookie } from 'cookies-next';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('token')
    if (token) {
      router.push("/chat")
    }
  }, [router])

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 md:px-8">
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                        <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-foreground">ChatSpark</span>
                </Link>
            </header>

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="px-6 py-4 text-center text-xs text-muted-foreground md:px-8">
                <p>By continuing, you agree to ChatSpark&apos;s <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link></p>
            </footer>
        </div>
    )
}
