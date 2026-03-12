import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


export async function getAuthData() {
    const session = await getServerSession(options);

    return {
        session,
        token: session?.user?.data?.token,
        id: session?.user.data?.user?._id,
        user: session?.user.data.user
    };
}