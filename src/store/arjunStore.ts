import { create } from 'zustand'

export interface ArjunMessage {
  role:    'user' | 'arjun'
  content: string
  id:      string
}

interface ArjunState {
  isOpen:       boolean
  isLoading:    boolean
  messages:     ArjunMessage[]
  phaseContext: string
  openModal:    (phaseContext: string) => void
  closeModal:   () => void
  addMessage:   (msg: ArjunMessage) => void
  setLoading:   (v: boolean) => void
  clearMessages: () => void
}

export const useArjunStore = create<ArjunState>()((set) => ({
  isOpen:       false,
  isLoading:    false,
  messages:     [],
  phaseContext: '',

  openModal:    (phaseContext) => set({ isOpen: true, phaseContext }),
  closeModal:   () => set({ isOpen: false }),
  addMessage:   (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading:   (v) => set({ isLoading: v }),
  clearMessages: () => set({ messages: [] }),
}))
