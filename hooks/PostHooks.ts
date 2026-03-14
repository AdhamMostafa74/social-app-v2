import { useQuery } from "@tanstack/react-query";
import { api, createPostApi } from "@/services/PostServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostActions } from "@/services/PostServices";
import { useSession } from "next-auth/react";
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
            return res.json();
        },
        initialData,
        enabled: !!session?.user?.data?.token,
    });
}

type PostActionParams = {
    postId: string;
    token: string;
    endpoint: string;
};

export function usePostAction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token, endpoint }: PostActionParams) =>
            PostActions({ postId, token, endpoint }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
                exact: false,
                refetchType: "active",
            });

            toast.success("Done", {
                duration: 1500,
            });
        },


    });
}

type CreatePostParams = {
    token: string | undefined;
    formData: FormData;
};

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ token, formData }: CreatePostParams) =>
            createPostApi({
                token,
                formData,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });

            toast.success("Post created", {
                duration: 1500,
            });
        },

        onError: () => {
            toast.error("Something went wrong");
        },
    });
}

