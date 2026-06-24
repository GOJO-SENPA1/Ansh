import { useRef, useEffect } from 'react'

// Canvas "digital rain". Tunable density/opacity/color/fade.
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
    const ctx = canvas.getContext('2d')
    const GLYPHS =
      'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピ0123456789ABCDEFｱｲｳｴｵ<>=/*-+#'.split('')

    let cols, drops, raf, w, h, dpr
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / fontSize)
      drops = new Array(cols).fill(0).map(() => Math.random() * -50)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let acc = 0
    const draw = () => {
      // translucent black to create trailing fade
      ctx.fillStyle = `rgba(2,5,6,${fade})`
      ctx.fillRect(0, 0, w, h)
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        const x = i * fontSize
        const y = drops[i] * fontSize
        // bright leading glyph
        ctx.fillStyle = head
        ctx.fillText(ch, x, y)
        // dimmer one behind for a tail highlight
        ctx.fillStyle = color
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - fontSize)

        if (y > h && Math.random() > 0.975) drops[i] = 0
        drops[i] += speed * (0.6 + Math.random() * 0.5)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [color, head, fontSize, fade, speed])

  return <canvas ref={canvasRef} className={`matrix-canvas ${className}`} style={{ opacity }} />
}
