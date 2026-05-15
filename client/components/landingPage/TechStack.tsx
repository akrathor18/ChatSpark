"use client";

import {
    Globe,
    Layers,
} from "lucide-react";
import { RiTailwindCssFill, RiNextjsFill } from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import { IoLogoNodejs } from "react-icons/io5";
import { SiExpress, SiSocketdotio, SiMongodb } from "react-icons/si";
type Tech = {
    name: string;
    icon: React.ReactNode;
};

type Category = {
    label: string;
    techs: Tech[];
};

const categories: Category[] = [
    {
        label: "Frontend",
        techs: [
            {
                name: "Next.js",
                icon: (
                    <RiNextjsFill className="w-7 h-7" />
                ),
            },
            {
                name: "TypeScript",
                icon: (
                    <BiLogoTypescript className="w-7 h-7  text-blue-600" />
                ),
            },
            {
                name: "TailwindCSS",
                icon: <RiTailwindCssFill className="w-7 h-7 text-sky-400" />,
            },
        ],
    },
    {
        label: "Backend",
        techs: [
            {
                name: "Node.js",
                icon: <IoLogoNodejs className="w-7 h-7 text-green-400" />,
            },
            {
                name: "Express.js",
                icon: (
                    <SiExpress className="w-7 h-7 bg-black rounded-4xl p-1 text-white    " />
                ),
            },
            {
                name: "Socket.io",
                icon: <SiSocketdotio className="w-7 h-7 text-slate-200" />,
            },
        ],
    },
    {
        label: "Database",
        techs: [
            {
                name: "MongoDB",
                icon: <SiMongodb className="w-7 h-7 text-green-500" />,
            },
        ],
    },
];

export default function TechStack() {
    return (
        <section className="relative w-full bg-[#0b1120] py-20 px-4 overflow-hidden font-sans">
            {/* Subtle grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(#a0c4ff 1px, transparent 1px), linear-gradient(90deg, #a0c4ff 1px, transparent 1px)",
                    backgroundSize: "45px 45px",
                }}
            />

            {/* Glow blobs */}
            <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-700/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-10">
                {/* Pill badge */}
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-slate-600/60 bg-slate-800/60 text-slate-300 text-xs tracking-wide backdrop-blur-sm">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Built with modern technologies
                </span>

                {/* Heading */}
                <h2 className="text-center text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
                    Built on a modern,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        developer-friendly
                    </span>{" "}
                    stack
                </h2>

                {/* Cards row */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    {categories.map((cat) => (
                        <div
                            key={cat.label}
                            className="group relative flex-1 min-w-[220px] max-w-sm rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm px-6 py-5 transition-all duration-300 hover:border-slate-500/70 hover:bg-slate-800/60 hover:shadow-[0_0_32px_0_rgba(99,179,237,0.07)]"
                        >
                            {/* Category label */}
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400/80">
                                {cat.label}
                            </p>

                            {/* Tech items */}
                            <div className="flex flex-wrap items-center gap-5">
                                {cat.techs.map((tech) => (
                                    <div
                                        key={tech.name}
                                        className="flex items-center gap-2 group/item"
                                    >
                                        <span className="transition-transform duration-200 group-hover/item:scale-110">
                                            {tech.icon}
                                        </span>
                                        <span className="text-sm font-medium text-slate-300 whitespace-nowrap">
                                            {tech.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Subtle corner accent */}
                            <span className="pointer-events-none absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-400/70 transition-colors duration-300" />
                        </div>
                    ))}
                </div>

                {/* Bottom globe decoration */}
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Full-stack · Real-time · Production-ready</span>
                </div>
            </div>
        </section>
    );
}