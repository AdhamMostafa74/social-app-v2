"use client"

import { useBookmarks } from "@/hooks/PostHooks";
import TopLoader from "@/shared/Loader/Loader";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";
import Image from "next/image";
import bookmarkImage from "@/assets/images/Bookmarks-bro.svg"

interface BookmarksProps {
  id: string;
  token: string;
}

export default function Bookmarks({ id, token }: BookmarksProps) {
  const { data, isLoading } = useBookmarks("users/bookmarks");
  const bookmarks = data?.data?.bookmarks




  return (
    <>
      {isLoading ? <TopLoader /> :
        bookmarks.length === 0
          ?
          <div className="flex justify-center items-center flex-col mt-20 ">
            <span className="text-md text-gray-500 text-center block ">
              No bookmarks added yet
            </span>
            <Image
              src={bookmarkImage}
              alt="A man sitting looking at his bookmarks"
              width={500}
              height={500}
            />
          </div>
          :
          bookmarks.map((post: Post) => (
            <div className="w-full" key={post._id}>
              <PostCard token={token} id={id} post={post} />
            </div>
          ))}

    </>
  );
}