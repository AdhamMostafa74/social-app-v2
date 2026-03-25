"use client"

import Image from "next/image";
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Pencil,
    Trash2,
    BookmarkIcon,
} from "lucide-react";
import { Post } from "@/types/Posts";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePostAction } from "@/hooks/PostHooks";
import { privacyConfig } from "../privacyOptions/Privacy";
import { useSession } from "next-auth/react";


interface PostCardProps {
    post: Post;
    id: string;
    token: string
}

export default function PostCard({ post, id }: PostCardProps) {

    const { data: session } = useSession()
    const user = session?.user?.data?.user
    const { mutate } = usePostAction()

    const formatRelativeTime = (date: string) => {
        const now = new Date();
        const postDate = new Date(date);

        const diffMs = now.getTime() - postDate.getTime();

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        if (weeks < 4) return `${weeks}w`;
        if (months < 12) return `${months}mo`;

        return `${years}y`;
    };

    const PrivacyIcon =
        privacyConfig[post.privacy as keyof typeof privacyConfig].icon;



    return (
        <div className=" rounded-2xl border my-6  p-4 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image
                        loading="eager"
                        src={post.user.photo}
                        alt={post.user.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover "
                    />

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-[17px] text-[#1f3b73]">
                                {post.user.name}
                            </h3>

                            {post.user.username && (
                                <span className="text-sm text-gray-500">
                                    @{post.user.username}
                                </span>
                            )}

                            <span className="text-sm text-gray-400">
                                • {formatRelativeTime(post.createdAt)}
                            </span>
                            <PrivacyIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-400">
                                {


                                    privacyConfig[post.privacy as keyof typeof privacyConfig].label
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {
                    post.user._id === id && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button>
                                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex items-center gap-2 text-red-500 cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }

            </div>

            {/* Body */}
            {post.body != "null" &&
                <p className="mt-4 text-[17px] text-gray-800 leading-relaxed">
                    {post.body}
                </p>


            }

            {post.image && (
                <div className="mt-4 overflow-hidden rounded-2xl">
                    <Image
                        src={post.image}
                        alt={post.body ?? "Post Image"}
                        width={1200}
                        height={800}
                        className="w-full object-cover"
                    />


                </div>

            )}
            <div className="flex gap-5 justify-end p-2 ">
                <span>{post.sharesCount} Shares</span>
                <span>{post.commentsCount} Comments</span>
            </div>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-6 text-gray-600">

                    {/* Like Button */}
                    <button
                        onClick={() => mutate({ postId: post._id, endpoint: "like" })}
                        className="flex items-center gap-2 transition hover:text-red-500">
                        {
                            <Heart
                                className={`h-5 w-5 ${post.likes.includes(user?._id ?? '')
                                    ? "fill-red-500 "
                                    : "text-gray-600"
                                    }`}
                            />}
                        <span className="font-medium">{post.likesCount}</span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex items-center gap-2 transition hover:text-blue-500">
                        <MessageCircle className="h-5 w-5" />
                    </button>

                    {/* Share Button */}
                    <button className="flex items-center gap-2 transition hover:text-green-500">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>

                {/* Bookmark Button */}
                <button
                    onClick={() => mutate({ postId: post._id, endpoint: "bookmark" })}
                >
                    <BookmarkIcon className={`h-5 w-5 ${post.bookmarked ? " fill-yellow-500 hover:fill-yellow-600" : "transition hover:text-yellow-500"}`} />
                </button>
            </div>
        </div>
    );
}