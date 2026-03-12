import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken: string
        user: User
        & DefaultSession["user"]
    }

    interface User {
        cover: string
        email: string
        name: string
        photo: string
        username: string
        _id: string
        token: string
        data: Data

    }
    interface Data {
        token: string
        tokenType: string
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        accessToken: string
    }
}
