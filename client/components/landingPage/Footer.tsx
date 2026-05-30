import Link from "next/link"
import { Sparkles } from "lucide-react"

function Footer() {
    const links = {
        Product: [
            { name: "Features", href: "#features" },
        ],
        Social: [
            { name: "GitHub", href: "https://github.com/akrathor18/chatSpark/" },
            { name: "LinkedIn", href: "https://linkedin.com/ashishkumartech" },
        ],
        Legal: [
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
        ],
    }

    return (
        <footer className="border-t border-border bg-card/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
                                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
                            </div>

                            <span className="text-lg font-semibold tracking-tight text-foreground">
                                ChatSpark
                            </span>
                        </Link>

                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Built for speed and simplicity, ChatSpark helps you communicate in real time without unnecessary complexity. Whether you're discussing ideas, sharing updates, or exchanging code, everything happens instantly.


                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-foreground">
                                {category}
                            </h3>

                            <ul className="mt-4 space-y-3">
                                {items.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ChatSpark. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer