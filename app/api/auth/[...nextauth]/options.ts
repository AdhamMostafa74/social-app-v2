import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";


const api = process.env.NEXT_PUBLIC_API_URL;
const clientId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;
const secret = process.env.BETTER_AUTH_SECRET;
export const options: NextAuthOptions = {
    secret: secret,
    session: {
        strategy: "jwt"
    },
    callbacks: {

        async jwt({ token, user }) {
            if (user) token.user = user
            return token
        },
        async session({ session, token }) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.user = token.user as any;
            return session;
        }

    },
    providers: [
        CredentialsProvider({
            name: 'Sign in with Credentials',

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const res = await fetch(`${api}users/signin`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log("credentials", credentials);
                console.log("status", res.status);
                console.log("response", await res.clone().text());

                if (!res.ok) return null;

                const user = await res.json();

                return user ?? null;
            }
        }),
        GitHubProvider({
            clientId: clientId!,
            clientSecret: githubSecret!
        })
    ],
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register"
    }

}