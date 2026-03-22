"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Home,
    User,
    Bell,
    Menu,
    Settings,
    LogOut,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user.data.user

    return (
        <nav className="sticky  top-0 z-50 border-b bg-white px-4 md:px-6 py-3">
            <div className="container w-[80%] mx-auto flex items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-2">
                    <div className=" block sm:hidden lg:block text-xl font-bold text-blue-600">🌐</div>

                    <h1 className=" hidden sm:block text-xl font-bold text-slate-900">
                        Social App
                    </h1>
                </div>

                {/* Center */}
                <div className="flex items-center gap-4 md:gap-8 border rounded-full px-4 md:px-8 py-3 shadow-sm bg-white">

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
                    >
                        <Home size={18} />
                        <span className="hidden lg:inline">Feed</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2 text-slate-700 hover:text-black transition"
                    >
                        <User size={18} />
                        <span className="hidden lg:inline">Profile</span>
                    </Link>

                    <Link
                        href="/notification"
                        className="flex items-center gap-2 text-slate-700 hover:text-black transition"
                    >
                        <Bell size={18} />
                        <span className="hidden lg:inline">Notifications</span>
                    </Link>
                </div>

                {/* Right */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 border rounded-full px-3 py-2 shadow-sm hover:bg-slate-50 transition">

                            {user?.photo && (
                                <Image
                                    src={user.photo}
                                    alt="user"
                                    width={32}
                                    height={32}
                                    className="hidden md:block rounded-full object-cover"
                                />
                            )}

                            <span className="hidden xl:block text-sm font-medium">
                                {user?.name}
                            </span>

                            <Menu size={18} className="text-slate-600" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}