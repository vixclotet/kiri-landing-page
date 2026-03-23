"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Wallet, Gift, TrendingUp } from "lucide-react"

const slides = [
  {
    icon: Wallet,
    number: "01",
    title: "Abre una cuenta Kiri",
    description:
      "Abre una cuenta de ahorro e inversión para tus seres queridos de 0 a 18 años en nuestro banco colaborador MyInvestor",
    image: "/images/comofunciona1.svg",
  },
  {
    icon: Gift,
    number: "02",
    title: "Regala en sus ocasiones especiales",
    description:
      "En su cumpleaños, bautizo, primera comunión, confirmación, vuelta al colegio, comienza a contribuir para garantizarles un futuro financiero mejor",
    image: "/images/comofunciona2.svg",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "Invierte en su futuro",
    description:
      "Los menores podrán establecer metas de ahorro y a los 18 años podrán disponer de la inversión y sus rendimientos",
    image: "/images/comofunciona3.svg",
  },
]

const experienceItems = [
  {
    title: "Tarjeta Regalo",
    description:
      "Todos los familiares del niño podrán contribuir a su cuenta Kiri, incrementando su inversión y aportando a metas de ahorro concretas. Además, podrán dejar sus mensajes, videos y fotos, para que el niño guarde todas las memorias en la cápsula del tiempo de Kiri.",
    icon: "🎁",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
  {
    title: "Álbum de los Deseos",
    description:
      "En el Álbum el menor podrá guardar todas las Tarjetas Regalo con los deseos de sus seres queridos. En su colección podrá acceder a cada mensaje mediante el código QR de las Tarjetas Regalo.",
    icon: "📖",
    color: "bg-violet-50 border-violet-200",
    iconBg: "bg-violet-100",
  },
  {
    title: "Kit de Bienvenida",
    description:
      "Kiri enviará un kit de bienvenida con una semilla del árbol Kiri para plantar y una historia divertida, adaptada a su edad, que explicará las ventajas de la inversión en etapas tempranas.",
    icon: "🌱",
    color: "bg-fuchsia-50 border-fuchsia-200",
    iconBg: "bg-fuchsia-100",
  },
  {
    title: "Acceso KiriApp",
    description:
      "Se dará acceso al niño y a sus papás a su usuario en la App donde podrán ver el estado de sus inversiones. Además, allí estarán todos los mensajes de vídeo, voz o texto que dejaron sus seres queridos.",
    icon: "📱",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
]

export default function Featured() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <section id="sobre" className="bg-background">
      {/* About section */}
      <div className="flex flex-col lg:flex-row lg:items-stretch min-h-screen">
        {/* Image side */}
        <div className="flex-1 h-[50vh] lg:h-auto relative">
          <Image
            src="/images/kiri-family.jpg"
            alt="Familia celebrando con una cuenta Kiri"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/20" />
        </div>

        {/* Content side */}
        <div className="flex-1 bg-muted flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3">Sobre Kiri</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
            Más que un producto financiero, una experiencia familiar
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg max-w-lg">
            Kiri es una cuenta de inversión para niños y adolescentes de 0 a 18 años que ayuda a las familias a
            construir un futuro financiero con propósito. Cada cuenta incluye un kit de bienvenida y seguimiento
            anual, fortaleciendo el lazo emocional con quienes aportan.
          </p>

          {/* Slideshow */}
          <div className="relative mb-8">
            <div className="overflow-hidden rounded-2xl bg-background border border-border">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide) => (
                  <div key={slide.number} className="min-w-full p-8">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <slide.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-primary/60 tracking-widest uppercase">
                          Paso {slide.number}
                        </span>
                        <h3 className="font-semibold text-xl text-foreground mt-1 mb-3">{slide.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              aria-label="Diapositiva anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => { nextSlide(); setIsAutoPlaying(false) }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              aria-label="Siguiente diapositiva"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-primary w-8" : "w-2.5 bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <a
            href="#como-funciona"
            className="w-fit bg-primary text-primary-foreground px-7 py-3 rounded-full text-sm font-semibold hover:bg-accent transition-colors duration-300"
          >
            Cómo funciona
          </a>
        </div>
      </div>

      {/* How it works */}
      <div id="como-funciona" className="px-8 md:px-12 lg:px-20 py-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3 text-center">Pasos</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center text-balance">
            Cómo funciona Kiri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {slides.map((step) => (
              <div key={step.number} className="bg-muted rounded-2xl p-8 border border-border flex flex-col items-center text-center">
                <div className="w-40 h-40 relative mb-6 flex-shrink-0">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-serif text-5xl font-bold text-primary/20 leading-none">
                  {step.number}
                </span>
                <h3 className="font-semibold text-xl text-foreground mt-4 mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kiri Experience */}
      <div className="px-8 md:px-12 lg:px-20 py-24 bg-muted">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-3 text-center">
            La experiencia Kiri
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-center text-balance">
            Mucho más que una cuenta de inversión
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Cada Kiri viene con una experiencia completa que une finanzas, emociones y recuerdos familiares para toda la vida.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {experienceItems.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl p-8 border ${item.color} flex gap-6`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${item.iconBg} flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
