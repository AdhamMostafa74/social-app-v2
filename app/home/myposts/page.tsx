"use client"

import { usePosts } from "@/hooks/PostHooks";
import TopLoader from "@/shared/Loader/Loader";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface PostFeedProps {
    id: string;
    token: string;
}

export default function PostFeed({ id, token }: PostFeedProps) {
    const { data, error } = usePosts("posts/feed?only=following&limit=10", "feed");
    const posts = data?.data?.posts

    useEffect(() => {
        if (error?.message === "Unauthorized")
            signOut()

    }, [error])


    return (
        <>
            {!posts ? <TopLoader /> :
                posts.map((post: Post) => (
                    <div className="w-full" key={post._id}>
                        <PostCard token={token} id={id} post={post} />
                    </div>
                ))}
        </>
    );
}