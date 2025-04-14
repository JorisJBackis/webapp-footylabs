import Link from "next/link"
import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
        <img
            src="/FootyLabs_logo.svg"
            alt="FootyLabs Logo"
            className={`h-[60px] w-auto ${className}`}
        />
    </Link>
  )
}

