export default function Hex({ children, className = "", size = 96 }) {
  return (
    <div className={`hex hex-border ${className}`} style={{ width: size, height: size }}>
      <div className="hex hex-inner flex items-center justify-center">{children}</div>
    </div>
  );
}
