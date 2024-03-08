import montserrat from "@/assets/fonts/montserrat";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "AirForms",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"}>
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
        <ToastContainer position={"bottom-right"} className={"w-[20000px]"} />
      </body>
    </html>
  );
}
