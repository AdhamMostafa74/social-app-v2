import { signOut } from "next-auth/react";

export const api = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(
    endpoint: string,
    token: string,
    options: RequestInit = {}
) {
    const res = await fetch(`${api}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });

    console.log(token)

    if (res.status === 401) {
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        throw new Error("Request failed");
    }

    return res.json();
}

export async function PostActions({
    postId,
    endpoint,
    token,
}: {
    postId: string;
    endpoint: string;
    token: string | undefined;
}) {
    return fetchWithAuth(`posts/${postId}/${endpoint}`, token!, {
        method: "PUT",
    });
}


export async function createPostApi({
    token,
    formData,
}: {
    token: string | undefined;
    formData: FormData;
}) {
    const res = await fetch(`${api}posts`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Action failed");
    }

    return res.json();
}