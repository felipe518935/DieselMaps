import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { stationsAPI } from '../api/auth.js';

export default function PriceHistoryChart({ stationId, refreshKey }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationId) return;
    setLoading(true);
    stationsAPI
      .getHistory(stationId)
      .then(({ data }) => {
        setHistory(
          data
            .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))
            .map((item) => ({
              ...item,
              date: new Date(item.recordedAt).toLocaleDateString('es-CO'),
            })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stationId, refreshKey]);

  if (loading) {
    return <p className="text-muted">Cargando historial...</p>;
  }

  if (!history.length) {
    return <p className="text-muted">No hay historial de precios disponible.</p>;
  }

  const fuelTypes = [...new Set(history.map((item) => item.fuelType))];
  const colors = {
    CORRIENTE: '#0ea5e9',
    EXTRA: '#38bdf8',
    DIESEL: '#22c55e',
    GAS: '#f97316',
  };

  return (
    <div style={{ width: '100%', minHeight: '320px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 10, right: 24, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ background: '#0f1727', borderRadius: '18px', border: '1px solid rgba(148, 163, 184, 0.2)' }} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#f8fafc' }} />
          {fuelTypes.map((fuelType) => (
            <Line
              key={fuelType}
              type="monotone"
              dataKey="priceCop"
              data={history.filter((entry) => entry.fuelType === fuelType)}
              name={fuelType}
              stroke={colors[fuelType] || '#cbd5e1'}
              strokeWidth={3}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '18px' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: '#e2e8f0' }}>Registro de cambios</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {history.slice(0, 5).map((entry, index) => (
            <div key={`${entry.recordedAt}-${index}`} style={{ padding: '12px 14px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#cbd5e1' }}>
                <span>{entry.date}</span>
                <strong>{entry.fuelType}</strong>
              </div>
              <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>${entry.priceCop.toLocaleString('es-CO')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
