"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "./loginSchema";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash, FaFacebookF, FaGithub } from "react-icons/fa";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";



type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();


    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
                callbackUrl: "/",
            });

            if (result?.error) {
                form.setError("root", {
                    message: "Invalid email or password",
                });
                return;
            }

            router.push('/')
        } catch (error) {
            form.setError("root", {
                message: `Something went wrong. Please try again. ${error}`,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
                <h1 className="mb-8 text-center text-4xl font-bold text-black">
                    Sign In
                </h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                className="h-12 pr-10"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                            >
                                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <Link
                            className="ml-1  font-semibold text-blue-600 hover:underline"
                            href='/forgotpassword'
                        >

                            Forgot Password?
                        </Link>

                        <Button
                            type="submit"
                            className="h-12 mt-2 w-full text-lg bg-blue-500 hover:bg-blue-600"
                            disabled={form.formState.isSubmitting}

                        >
                            {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <div className="flex flex-col gap-4 mt-8 text-center text-sm text-slate-500">
                    <div>
                        <span> Don&apos;t have an account?</span>
                        <Link
                            href="/auth/register"
                            className="ml-1 font-semibold text-blue-600 hover:underline"
                        >
                            Sign Up
                        </Link></div>

                    <span>OR</span>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                    <Button
                        size={'lg'}
                        type="submit"
                        variant="outline"
                        className="h-12 w-full flex items-center justify-center gap-3 text-base"
                        disabled={form.formState.isSubmitting}
                    >
                        <div className="flex justify-between items-center gap-5">
                            <FcGoogle className="w-6 h-6" />
                            {form.formState.isSubmitting ? "Signing In..." : "Continue with Google"}
                        </div>
                    </Button>
                    <Button
                        size={'lg'}
                        type="submit"
                        variant="outline"
                        className="h-12 w-full flex items-center justify-center gap-3 text-base text-white  bg-blue-500 hover:bg-blue-600 hover:text-white "
                        disabled={form.formState.isSubmitting}
                    >
                        <div className="flex justify-between items-center gap-5">
                            <FaFacebookF className="w-6 h-6" />
                            {form.formState.isSubmitting ? "Signing In..." : "Continue with Facebook"}
                        </div>

                    </Button>
                    <Button
                        size={'lg'}
                        type="submit"
                        variant="outline"
                        className="h-12 w-full flex items-center justify-center gap-3 text-base bg-black text-white hover:bg-gray-600 hover:text-white"
                        disabled={form.formState.isSubmitting}
                    >
                        <div className="flex justify-between items-center gap-5">
                            <FaApple className="w-6 h-6" />
                            {form.formState.isSubmitting ? "Signing In..." : "Continue with Apple"}
                        </div>
                    </Button>
                    <Button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        size={'lg'}
                        type="button"
                        variant="outline"
                        className="h-12 w-full flex items-center justify-center gap-3 text-base bg-black text-white hover:bg-gray-600 hover:text-white"
                        disabled={form.formState.isSubmitting}
                    >
                        <div className="flex justify-between items-center gap-5">
                            <FaGithub className="w-6 h-6" />
                            {form.formState.isSubmitting ? "Signing In..." : "Continue with Github"}
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}