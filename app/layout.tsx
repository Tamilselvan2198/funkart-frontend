import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/app/LayoutContent";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
