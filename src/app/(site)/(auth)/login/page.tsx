"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import React from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    email: z.string().min(1, "Username is required").max(100),
    password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const toast = useToast();

    const [loading, setLoading] = React.useState(false)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            new Promise(async (resolve, reject) => {
                setLoading(true);

                try {
                    const res = await signIn("credentials", {
                        email: values.email,
                        password: values.password,
                        redirect: false,
                    });
                    if (res && res.ok) {
                        resolve(res);
                    toast.toast({
                            title: "Signed in",
                            description: "You have been signed in successfully",
                        });
                        router.push("/calendar");
                    } else {
                    toast.toast({
                            title: "Couldn't sign in",
                            description: `Error: ${res?.error || "Unknown error"}`,
                            variant: "destructive",
                        });
                        reject(res?.error || "Unknown error");
                    }
                } catch (err: any) {
                    reject(err || "Unknown error");
                }
                setLoading(false);
            });
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <main className="py-[12.5%] flex flex-col items-center justify-center gap-2">
            <Card className="md:min-w-[440px]">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-2"
                    >

                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Don&apos;t have an account?&nbsp;
                                <Button asChild variant="link" className="text-muted-foreground hover:text-blue p-0 h-fit"><Link href="/sign-up">Sign up</Link></Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                autoComplete="email"
                                                autoFocus
                                                placeholder="name@example.com"
                                                {...field}
                                                disabled={loading}
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
                                    <FormItem className="space-y-1">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="current-password"
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="pt-6 border-t bg-muted">
                            <Button type="submit" size="lg" className="w-full">Login</Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>
    )
}
