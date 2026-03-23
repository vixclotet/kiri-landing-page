import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/kiri-logo.svg"
            alt="Kiri"
            width={90}
            height={56}
            className="brightness-0 invert"
            priority
          />
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="#sobre" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
            Sobre Kiri
          </Link>
          <Link href="#como-funciona" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
            Cómo funciona
          </Link>
          <Link href="#medios" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
            En los Medios
          </Link>
        </nav>
        <Link
          href="#reserva"
          className="bg-white text-primary px-5 py-2 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors duration-300"
        >
          Reserva tu Kiri
        </Link>
      </div>
    </header>
  )
}
