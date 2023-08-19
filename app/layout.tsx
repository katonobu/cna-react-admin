import './globals.css'
import { Inter } from 'next/font/google'
import {WebSerialWorkerProvider} from '@/app/worker/src/webSerialWorkerProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WebSerial Terminal',
  description: 'Ver 0.0'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSerialWorkerProvider>
          {children}
        </WebSerialWorkerProvider>
      </body>
    </html>
  )
}
