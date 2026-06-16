import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "./(nav)/navbar";
import { auth } from "~/lib/auth";
import { headers } from "next/dist/server/request/headers";


export const metadata: Metadata = {
  title: "My Cookbook",
  description: "A collection of your favorite recipes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});





export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <html lang="en" data-theme="retro" className={``}>
      <body>
        <header><Navbar initialSession={session} /></header>
        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
