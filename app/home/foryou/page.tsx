"use client"

import { usePosts } from "@/hooks/PostHooks";
import TopLoader from "@/shared/Loader/Loader";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";

interface ForYouProps {
    id: string;
    token: string;
}

export default function ForYou({ id, token }: ForYouProps) {
    const { data } = usePosts("posts", "posts");
    const posts = data?.data?.posts


    return (
        <div>
            {!posts ? <TopLoader /> :
                posts.map((post: Post) => (
                    <div className="w-full lg:w-4xl" key={post._id}>
                        <PostCard token={token} id={id} post={post} />
                    </div>
                ))}
        </div>
    );
}