import "./globals.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Sparrow — Experience the Unbuilt tanish vijay rishi",
  description:
    "Imagination enablers & obsessive innovators working in Phygital spaces for forward facilitation of real estate brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Light.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/NeueMontreal-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preload hero video for instant playback */}
        <link
          rel="preload"
          href="/video/Showreel_V1.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
