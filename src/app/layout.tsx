import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "./(nav)/navbar";

export const metadata: Metadata = {
  title: "My Cookbook",
  description: "A collection of your favorite recipes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="retro" className={``}>
      <body>
        <header><Navbar/></header>
        {children}
      </body>
    </html>
  );
}
