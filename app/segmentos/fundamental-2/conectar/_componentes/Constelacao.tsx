/** Marca visual do CONECTAR: pontos (pessoas) ligados por linhas (afinidades). */
export default function Constelacao({ className = "cx-constelacao" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 140" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <line x1="30" y1="96" x2="84" y2="40" />
        <line x1="84" y1="40" x2="132" y2="78" />
        <line x1="132" y1="78" x2="190" y2="30" />
        <line x1="132" y1="78" x2="168" y2="118" />
        <line x1="84" y1="40" x2="68" y2="120" />
      </g>
      <g fill="currentColor">
        <circle cx="30" cy="96" r="8" />
        <circle cx="84" cy="40" r="11" fill="#173d5c" />
        <circle cx="132" cy="78" r="10" />
        <circle cx="190" cy="30" r="7" />
        <circle cx="168" cy="118" r="7" />
        <circle cx="68" cy="120" r="6" />
      </g>
    </svg>
  );
}
