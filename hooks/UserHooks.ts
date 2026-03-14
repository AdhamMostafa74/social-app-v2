import { api } from "@/services/PostServices";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useGetSuggestions() {
    const { data: session } = useSession();
    return useQuery({
        queryKey: ['getSuggestions'],
        queryFn: async () => {

            const res = await fetch(`${api}users/suggestions?limit=10`, {
                headers: {
                    Authorization: `Bearer ${session?.user.data.token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to get users");
            }

            return res.json();
        },
        enabled: !!session?.user?.data?.token,
    });
}
