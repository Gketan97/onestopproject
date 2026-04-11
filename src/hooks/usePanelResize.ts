import { useCallback, useEffect, useRef } from 'react'
import {
  useAIPanelStore,
  AI_PANEL_COLLAPSED_W,
  AI_PANEL_DEFAULT_W,
  AI_PANEL_MIN_W,
} from '@/store/aiPanelStore'

interface UsePanelResizeReturn {
  handleRef: React.RefObject<HTMLDivElement | null>
  onDoubleClick:  () => void
}

export function usePanelResize(): UsePanelResizeReturn {
  const handleRef    = useRef<HTMLDivElement>(null)
  const { setWidth, collapse, expand, width, isCollapsed } = useAIPanelStore()
  const isDragging   = useRef(false)
  const startX       = useRef(0)
  const startWidth   = useRef(0)

  const onDoubleClick = useCallback(() => {
    if (isCollapsed) {
      expand()
    } else if (width === AI_PANEL_DEFAULT_W) {
      collapse()
    } else {
      setWidth(AI_PANEL_DEFAULT_W)
    }
  }, [isCollapsed, width, expand, collapse, setWidth])

  useEffect(() => {
    const handle = handleRef.current
    if (!handle) return

    function onMouseDown(e: MouseEvent) {
      e.preventDefault()
      isDragging.current  = true
      startX.current      = e.clientX
      startWidth.current  = useAIPanelStore.getState().width
      document.body.style.cursor      = 'col-resize'
      document.body.style.userSelect  = 'none'
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return
      // Dragging left = panel grows (subtract because panel is on right)
      const delta    = startX.current - e.clientX
      const newWidth = startWidth.current + delta
      if (newWidth < AI_PANEL_MIN_W + 20) {
        collapse()
      } else {
        expand()
        setWidth(newWidth)
      }
    }

    function onMouseUp() {
      if (!isDragging.current) return
      isDragging.current           = false
      document.body.style.cursor   = ''
      document.body.style.userSelect = ''
    }

    handle.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    return () => {
      handle.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [collapse, expand, setWidth])

  return { handleRef, onDoubleClick }
}
