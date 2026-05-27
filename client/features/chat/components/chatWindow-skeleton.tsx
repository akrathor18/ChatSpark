export default function ChatWindowSkeleton() {
    return (
        <div className="flex h-screen bg-[#0b0f14] text-white overflow-hidden">

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