import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/PostServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostActions } from "@/services/PostServices";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function usePosts(initialData?: unknown) {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await fetch(`${api}posts`, {
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