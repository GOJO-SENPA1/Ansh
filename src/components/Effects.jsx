// Fixed atmospheric overlays + background. All pointer-events:none.
export default function Effects() {
  return (
    <>
      <div className="fx-glow-orb a" />
      <div className="fx-glow-orb b" />
      <div className="fx-grid" />
      <div className="fx-flicker" />
      <div className="fx-vignette" />
      <div className="fx-scanlines" />
      <div className="fx-grain" />
    </>
  )
}
