import React from 'react';
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreenTrace Lite – Kilimani Environmental Dashboard',
  description: 'A mobile-first civic platform to report environmental issues and map trees in Kilimani, Nairobi.',
  keywords: ['GreenTrace', 'Kilimani', 'urban environment', 'civic tech', 'Nairobi'],
  authors: [{ name: 'GreenTrace Nairobi' }],
  themeColor: '#14532d', // Dark green for environmental theme
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
