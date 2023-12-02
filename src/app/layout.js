import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Toaster from "@/components/Toaster";
import Providers from "@/providers/Providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ruqyah Forum",
  description: "Forum by Ruqyah Support BD",
};

const RootLayout = ({ children }) => {

  return (
    <html lang="en" data-theme={ "dark"} className="transition-all">
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
