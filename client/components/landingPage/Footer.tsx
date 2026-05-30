import Link from "next/link"
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react"

function Footer() {
    const links = {
        Product: [
            { name: "Features", href: "#features" },
        ],
        Social: [
            { name: "GitHub", href: "https://github.com/akrathor18/chatSpark/" },
            { name: "LinkedIn", href: "https://linkedin.com/in/ashishkumartech" },
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
                            Built for speed and simplicity, ChatSpark helps you communicate in real time without unnecessary complexity. Whether you&apos;re discussing ideas, sharing updates, or exchanging code, everything happens instantly.


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

                <div className="mt-12 flex flex-col items-center border-t border-border pt-8 pb-4">
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <p className="text-sm text-muted-foreground">
                            Built with <span className="text-red-500">❤️</span> by <a href="https://github.com/akrathor18" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Ashish Kumar</a>.
                        </p>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <a href="https://github.com/akrathor18" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="https://twitter.com/iam_ashish_dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="https://linkedin.com/in/ashishkumartech" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="mailto:ashishk.codes@gmail.com" className="hover:text-foreground transition-colors">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
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
            </div>
        </footer>
    )
}

export default Footer