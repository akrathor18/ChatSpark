export default function ChatSkeleton() {
    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">

            {/* Sidebar */}
            <div className="
                w-full
                md:w-[320px]
                border-r border-white/10
                p-4
                flex flex-col gap-4
            ">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse" />
                </div>

                {/* Search */}
                <div className="h-10 w-full bg-white/10 rounded-md animate-pulse" />

                {/* Messages list */}
                <div className="flex flex-col gap-4 mt-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                                <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile */}
                <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="hidden md:flex flex-1 flex-col justify-between p-6">

                {/* Messages */}
                <div className="space-y-6">

                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full skeleton" />
                        <div className="h-10 w-40 skeleton" />
                    </div>

                    <div className="flex justify-end">
                        <div className="h-12 w-52 skeleton rounded-xl" />
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full skeleton" />
                        <div className="space-y-2">
                            <div className="h-3 w-64 skeleton" />
                            <div className="h-3 w-48 skeleton" />
                            <div className="h-3 w-56 skeleton" />
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full skeleton" />
                    <div className="flex-1 h-10 skeleton rounded-full" />
                </div>
            </div>
        </div>
    );
}