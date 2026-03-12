import CreatePost from "@/shared/Posts/CreatePost";
import { User } from "next-auth";
import { fetchWithAuth } from "@/services/PostServices";
import { getAuthData } from "@/types/helpers";
import PostFeed from "./home/PostFeed";

export default async function Home() {
  const { token, id, user } = await getAuthData();
  const posts = await fetchWithAuth("posts");

  return (
    <div className="container flex justify-center items-center gap-12 flex-col mx-auto">
      <h1>posts</h1>
      <CreatePost user={user as User} />
      <PostFeed
        id={id!}
        token={token!}
        initialPosts={posts?.data?.posts ?? []}
      />
    </div>
  );
}