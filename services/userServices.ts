import { api } from "./PostServices";

export async function GetUserData(token: string | undefined) {

    const res = await fetch(`${api}users/profile-data`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Action failed");
    }

    return res.json();
}
export async function ChangeUserData({
    token,
    data,
    formData,
    endPoint,
    method
}: {
    token: string | undefined;
    data?: unknown;
    formData?: FormData;
    endPoint: string;
    method: string;
}) {

    const isFormData = !!formData;

    const res = await fetch(`${api}users/${endPoint}`, {
        method: method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        body: isFormData ? formData : JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Action failed");
    }

    return res.json();
}

