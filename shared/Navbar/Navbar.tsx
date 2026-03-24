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

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SettingsPanel from "../SettingsOverlay/SettingsOverlay";
import { useGetProfile } from "@/hooks/UserHooks";

export default function Navbar() {

    const [openSettings, setOpenSettings] = useState(false);


    const { data: session } = useSession();
    const user = session?.user.data.user

    const { data: profileData } = useGetProfile()


    const handleSignOut = () => {
        signOut()
    }

    const handleSettings = () => {
        setOpenSettings(true)
    }



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
                                    src={profileData?.data.user?.photo ?? user?.photo}
                                    alt="user"
                                    width={32}
                                    height={32}
                                    className="hidden md:block w-8 h-8 rounded-full object-cover"
                                />
                            )}

                            <span className="hidden xl:block text-sm font-medium">
                                {profileData?.data.user?.name}
                            </span>

                            <Menu size={18} className="text-slate-600" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={handleSettings}
                            className="cursor-pointer hover:bg-gray-200 transition-all duration-300">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500  hover:bg-red-100 transition-all duration-300">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <SettingsPanel
                userImage={profileData?.data?.user?.photo ?? ''}
                isOpen={openSettings}
                onClose={() => setOpenSettings(false)

                }

            />


        </nav>


    );
}