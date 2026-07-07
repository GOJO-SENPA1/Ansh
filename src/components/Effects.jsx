// Fixed atmospheric layers — subtle depth, not spectacle. All pointer-events:none.
export default function Effects() {
  return (
    <>
      <div className="atmos" aria-hidden="true">
        <div className="atmos-grid" />
        <div className="atmos-radial" />
      </div>
      <div className="atmos-vig" aria-hidden="true" />
      <div className="atmos-scan" aria-hidden="true" />
    </>
  )
}
