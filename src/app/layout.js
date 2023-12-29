import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Toaster from "@/components/Toaster";
import Providers from "@/providers/Providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ruqyah Forum",
  description:
    "Join the Ruqyah Forum, a vibrant community powered by Ruqyah Support BD. Engage in meaningful discussions, stay informed with the latest updates, and connect with like-minded individuals on topics related to Ruqyah and spiritual well-being.",
  author: "Ruqyah Support BD",
  keywords: [
    "Ruqyah Forum",
    "community",
    "ruqyahbd",
    "Ruqyah Support BD Forum",
    "Ruqyah Support Bangladesh",
  ],
  image: "https://i.ibb.co/wh2mk56/Whats-App-Image-2023-12-16-at-20-32-41.jpg",
  url: "https://www.forum.ruqyahbd.org",
};
const RootLayout = ({ children }) => {
  return (
    <html lang="en" data-theme={"dark"} className="transition-all">
      <body className={inter.className}>
        <Providers>
          <Navbar></Navbar>
          <main className="mt-5">{children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
