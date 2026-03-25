import { api } from "@/services/PostServices";
import { ChangeUserData, FollowUser, GetUserData } from "@/services/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function useGetSuggestions() {
    const { data: session } = useSession();
    const token = session?.user.data.token
    return useQuery({
        queryKey: ['getSuggestions'],
        queryFn: async () => {

            const res = await fetch(`${api}users/suggestions?limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                throw new Error("Unauthorized");
            }
            if (!res.ok) {
                throw new Error("Failed to get users");
            }

            return res.json();
        },
        enabled: !!session?.user?.data?.token,
    });
}

export function useChangePassword() {
    const { data: session, update } = useSession();
    const token = session?.user?.data?.token;

    return useMutation({
        mutationKey: ["changePassword"],

        mutationFn: (data: { password: string; newPassword: string }) =>
            ChangeUserData({
                endPoint: "change-password",
                method: "PATCH",
                token,
                data,
            }),

        onSuccess: () => {
            toast.success("Password changed successfully");
            update()
        },

        onError: () => {
            toast.error("Error changing password");
        },
    });
}

export function useUploadPhoto() {
    const { data: session, update } = useSession();
    const token = session?.user?.data?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["uploadPhoto"],

        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append("photo", file);

            return ChangeUserData({
                endPoint: "upload-photo",
                method: "PUT",
                token,
                formData,
            });

        },

        onSuccess: () => {
            toast.success("Photo updated");
            queryClient.invalidateQueries({ queryKey: ["getProfile"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            update();
        },

        onError: () => {
            toast.error("Upload failed");
        },
    });
}
export function useFollow() {
    const { data: session, update } = useSession();
    const token = session?.user?.data?.token;
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["followUser"],
        mutationFn: (userId: string) => {
            return FollowUser(token, userId)
        },

        onSuccess: () => {
            toast.success("User followed successfully");
            queryClient.invalidateQueries({ queryKey: ["getSuggestions"] });
            update();
        },

        onError: () => {
            toast.error("Failed to follow user");
        },
    });
}

export function useGetProfile() {
    const { data: session } = useSession();
    const token = session?.user?.data?.token;


    return useQuery({
        queryKey: ["getProfile"],
        queryFn: () => GetUserData(token)

    });
}