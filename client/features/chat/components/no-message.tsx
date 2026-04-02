import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, Sparkles } from 'lucide-react'
function NoMessage({ user, onSendMessage }: { user: any, onSendMessage: (message: string) => void }) {
    return (
        <div className="flex min-h-full flex-col items-center justify-center py-12 text-center">

            {/* Glow backdrop */}
            <div className="relative mb-6">
                <div className="absolute inset-0 -z-10 mx-auto h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

                {/* Outer ping ring */}
                <span
                    className="absolute inset-0 animate-ping rounded-full bg-primary/10"
                    style={{ animationDuration: "2.8s" }}
                />

                {/* Avatar */}
                <Avatar className="relative h-24 w-24 shadow-2xl shadow-primary/20 ring-2 ring-primary/30">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-secondary text-2xl font-bold text-foreground">
                        {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Online badge */}
                {user.isOnline ? (
                    <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-[var(--online)] shadow-sm">
                        <span className="h-2 w-2 animate-ping rounded-full bg-[var(--online)] opacity-75" />
                    </span>
                ) : (
                    <span className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full border-2 border-background bg-muted shadow-sm" />
                )}
            </div>

            {/* Name + status */}
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{user.name}</h3>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                {user.isOnline ? (
                    <>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--online)]" />
                        Active now
                    </>
                ) : (
                    user.lastSeen ?? "Offline"
                )}
            </p>

            {/* Divider */}
            <div className="my-7 flex w-full max-w-sm items-center gap-4 px-4">
                <span className="h-px flex-1 bg-border/50" />
                <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-3 py-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        Start of conversation
                    </span>
                </div>
                <span className="h-px flex-1 bg-border/50" />
            </div>

            {/* Description */}
            <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
                You and{" "}
                <span className="font-semibold text-foreground">{user.name}</span>{" "}
                haven&apos;t talked yet. Break the ice — every great conversation starts with one message.
            </p>

            {/* Starter prompt chips */}
            <div className="mt-7 flex flex-col items-center gap-3">
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    Quick starters
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        { label: "Say Hello", message: `Hey ${user.name}! 👋` },
                        { label: "Share an update", message: "Hey, just wanted to share a quick update..." },
                        { label: "Let's collaborate", message: "Hey! I'd love to collaborate on something with you." },
                        { label: "Ask a question", message: "Hi! Quick question for you..." },
                    ].map(({ label, message }) => (
                        <button
                            key={label}
                            onClick={() => onSendMessage(message)}
                            className="group flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/40 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-secondary/80 hover:text-foreground hover:shadow-primary/10 active:scale-[0.97]"
                        >
                            <Zap className="h-3 w-3 text-primary/60 transition-colors duration-200 group-hover:text-primary" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Encryption note */}
            <div className="mt-8 flex items-center gap-2 rounded-xl bg-secondary/30 px-4 py-2.5 ring-1 ring-border/40">
                <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span className="text-[11px] text-muted-foreground/60">
                    Messages are end-to-end encrypted
                </span>
            </div>
        </div>
    )
}

export default NoMessage
