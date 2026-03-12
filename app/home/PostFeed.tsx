"use client"

import { usePosts } from "@/hooks/PostHooks";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";

interface PostFeedProps {
    id: string;
    token: string;
    initialPosts: Post[];
}

export default function PostFeed({ id, token, initialPosts }: PostFeedProps) {
    const { data } = usePosts();

    const posts = data?.data?.posts ?? initialPosts;

    return (
        <>
            {posts.map((post: Post) => (
                <div className="w-full lg:w-3xl" key={post._id}>
                    <PostCard token={token} id={id} post={post} />
                </div>
            ))}
        </>
    );
}