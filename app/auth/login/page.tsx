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

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
            console.log(values);

            // later:
            // await mutateAsync(values)

        } catch (error) {
            console.error(error);

            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
                <h1 className="mb-8 text-center text-4xl font-bold text-slate-700">
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
                                        <Input
                                            type="password"
                                            className="h-12"
                                            {...field}
                                        />
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

                        <Button
                            type="submit"
                            className="h-12 w-full text-lg"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don&apos;t have an account?
                    <Link
                        href="/register"
                        className="ml-1 font-semibold text-blue-600 hover:underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}