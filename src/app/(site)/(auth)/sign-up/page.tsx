"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import React from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
    email: z.string().min(1, "Username is required").max(100),
    password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
})
.refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
});

export default function SignUp() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const toast = useToast();
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const passwordRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
        if (passwordRef.current) {
            const input = passwordRef.current.querySelector("input");
            if (input) {
                isPasswordVisible
                    ? input.type = "text"
                    : input.type = "password"
            };
        }
    }, [isPasswordVisible, passwordRef.current])


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            new Promise(async (resolve, reject) => {
                setLoading(true);
                try {
                    const res = await fetch("/api/sign-up", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: values.email,
                            password: values.password,
                        }),
                    });

                    if (res.ok) {
                        resolve(res);
                        toast.toast({
                            title: "Account created",
                            description: "Account successfully created.",
                        });
                        router.push("/login");
                    } else {
                        toast.toast({
                            title: "Error",
                            description:
                            res.statusText === "Conflict"
                                ? "Username or email is already registered"
                                : res.statusText || "Unknown error",
                            variant: "destructive",
                        });
                        reject(
                            res.statusText === "Conflict"
                                ? "Username or email is already registered"
                                : res.statusText || "Unknown error",
                        );
                    }
                } catch (err: any) {
                    reject(err || "Unknown error");
                }
                setLoading(false);
            });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
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
                            <CardTitle className="text-2xl">Create an account</CardTitle>
                            <CardDescription>
                                Already have an account?&nbsp;
                                <Button asChild variant="link" className="text-muted-foreground hover:text-blue p-0 h-fit"><Link href="/login">Login</Link></Button>
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
                                            <div className="relative" ref={passwordRef}>
                                                <Input
                                                    className="pr-[38px]"
                                                    autoComplete="new-password"
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                    disabled={loading}
                                                />
                                                <Button onClick={() => setIsPasswordVisible((prev) => (!prev))} className="absolute rounded-l-none rounded-r-[calc(var(--radius)-3px)] !shadow-none right-[1px] top-1/2 -translate-y-1/2 h-[38px] w-[38px]" type="button" variant="ghost" size="icon">
                                                    {isPasswordVisible ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
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
                            <Button disabled={loading} type="submit" size="lg" className="w-full">Register</Button>
                        </CardFooter>
                    </form>
                </Form>

            </Card>
        </main>
    )
}
