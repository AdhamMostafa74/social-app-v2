import { api } from "@/services/PostServices";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
