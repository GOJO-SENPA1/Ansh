// DedSec / Watch-Dogs-style glitch skull — RGB-split layers, scanlines,
// flickering red horror eyes. Pure SVG + CSS (cheap, ~2s boot showpiece).
const SKULL_D =
  'M120 24 C70 24 40 64 40 116 C40 146 50 168 66 182 L66 196 C66 202 70 206 78 206 L162 206 C170 206 174 202 174 196 L174 182 C190 168 200 146 200 116 C200 64 170 24 120 24 Z ' +
  'M58 100 C58 86 76 82 92 92 C104 100 104 122 92 132 C76 142 56 134 54 116 C53 110 54 104 58 100 Z ' +
  'M182 100 C182 86 164 82 148 92 C136 100 136 122 148 132 C164 142 184 134 186 116 C187 110 186 104 182 100 Z ' +
  'M120 144 C114 158 104 166 108 176 C111 183 118 178 120 172 C122 178 129 183 132 176 C136 166 126 158 120 144 Z ' +
  'M86 212 L154 212 C160 212 164 216 164 224 L164 240 C164 250 154 258 140 258 L100 258 C86 258 76 250 76 240 L76 224 C76 216 80 212 86 212 Z ' +
  'M104 214 L108 214 L108 236 L104 236 Z M118 214 L122 214 L122 236 L118 236 Z M132 214 L136 214 L136 236 L132 236 Z ' +
  'M98 197 L102 197 L102 206 L98 206 Z M114 197 L118 197 L118 206 L114 206 Z M130 197 L134 197 L134 206 L130 206 Z'

const CRACK_D = 'M120 28 L110 58 L122 76 L112 96 M40 116 L72 122 M200 116 L168 122'

const Glyph = ({ crack }) => (
  <svg viewBox="0 0 240 300">
    <path className="skull-path" fillRule="evenodd" d={SKULL_D} />
    {crack && <path className="skull-crack" d={CRACK_D} />}
  </svg>
)

export default function Skull() {
  return (
    <div className="skull-rig" aria-hidden="true">
      <div className="skull-eyes" />
      <div className="skull-layer s-red"><Glyph /></div>
      <div className="skull-layer s-cyan"><Glyph /></div>
      <div className="skull-layer s-base"><Glyph crack /></div>
      <div className="skull-scan" />
    </div>
  )
}
