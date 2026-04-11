import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AIPanelContent =
  | { type: 'welcome' }
  | { type: 'insight'; title: string; text: string }
  | { type: 'chart';   title: string; chartId: string }

// ── Constants ─────────────────────────────────────────────────────────────────
export const AI_PANEL_COLLAPSED_W = 52
export const AI_PANEL_DEFAULT_W   = 320
export const AI_PANEL_OVERLAY_W   = 520   // threshold above which center dims
export const AI_PANEL_MAX_W       = typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.75) : 960
export const AI_PANEL_MIN_W       = AI_PANEL_COLLAPSED_W

interface AIPanelState {
  width:        number
  isCollapsed:  boolean
  content:      AIPanelContent
  // Actions
  setWidth:     (w: number) => void
  collapse:     () => void
  expand:       () => void
  toggleCollapse: () => void
  setContent:   (c: AIPanelContent) => void
  openWithContent: (c: AIPanelContent) => void
}

export const useAIPanelStore = create<AIPanelState>()(
  persist(
    (set, get) => ({
      width:       AI_PANEL_DEFAULT_W,
      isCollapsed: false,
      content:     { type: 'welcome' },

      setWidth: (w) => set({ width: Math.max(AI_PANEL_MIN_W, Math.min(w, AI_PANEL_MAX_W)) }),

      collapse: () => set({ isCollapsed: true, width: AI_PANEL_COLLAPSED_W }),

      expand: () =>
        set((s) => ({
          isCollapsed: false,
          width: s.width <= AI_PANEL_COLLAPSED_W ? AI_PANEL_DEFAULT_W : s.width,
        })),

      toggleCollapse: () => {
        const { isCollapsed } = get()
        isCollapsed ? get().expand() : get().collapse()
      },

      setContent:      (content) => set({ content }),
      openWithContent: (content) => {
        const { isCollapsed } = get()
        set({
          content,
          isCollapsed: false,
          width: isCollapsed ? AI_PANEL_DEFAULT_W : get().width,
        })
      },
    }),
    {
      name:    'osc-ai-panel',
      partialize: (s) => ({ width: s.width, isCollapsed: s.isCollapsed }),
    },
  ),
)
