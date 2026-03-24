"use client"

import { useBookmarks } from "@/hooks/PostHooks";
import TopLoader from "@/shared/Loader/Loader";
import PostCard from "@/shared/Posts/PostCard";
import { Post } from "@/types/Posts";

interface BookmarksProps {
  id: string;
  token: string;
}

export default function Bookmarks({ id, token }: BookmarksProps) {
  const { data, isLoading } = useBookmarks("users/bookmarks");
  const bookmarks = data?.data?.bookmarks

  console.log(data)
  console.log(bookmarks)



  return (
    <>
      <div>test</div>
      {/* {!isLoading ? <TopLoader /> :
        (
          bookmarks?.length != 0 ?
            bookmarks.map((post: Post) => (
              <div className="w-full" key={post._id}>
                <PostCard token={token} id={id} post={post} />
              </div>
            ))
            : <div>no bookmarks</div>
        )
      } */}
    </>
  );
}