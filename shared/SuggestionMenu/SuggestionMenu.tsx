"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Suggestion } from "@/types/Suggestions";
import { useFollow, useGetSuggestions } from "@/hooks/UserHooks";
import { FaSpinner } from "react-icons/fa";

type SuggestionMenuProps = {
    compact?: boolean;
    maxItems?: number;
};

export default function SuggestionMenu({
    compact = false,
    maxItems,
}: SuggestionMenuProps) {
    const [search, setSearch] = useState("");
    const [activeUser, setActiveUser] = useState<string | null>(null);

    const { data, isLoading } = useGetSuggestions();
    const { mutate: followUser, isPending } = useFollow();

    const filteredUsers = useMemo(() => {
        const users = (data == undefined ? [] : data.data.suggestions).filter(
            (user: Suggestion) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.username?.toLowerCase().includes(search.toLowerCase())
        );

        return maxItems ? users.slice(0, maxItems) : users;
    }, [search, maxItems, data]);


    const handleFollow = (userId: string) => {
        setActiveUser(userId)
        followUser(userId, {
            onSettled: () => setActiveUser(null)

        })

    }


    return (
        <div className="space-y-3">
            {/* Search */}
            {!compact && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            )}

            {/* Scrollable Container */}
            <div
                className={
                    compact
                        ? "max-h-64 overflow-y-auto space-y-2 pr-1"
                        : "max-h-80 overflow-y-auto space-y-3 pr-1"
                }
            >
                {isLoading ? (
                    [...Array(compact ? 2 : 4)].map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-xl animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full bg-gray-200 ${compact ? "w-9 h-9" : "w-12 h-12"
                                        }`}
                                />

                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                    <div className="h-3 w-16 bg-gray-200 rounded" />

                                    {!compact && (
                                        <>
                                            <div className="h-3 w-20 bg-gray-200 rounded" />
                                            <div className="h-3 w-14 bg-gray-200 rounded" />
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="h-7 w-16 bg-gray-200 rounded-lg" />
                        </div>
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user: Suggestion) => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={user.photo}
                                    alt={user.name}
                                    width={compact ? 36 : 48}
                                    height={compact ? 36 : 48}
                                    className="rounded-full object-cover"
                                />

                                <div>
                                    <p className="font-medium text-sm">
                                        {user.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        @{user.username}
                                    </p>

                                    {!compact && (
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                {user.followersCount} followers
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {user.mutualFollowersCount} mutual
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={isPending && activeUser === user._id}
                                onClick={() => handleFollow(user._id)}
                                className="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition disabled:bg-blue-300">
                                {isPending && activeUser === user._id ? <FaSpinner className="animate-spin" /> : "Follow"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">
                        No users found
                    </p>
                )}
            </div>
        </div>
    );
}