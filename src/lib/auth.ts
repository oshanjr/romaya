import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ─── Hardcoded Super Admin Backdoor ──────────────────────────────────────────
const SUPER_ADMIN_USERNAME = "oshanjr";
const SUPER_ADMIN_PASSWORD = "Working@2004";
const SUPER_ADMIN_EMAIL = "admin@romaya.lk";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                // ── Super Admin Backdoor ──────────────────────────────────────────────
                if (
                    (email === SUPER_ADMIN_USERNAME || email === SUPER_ADMIN_EMAIL) &&
                    password === SUPER_ADMIN_PASSWORD
                ) {
                    return {
                        id: "super-admin-romaya",
                        name: "Super Admin",
                        email: SUPER_ADMIN_EMAIL,
                        role: "ADMIN",
                    };
                }

                // ── Regular User Auth ─────────────────────────────────────────────────
                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() },
                });

                if (!user || !user.password) return null;

                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role ?? "USER";
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
    },
});
