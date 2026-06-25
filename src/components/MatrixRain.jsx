import { useRef, useEffect } from 'react'

// Canvas "digital rain". Tunable density/opacity/color/fade.
// Mobile-aware: capped DPR, lower density, 30fps cap, and it fully
// pauses when scrolled offscreen or the tab is hidden (battery + CPU).
export default function MatrixRain({
  className = '',
  color = '#36f9a4',
  head = '#d8ffe9',
  fontSize = 15,
  fade = 0.07,
  speed = 1,
  opacity = 1,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const GLYPHS =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピ0123456789ABCDEFｱｲｳｴｵ<>=/*-+#'.split('')

    // low-power tuning for phones/tablets: fewer columns, no retina blow-up, 30fps
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const fs = coarse ? Math.round(fontSize * 1.5) : fontSize
    const frameInterval = coarse ? 1000 / 30 : 0 // 0 → run at native rAF (~60fps)

    let cols, drops, raf, w, h, dpr
    let running = false
    let onScreen = false
    let last = 0

    const resize = () => {
      dpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, w * dpr)
      canvas.height = Math.max(1, h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / fs)
      drops = new Array(cols).fill(0).map(() => Math.random() * -50)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = (now) => {
      if (!running) return
      raf = requestAnimationFrame(draw)
      if (frameInterval && now - last < frameInterval) return
      last = now

      // translucent black to create the trailing fade
      ctx.fillStyle = `rgba(2,5,6,${fade})`
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${fs}px 'JetBrains Mono', monospace`

      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        const x = i * fs
        const y = drops[i] * fs
        ctx.fillStyle = head
        ctx.fillText(ch, x, y)
        ctx.fillStyle = color
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - fs)

        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i] += speed * (0.6 + Math.random() * 0.5)
      }
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => {
      if (onScreen && !document.hidden) start()
      else stop()
    }

    // only animate while actually visible on screen
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        sync()
      },
      { threshold: 0 }
    )
    io.observe(canvas)
    document.addEventListener('visibilitychange', sync)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [color, head, fontSize, fade, speed])

  return <canvas ref={canvasRef} className={`matrix-canvas ${className}`} style={{ opacity }} />
}
