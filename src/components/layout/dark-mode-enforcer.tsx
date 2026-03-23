'use client'

import { useEffect } from 'react'

/**
 * Aplica `class="dark"` no <html> enquanto o app shell estiver montado.
 *
 * Necessário porque os portais do @base-ui/react (Sheet, Dropdown, Dialog)
 * renderizam diretamente em document.body — fora do wrapper <div class="dark">
 * do layout. Sem isso, todos os popups abrem no modo claro.
 *
 * Remove a classe ao desmontar (ex.: ao navegar para a landing page, que usa light mode).
 */
export function DarkModeEnforcer() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('dark')
    return () => html.classList.remove('dark')
  }, [])

  return null
}
