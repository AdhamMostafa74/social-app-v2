"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sparkles,
    FileText,
    Bookmark,
    Menu,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import SuggestionMenu from "../SuggestionMenu/SuggestionMenu";


export default function NavMenu() {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [friendsOpen, setFriendsOpen] = useState(false);

    const links = [
        {
            href: "/home/foryou",
            label: "For You",
            icon: Sparkles,
        },
        {
            href: "/home/postfeed",
            label: "My Posts",
            icon: FileText,
        },
        {
            href: "/home/bookmarks",
            label: "Bookmarks",
            icon: Bookmark,
        },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-xs mt-6 rounded-2xl border p-4 shadow-sm h-fit sticky top-30 bg-white">
                <nav className="flex flex-col gap-2">
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}

                    {/* Suggested Friends Toggle */}
                    <button
                        onClick={() => setFriendsOpen(!friendsOpen)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                        <span>Suggested Friends</span>

                        {friendsOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {friendsOpen && (
                        <div className="mt-2 rounded-xl border p-3 bg-slate-50">
                            <SuggestionMenu />
                        </div>
                    )}
                </nav>
            </aside>

            {/* Mobile Floating Button */}
            <div className="lg:hidden fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setOpen(!open)}
                    className="rounded-full bg-blue-600 p-4 text-white shadow-lg"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                {open && (
                    <div className="absolute bottom-16 left-0 w-xs rounded-2xl border bg-white p-3 shadow-xl">
                        <nav className="flex flex-col gap-2">
                            {links.map(({ href, label, icon: Icon }) => {
                                const active = pathname === href;

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}

                            <button
                                onClick={() => setFriendsOpen(!friendsOpen)}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-50"
                            >
                                <span>Suggested Friends</span>

                                {friendsOpen ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>

                            {friendsOpen && (
                                <div className="rounded-xl border p-2 bg-slate-50">
                                    <SuggestionMenu compact />
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
}