'use client'
import './globals.css'
import './page-transitions.css'
import { Toaster } from "@/components/ui/toaster"
import PageTransition from "@/components/page-transition";

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <title>ManagHer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-body antialiased min-h-screen bg-background`}
      >
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster />
      </body>
    </html>
  );
}



