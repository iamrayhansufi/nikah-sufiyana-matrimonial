import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const [imageError, setImageError] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            {!imageError ? (
              <Image 
                src="http://suficreations.com/wp-content/uploads/2021/03/Nikah-Sufiyana-Logo-01.png"
                alt="Nikah Sufiyana" 
                width={130} 
                height={40}
                priority
                onError={() => setImageError(true)}
                className="h-auto"
              />
            ) : (
              <span className="text-xl font-bold text-primary">Nikah Sufiyana</span>
            )}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link
              href="/register"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 