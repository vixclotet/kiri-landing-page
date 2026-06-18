"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, Send, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Hard-coded knowledge base ────────────────────────────────────────────────

const FAQS = [
  { id: "quien-declara",     label: "¿Quién declara los fondos del menor?" },
  { id: "donacion-fiscal",   label: "¿Cómo afecta fiscalmente una donación?" },
  { id: "irpf-menor",        label: "¿Paga impuestos el menor por rendimientos?" },
  { id: "tutor-dispone",     label: "¿Puede el tutor disponer del dinero?" },
  { id: "obligaciones-tutor",label: "¿Qué obligaciones fiscales tiene el tutor?" },
  { id: "mayoria-edad",      label: "¿Qué pasa al cumplir la mayoría de edad?" },
  { id: "documentos",        label: "¿Qué documentos se necesitan?" },
  { id: "productos",         label: "¿En qué productos pueden invertir?" },
  { id: "cancelar-cuenta",   label: "¿Puedo recuperar el dinero si cancelo?" },
  { id: "un-representante",  label: "¿Puedo añadir un segundo representante?" },
  { id: "necesito-cuenta",   label: "¿Necesito cuenta en MyInvestor?" },
  { id: "condiciones",       label: "¿Qué condiciones tienen las cuentas?" },
]

const RESPONSES: Record<string, string> = {
  "quien-declara":
    "El titular de la cuenta es el menor, pero la responsabilidad de declarar los fondos puede recaer en el tutor legal, dependiendo del origen del dinero y la normativa fiscal vigente.",

  "donacion-fiscal":
    "Las aportaciones a la cuenta del menor pueden considerarse donaciones y estar sujetas al Impuesto sobre Sucesiones y Donaciones (ISD). La fiscalidad depende del importe, la comunidad autónoma y la relación entre donante y beneficiario. En comunidades como Madrid, Andalucía o la Comunidad Valenciana existe una bonificación del 99% para donaciones entre padres e hijos.",

  "irpf-menor":
    "Sí. Los intereses o rendimientos obtenidos en la cuenta del menor están sujetos al IRPF. En las cuentas remuneradas se aplica automáticamente una retención del 19%. Las inversiones en fondos de inversión o acciones no tributan mientras no se retira el dinero. Si se superan los umbrales establecidos por la normativa, puede nacer la obligación de presentar declaración de IRPF — te recomendamos consultar a un asesor fiscal.",

  "tutor-dispone":
    "No. El dinero depositado en la cuenta pertenece al menor y debe ser utilizado en su beneficio. El tutor administra los fondos pero no puede disponer libremente de ellos. Para operaciones de gran impacto financiero — como venta de activos o retiros importantes — puede requerirse autorización judicial.",

  "obligaciones-tutor":
    "El tutor debe asegurarse de que los impuestos derivados de la cuenta del menor sean correctamente declarados y pagados. En caso de inspección, deberá justificar el origen de los fondos. Gestiona el pago del ISD en nombre del menor, pero no puede disponer de los fondos para beneficio propio.",

  "mayoria-edad":
    "Al cumplir la mayoría de edad, el menor asume el control total de la cuenta y la responsabilidad fiscal sobre los fondos y rendimientos generados. A partir de ese momento, podrá disponer libremente de la inversión acumulada y todos sus rendimientos.",

  "documentos":
    "Para abrir una cuenta a un menor necesitas: (1) DNI o NIF del menor — si el menor no tiene DNI (no obligatorio para menores de 14 años), se puede usar el NIF emitido por la Agencia Tributaria; (2) el libro de familia o documento de inscripción del menor en el registro civil; (3) el representante legal debe aportar la misma documentación que si abriera una cuenta para sí mismo.",

  "productos":
    "Los menores pueden invertir en fondos de inversión, fondos indexados, carteras de fondos indexados de gestión discrecional (Clásica, Pop, Indie, Rock y Heavy Metal), acciones y ETFs. La cuenta MyInvestor Junior permite invertir en fondos de inversión y fondos indexados. Las únicas restricciones respecto a cuentas de adultos son que los menores no pueden contratar planes de pensiones ni solicitar tarjetas de débito o crédito.",

  "cancelar-cuenta":
    "Tras la cancelación de la cuenta de un menor, la disposición de valores — como fondos de inversión y carteras de gestión discrecional — debe hacerse en favor del menor titular. Aunque los padres tengan la representación legal, las posiciones en valores no pueden transferirse a la cuenta de los padres, sino a una nueva cuenta a nombre del menor. Si en la cuenta solo hay efectivo, los padres podrán disponer libremente de él.",

  "un-representante":
    "No es posible añadir un segundo representante legal una vez abierta la cuenta. Si quieres que la cuenta tenga dos representantes legales, tendrás que cancelar la cuenta existente e iniciar de nuevo el proceso añadiendo la información de los dos representantes desde el principio.",

  "necesito-cuenta":
    "No. No es necesario ser cliente de MyInvestor para abrir una cuenta a un menor. Puedes abrir una cuenta para tu hijo sin tener cuenta propia. Al iniciar el proceso en la web o app, te preguntarán si deseas abrir una cuenta de un titular, de dos titulares o para un menor.",

  "condiciones":
    "Las cuentas para menores tienen las mismas características que las cuentas para mayores de edad, con dos salvedades: no pueden invertir en planes de pensiones ni solicitar tarjetas de débito o crédito. El resto de productos — fondos, carteras indexadas, acciones y ETFs — están disponibles.",
}

