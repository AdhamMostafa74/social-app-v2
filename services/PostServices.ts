import { getAuthData } from "@/types/helpers";

export const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(endpoint: string) {
    const { token } = await getAuthData();

    const res = await fetch(`${api}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export async function PostActions({
    postId,
    token,
    endpoint,
}: {
    postId: string;
    token: string;
    endpoint: string;
}) {
    const res = await fetch(`${api}posts/${postId}/${endpoint}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Action failed");
    }

    return res.json();
}