import { Fraunces, Jost } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ToastProvider } from "@/context/ToastContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Kiran Sudha — India's Legacy, Worn Anew",
    template: "%s | Kiran Sudha",
  },
  description:
    "Kiran Sudha brings traditional fashion from the states of India — Chikankari, Bandhani, Phulkari and more — reimagined with a modern touch.",
  openGraph: {
    siteName: "Kiran Sudha",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory font-body text-ink">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <LocationProvider>
                <AnnouncementBar />
                <Navbar />
                <div className="flex flex-1 flex-col">{children}</div>
                <Footer />
              </LocationProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
