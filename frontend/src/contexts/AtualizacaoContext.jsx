import { createContext, useContext, useState, useCallback } from 'react'

const AtualizacaoContext = createContext(null)

export function AtualizacaoProvider({ children }) {
  const [contador, setContador] = useState(0)

  const atualizar = useCallback(() => {
    setContador(c => c + 1)
  }, [])

  return (
    <AtualizacaoContext.Provider value={{ contador, atualizar }}>
      {children}
    </AtualizacaoContext.Provider>
  )
}

export function useAtualizacao() {
  return useContext(AtualizacaoContext)
}
