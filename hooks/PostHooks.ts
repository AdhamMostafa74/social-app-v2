import { useQuery } from "@tanstack/react-query";
import { api, createPostApi } from "@/services/PostServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostActions } from "@/services/PostServices";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export function usePosts(endPoint: string, queryKey: string, initialData?: unknown) {
    const { data: session } = useSession();
    const subQueryKey = "posts"

    return useQuery({
        queryKey: [subQueryKey, queryKey],
        queryFn: async () => {
            const res = await fetch(`${api}${endPoint}`, {
                headers: {
                    Authorization: `Bearer ${session?.user?.data?.token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch posts");
            if (res.status === 401) {
                signOut()
                throw new Error("Unauthorized");
            }
            return res.json();
        },
        initialData,
        enabled: !!session?.user?.data?.token,
    });
}
export function useBookmarks(endPoint: string,) {
    const { data: session } = useSession();


    return useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const res = await fetch(`${api}${endPoint}`, {
                headers: {
                    Authorization: `Bearer ${session?.user?.data?.token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch posts");
            return res.json();
        },
    });
}

type PostActionParams = {
    postId: string;
    endpoint: string;
};

export function usePostAction() {
    const { data: session } = useSession();
    const token = session?.user.data.token

    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: ({ postId, endpoint }: PostActionParams) =>
            PostActions({ postId, endpoint, token }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
                exact: false,
                refetchType: "active",
            });
            queryClient.invalidateQueries({
                queryKey: ["bookmarks"],
                exact: false,
                refetchType: "active",
            });

            toast.success("Done", {
                duration: 1500,
            });
        },
        onError: () => {
            toast.error("Something went wrong");
        },


    });
}


type CreatePostParams = {
    token: string | undefined;
    formData: FormData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCreatePost(options: any) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, formData }: CreatePostParams) =>
            createPostApi({
                token,
                formData,
            }),

        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });

            toast.success("Post created", {
                duration: 1500,
            });

            options?.onSuccess?.(data, variables, context)
        },

        onError: () => {
            toast.error("Something went wrong");
        },
    });
}