// ─── Keyword matcher for free-text input ─────────────────────────────────────

const KEYWORD_MAP: { keys: string[]; id: string }[] = [
  { keys: ["declara", "declarar", "fondos", "quien declara"],                         id: "quien-declara" },
  { keys: ["donacion", "donación", "isd", "sucesiones", "afecta", "fiscal"],          id: "donacion-fiscal" },
  { keys: ["irpf", "rendimiento", "intereses", "tributa", "impuesto renta"],          id: "irpf-menor" },
  { keys: ["tutor", "disponer", "dispone", "retirar", "libre"],                       id: "tutor-dispone" },
  { keys: ["obligacion", "obligación", "obligaciones", "responsabilidad"],            id: "obligaciones-tutor" },
  { keys: ["18", "mayoría", "mayoria", "mayor de edad", "cumplir"],                   id: "mayoria-edad" },
  { keys: ["documento", "documentos", "dni", "nif", "libro familia", "abrir"],        id: "documentos" },
  { keys: ["producto", "invertir", "fondos", "etf", "acciones", "cartera"],           id: "productos" },
  { keys: ["cancelar", "cancel", "recuperar", "dinero invertido"],                    id: "cancelar-cuenta" },
  { keys: ["representante", "segundo", "añadir", "anadir"],                           id: "un-representante" },
  { keys: ["necesito cuenta", "myinvestor", "cliente", "propia"],                     id: "necesito-cuenta" },
  { keys: ["condicion", "condición", "condiciones", "restriccion", "restricción"],    id: "condiciones" },
]

const FALLBACK =
  "¡Gracias por tu pregunta! Nuestro equipo de soporte estará encantado de ayudarte. Puedes escribirnos a hola@kiriapp.com o consultar más información en kiriapp.com. ¿Hay algo más en lo que pueda ayudarte?"

function matchResponse(text: string): string {
  const lower = text.toLowerCase()
  for (const { keys, id } of KEYWORD_MAP) {
    if (keys.some((k) => lower.includes(k))) return RESPONSES[id]
  }
  return FALLBACK
}

// ─── Related follow-up suggestions per FAQ ───────────────────────────────────

