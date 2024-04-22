import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must have at least 8 characters"),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = userSchema.parse(body);
		if (!email || !password)
			return new NextResponse("Bad Request", { status: 400 });

		const existingUserWithEmail = await db.user.findUnique({
			where: { email: email },
		});
		if (existingUserWithEmail) {
			return new NextResponse("A user with this email already exists.", {
				status: 409,
			});
		}

		const hashedPassword = await hash(password, 10);
		const newUser = await db.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});
		if (!newUser)
			return new NextResponse("Failed to create user.", { status: 500 });

		return new NextResponse(newUser.id, { status: 201 });
	} catch (err: any) {
		return new NextResponse(err, { status: 500 });
	}
}

