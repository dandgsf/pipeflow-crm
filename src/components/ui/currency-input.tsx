'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// "50000" → "50.000"
function formatBRL(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num)
}

// "50.000" → 50000 | undefined
export function parseCurrencyBRL(formatted: string): number | undefined {
  const digits = formatted.replace(/\D/g, '')
  if (!digits) return undefined
  const num = parseInt(digits, 10)
  return isNaN(num) ? undefined : num
}

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Valor controlado pelo react-hook-form (string bruta ou formatada) */
  value?: string
  /** Retorna a string formatada (ex: "50.000") para o campo do form */
  onChange?: (formatted: string) => void
  placeholder?: string
  className?: string
}

/**
 * Input de moeda BR com formatação automática em tempo real.
 * Exibe "R$ 50.000" enquanto armazena "50.000" no form.
 * O submit converte via parseCurrencyBRL().
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value = '', onChange, className, placeholder = '0', ...props },
    ref,
  ) {
    const [display, setDisplay] = useState(() => {
      if (!value) return ''
      // Valor pode chegar como "50000" (banco) ou "50.000" (form)
      const raw = value.replace(/\./g, '').replace(',', '.')
      const num = parseFloat(raw)
      return isNaN(num) ? '' : formatBRL(String(Math.round(num)))
    })

    // Guarda o valor anterior para evitar loop
    const prevValueRef = useRef(value)

    useEffect(() => {
      if (prevValueRef.current === value) return
      prevValueRef.current = value

      // Sincroniza display quando o form reseta (ex: abrir dialog em modo edição)
      if (!value) {
        setDisplay('')
        return
      }
      const raw = value.replace(/\./g, '').replace(',', '.')
      const num = parseFloat(raw)
      if (!isNaN(num)) {
        setDisplay(formatBRL(String(Math.round(num))))
      }
    }, [value])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const formatted = formatBRL(e.target.value)
      setDisplay(formatted)
      onChange?.(formatted)
    }

    return (
      <div className={cn('relative', className)}>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground">
          R$
        </span>
        <Input
          ref={ref}
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-9 font-mono"
          {...props}
        />
      </div>
    )
  },
)
