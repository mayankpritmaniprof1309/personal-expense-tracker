// Signature ambient background: soft drifting gradient blobs + grain,
// fixed behind every page so glass surfaces have something to refract.
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <div
        className="aurora-blob animate-drift-slow"
        style={{
          width: 560,
          height: 560,
          top: "-10%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 65%)",
        }}
      />
      <div
        className="aurora-blob animate-drift-slower"
        style={{
          width: 620,
          height: 620,
          top: "10%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(99,102,241,0.28), transparent 65%)",
        }}
      />
      <div
        className="aurora-blob animate-drift-slow"
        style={{
          width: 500,
          height: 500,
          bottom: "-15%",
          left: "20%",
          background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 65%)",
        }}
      />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}
