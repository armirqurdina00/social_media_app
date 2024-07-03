'use client'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { TokenProvider } from "./TokenContext";

export default function Body({ className, children }) {
  return (
    <body className={className}>
      <TokenProvider>
        <Navbar />
        {children}
        <Footer />
      </TokenProvider>
    </body>
  )
}