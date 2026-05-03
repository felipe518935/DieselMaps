const labelMap = {
  CORRIENTE: 'Corriente',
  EXTRA: 'Extra',
  DIESEL: 'Diésel',
  GAS: 'Gas',
};

export default function PriceTag({ fuelType, price }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '10px 14px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '14px', color: '#e2e8f0', marginBottom: '6px' }}>
      <span style={{ fontWeight: 700 }}>{labelMap[fuelType] || fuelType}</span>
      <span style={{ color: '#38bdf8' }}>${Number(price).toLocaleString('es-CO')}</span>
    </div>
  );
}
