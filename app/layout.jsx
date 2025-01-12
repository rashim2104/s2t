import "@/styles/globals.css";
import Navbar from "@components/Navbar/Navbar";
import Footer from "@components/Footer/Footer";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from '@/components/GoogleAnalytics';

/**
 * Inter font configuration
 * @constant {Object}
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata configuration for the application
 * @constant {Object}
 */
export const metadata = {
  title: "Sairam S2T",
  description: "School Towards Technology",
};

/**
 * Root layout component
 * Provides the base structure for all pages
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <Footer />  
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
