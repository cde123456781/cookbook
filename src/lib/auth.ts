import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
// your drizzle instance
import { db } from "~/server/db/index";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "localhost:5173",
      "myapp.com",
      "*.vercel.app",
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
});
