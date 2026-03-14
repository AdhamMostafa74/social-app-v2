"use client"

import { usePosts } from "@/hooks/PostHooks";
import TopLoader from "@/shared/Loader/Loader";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";

interface PostFeedProps {
    id: string;
    token: string;
}

export default function PostFeed({ id, token }: PostFeedProps) {
    const { data } = usePosts("posts/feed?only=following&limit=10", "feed");
    const posts = data?.data?.posts

    return (
        <>
            {!posts ? <TopLoader /> :
                posts.map((post: Post) => (
                    <div className="w-full lg:w-4xl" key={post._id}>
                        <PostCard token={token} id={id} post={post} />
                    </div>
                ))}
        </>
    );
}