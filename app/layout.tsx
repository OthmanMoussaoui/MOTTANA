import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MOTTANA',
  description: 'Exploring the intersection of AI and Moroccan cultural heritage',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
