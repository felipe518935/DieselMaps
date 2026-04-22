export default function PriceTag({ price, fuelType }) {
  const fuelStyles = {
    CORRIENTE: {
      bg: 'linear-gradient(135deg, var(--accent), #fbbf24)',
      text: '#92400e',
      emoji: '⛽',
      border: 'var(--accent)'
    },
    EXTRA: {
      bg: 'linear-gradient(135deg, #dc2626, #f87171)',
      text: '#7f1d1d',
      emoji: '🔴',
      border: '#dc2626'
    },
    DIESEL: {
      bg: 'linear-gradient(135deg, var(--secondary), #34d399)',
      text: '#064e3b',
      emoji: '💨',
      border: 'var(--secondary)'
    },
    GAS: {
      bg: 'linear-gradient(135deg, #10b981, #34d399)',
      text: '#064e3b',
      emoji: '💨',
      border: '#10b981'
    },
  };

  const style = fuelStyles[fuelType] || fuelStyles.CORRIENTE;

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
      style={{
        background: style.bg,
        color: style.text,
        border: `2px solid ${style.border}`,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`
      }}
    >
      <span className="text-lg">{style.emoji}</span>
      <span>{fuelType}:</span>
      <span className="text-lg font-extrabold">
        ${price.toLocaleString('es-CO')} COP
      </span>
    </div>
  );
}
