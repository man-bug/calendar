import { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},

			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password)
					throw new Error("Credentials: Invalid credentials");

				const user = await db.user.findUnique({
					where: {
						email: credentials.email,
					},
				});
				if (!user || !user?.password)
					throw new Error("User: Invalid credentials");

				const isCorrectPassword = await compare(
					credentials.password,
					user.password
				);
				if (!isCorrectPassword) throw new Error("Bcrypt: Invalid credentials");

                return {
                   id: user.id,
                   email:  user.email
                } as User
            },
		}),
	],
	callbacks: {
		async jwt({ token, user }: { token: JWT; user: User }) {
			if (user) {
				return {
					...token,
					id: user.id,
					email: user.email,
				};
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			return {
				...session,
				user: {
					id: token.id,
					email: token.email,
				},
			};
		},
	},
};

