import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import PriceTag from '../components/PriceTag.jsx';
import PriceHistoryChart from '../components/PriceHistoryChart.jsx';
import { stationsAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

const allowedFuelTypes = ['DIESEL', 'CORRIENTE', 'EXTRA', 'GAS'];

export default function StationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [priceSuccess, setPriceSuccess] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('DIESEL');
  const [newPrice, setNewPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  useEffect(() => {
    async function loadStation() {
      try {
        const { data } = await stationsAPI.getById(id);
        setStation(data);
      } catch (err) {
        setError('No se pudo cargar la estación.');
      } finally {
        setLoading(false);
      }
    }
    loadStation();
  }, [id]);

  useEffect(() => {
    if (station?.prices?.length > 0) {
      setSelectedFuel(station.prices[0].fuelType);
      setNewPrice(station.prices[0].priceCop ?? '');
    }
  }, [station]);

  const handlePriceUpdate = async (event) => {
    event.preventDefault();
    setPriceError('');
    setPriceSuccess('');

    if (!selectedFuel) {
      setPriceError('Selecciona un tipo de combustible.');
      return;
    }
    if (!newPrice || Number(newPrice) <= 0) {
      setPriceError('Ingresa un precio válido.');
      return;
    }

    setSavingPrice(true);
    try {
      const payload = {
        fuelType: selectedFuel,
        priceCop: Number(newPrice),
      };
      const { data } = await stationsAPI.updatePrice(id, payload);
      setStation((current) => ({
        ...current,
        prices: current.prices?.map((price) =>
          price.fuelType === data.fuelType ? { ...price, priceCop: data.priceCop } : price,
        ) ?? [{ fuelType: data.fuelType, priceCop: data.priceCop }],
      }));
      setPriceSuccess(`Precio de ${selectedFuel} actualizado a ${Number(newPrice).toLocaleString('es-CO')}.`);
      setHistoryRefresh((prev) => prev + 1);
    } catch (err) {
      setPriceError(err.response?.data?.message || 'No se pudo actualizar el precio.');
    } finally {
      setSavingPrice(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <div className="section-header">
          <div>
            <h2>Detalle de estación</h2>
            <p style={{ color: '#94a3b8' }}>Consulta información completa y el historial de precios.</p>
          </div>
          <Link to="/map" className="button button-secondary">
            Volver al mapa
          </Link>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '28px' }}>Cargando estación...</div>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : station ? (
          <div className="grid-2" style={{ gap: '24px' }}>
            <section className="panel" style={{ padding: '28px' }}>
              <div className="section-header">
                <div>
                  <h3>{station.name}</h3>
                  <p style={{ color: '#94a3b8' }}>{station.brand || 'Marca no disponible'}</p>
                </div>
                <span className={`status-pill ${station.available ? 'status-active' : 'status-closed'}`}>
                  {station.available ? 'Operativa' : 'Cerrada'}
                </span>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <strong>Dirección</strong>
                  <p style={{ margin: '6px 0 0', color: '#cbd5e1' }}>{station.address || 'Sin dirección registrada'}</p>
                </div>
                <div>
                  <strong>Coordenadas</strong>
                  <p style={{ margin: '6px 0 0', color: '#cbd5e1' }}>
                    {Number(station.latitude).toFixed(6)}, {Number(station.longitude).toFixed(6)}
                  </p>
                </div>
                <div>
                  <strong>Última actualización</strong>
                  <p style={{ margin: '6px 0 0', color: '#cbd5e1' }}>
                    {station.updatedAt ? new Date(station.updatedAt).toLocaleString('es-CO') : 'N/A'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ margin: 0, marginBottom: '14px' }}>Precios activos</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {station.prices?.length ? (
                    station.prices.map((price) => (
                      <PriceTag key={price.fuelType} fuelType={price.fuelType} price={price.priceCop} />
                    ))
                  ) : (
                    <p style={{ color: '#94a3b8' }}>No hay precios registrados.</p>
                  )}
                </div>
              </div>

              {user?.role === 'OPERATOR' && (
                <div style={{ marginTop: '26px', padding: '22px', borderRadius: '18px', background: '#0f172a', color: '#e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h4 style={{ margin: 0 }}>Actualizar precio</h4>
                    <span className="status-pill status-active">Operador</span>
                  </div>
                  {priceError && <div className="alert" style={{ marginBottom: '14px' }}>{priceError}</div>}
                  {priceSuccess && <div className="success-alert" style={{ marginBottom: '14px' }}>{priceSuccess}</div>}
                  <form onSubmit={handlePriceUpdate} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <label style={{ color: '#94a3b8' }}>Combustible</label>
                      <select
                        value={selectedFuel}
                        onChange={(event) => setSelectedFuel(event.target.value)}
                        className="input"
                        style={{ background: '#0f172a', color: '#e2e8f0', borderColor: '#334155' }}
                      >
                        {allowedFuelTypes.map((fuelType) => (
                          <option key={fuelType} value={fuelType}>{fuelType}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <label style={{ color: '#94a3b8' }}>Nuevo precio COP</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPrice}
                        onChange={(event) => setNewPrice(event.target.value)}
                        className="input"
                        style={{ background: '#0f172a', color: '#e2e8f0', borderColor: '#334155' }}
                      />
                    </div>
                    <button type="submit" className="button button-primary" disabled={savingPrice}>
                      {savingPrice ? 'Guardando...' : 'Guardar precio'}
                    </button>
                  </form>
                </div>
              )}
            </section>

            <section className="panel" style={{ padding: '28px' }}>
              <div className="section-header">
                <h3>Historial de precios</h3>
              </div>
              <PriceHistoryChart stationId={station.id} refreshKey={historyRefresh} />
            </section>
          </div>
        ) : (
          <div className="alert">Estación no encontrada.</div>
        )}
      </main>
    </div>
  );
}