const FOLLOW_UPS: Record<string, string[]> = {
  "quien-declara":     ["donacion-fiscal", "obligaciones-tutor", "irpf-menor"],
  "donacion-fiscal":   ["quien-declara", "irpf-menor", "obligaciones-tutor"],
  "irpf-menor":        ["donacion-fiscal", "quien-declara", "mayoria-edad"],
  "tutor-dispone":     ["obligaciones-tutor", "cancelar-cuenta", "un-representante"],
  "obligaciones-tutor":["tutor-dispone", "irpf-menor", "donacion-fiscal"],
  "mayoria-edad":      ["productos", "cancelar-cuenta", "condiciones"],
  "documentos":        ["necesito-cuenta", "un-representante", "condiciones"],
  "productos":         ["condiciones", "mayoria-edad", "cancelar-cuenta"],
  "cancelar-cuenta":   ["tutor-dispone", "productos", "un-representante"],
  "un-representante":  ["documentos", "necesito-cuenta", "cancelar-cuenta"],
  "necesito-cuenta":   ["documentos", "condiciones", "productos"],
  "condiciones":       ["productos", "necesito-cuenta", "mayoria-edad"],
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = "genie" | "user"
interface Message {
  role: MessageRole
  text: string
  followUpIds?: string[]  // IDs of follow-up suggestions shown after this genie message
}

const GREETING: Message = {
  role: "genie",
  text: "¡Hola! Soy el Genio de Kiri, ¡aquí para conceder tus deseos financieros! Elige una de las preguntas frecuentes o escríbeme lo que necesites.",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GenieChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState("")
  const [faqsShown, setFaqsShown] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const handleOpen = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpen(true), 180)
  }, [])

  const handleLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }, [])

  const addGenieMessage = (text: string, followUpIds?: string[]) => {
    setIsTyping(false)
    setMessages((prev) => [...prev, { role: "genie", text, followUpIds }])
  }

  const handleFAQ = (id: string) => {
    const faq = FAQS.find((f) => f.id === id)
    if (!faq) return
    setFaqsShown(false)
    setMessages((prev) => [...prev, { role: "user", text: faq.label }])
    setIsTyping(true)
    setTimeout(() => addGenieMessage(RESPONSES[id], FOLLOW_UPS[id]), 620)
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setFaqsShown(false)
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: trimmed }])
    setIsTyping(true)
    // Find best matching FAQ id to show follow-ups
    const lower = trimmed.toLowerCase()
    let matchedId: string | undefined
    for (const { keys, id } of KEYWORD_MAP) {
      if (keys.some((k) => lower.includes(k))) { matchedId = id; break }
    }
    const response = matchedId ? RESPONSES[matchedId] : FALLBACK
    const followUps = matchedId ? FOLLOW_UPS[matchedId] : undefined
    setTimeout(() => addGenieMessage(response, followUps), 620)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend()
  }

  const resetChat = () => {
    setMessages([GREETING])
    setFaqsShown(true)
    setIsTyping(false)
    setInput("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-[22rem] sm:w-96 bg-white rounded-3xl shadow-2xl border border-border flex flex-col"
            style={{ height: "min(82vh, 580px)" }}
            role="dialog"
            aria-label="Chat con el Genio de Kiri"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground flex-shrink-0 rounded-t-3xl">
              <div className="w-9 h-9 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
                <Image
                  src="/images/genio-kiri.png"
                  alt="Genio Kiri"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight">Genio Kiri</p>
                <p className="text-xs text-purple-200 leading-tight">Soporte · Siempre disponible</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={resetChat}
                  className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Reiniciar conversación"
                  title="Reiniciar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages — scrollable */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[hsl(270,100%,97%)]"
              style={{ overscrollBehavior: "contain" }}
            >
              {messages.map((msg, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "genie" && (
                      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1 bg-primary/10">
                        <Image src="/images/genio-kiri.png" alt="" width={28} height={28} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "genie"
                          ? "bg-white text-foreground rounded-tl-sm shadow-sm border border-border"
                          : "bg-primary text-primary-foreground rounded-tr-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Follow-up suggestions after each genie response (except greeting) */}
                  {msg.role === "genie" && msg.followUpIds && msg.followUpIds.length > 0 && (
                    <div className="ml-9 flex flex-col gap-1.5">
                      <p className="text-xs text-muted-foreground">Puede que también te interese:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpIds.map((id) => {
                          const faq = FAQS.find((f) => f.id === id)
                          if (!faq) return null
                          return (
                            <button
                              key={id}
                              onClick={() => handleFAQ(id)}
                              className="text-xs bg-white border border-primary/30 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {faq.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* FAQ chips — shown after greeting only */}
              {faqsShown && (
                <div className="pt-1">
                  <p className="text-xs text-muted-foreground mb-2 ml-9">Preguntas frecuentes:</p>
                  <div className="flex flex-wrap gap-2 ml-9">
                    {FAQS.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleFAQ(faq.id)}
                        className="text-xs bg-white border border-primary/30 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {faq.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-1 bg-primary/10">
                    <Image src="/images/genio-kiri.png" alt="" width={28} height={28} className="object-cover w-full h-full" />
                  </div>
                  <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-border bg-white flex-shrink-0 rounded-b-3xl">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 text-sm bg-[hsl(270,100%,97%)] rounded-xl px-3.5 py-2 outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground text-foreground"
                aria-label="Escribe tu pregunta al Genio"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genie trigger button */}
      <div
        onMouseEnter={handleOpen}
        onMouseLeave={handleLeave}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        aria-label="Abrir chat con el Genio de Kiri"
        aria-expanded={open}
        className="relative cursor-pointer select-none group"
      >
        {/* Tooltip on hover when closed */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute right-full mr-3 bottom-4 pointer-events-none"
            >
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                ¡Pide un deseo!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" />
        )}

        {/* Genie avatar */}
        <motion.div
          animate={open ? { scale: 1.05 } : { scale: 1 }}
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-primary/30 overflow-hidden"
        >
          <Image
            src="/images/genio-kiri.png"
            alt="Genio de Kiri — Soporte"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  )
}
