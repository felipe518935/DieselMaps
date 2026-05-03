import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { stationsAPI } from '../api/auth.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import PriceTag from '../components/PriceTag.jsx';
import PriceHistoryChart from '../components/PriceHistoryChart.jsx';

const defaultLocation = { latitude: 4.711, longitude: -74.0721 };

export default function Compare() {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStations() {
      try {
        const coords = location || defaultLocation;
        const { data } = await stationsAPI.getNearby(coords.latitude, coords.longitude, 10);
        setStations(data || []);
        setSelected(data?.[0] || null);
      } catch (err) {
        setError('No se pudieron cargar las estaciones para comparar.');
      } finally {
        setLoading(false);
      }
    }

    if (!geoLoading) {
      loadStations();
    }
  }, [location, geoLoading]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <div className="section-header">
          <div>
            <h2>Comparar estaciones</h2>
            <p style={{ color: '#94a3b8' }}>
              Revisa hasta tres estaciones cercanas y visualiza sus precios históricos.
            </p>
          </div>
        </div>

        {geoError && <div className="alert">{geoError}</div>}
        {loading ? (
          <div className="card" style={{ padding: '28px' }}>Cargando comparativa...</div>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : (
          <div className="grid-2" style={{ gap: '24px' }}>
            <section className="panel" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '18px' }}>Estaciones destacadas</h3>
              <div className="grid-2" style={{ gap: '16px' }}>
                {stations.slice(0, 4).map((station) => (
                  <div key={station.id} className="card card-hover" style={{ padding: '18px' }} onClick={() => setSelected(station)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
                      <div>
                        <strong>{station.name}</strong>
                        <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>{station.address}</p>
                      </div>
                      <span className={`status-pill ${station.available ? 'status-active' : 'status-closed'}`}>
                        {station.available ? 'Activa' : 'Cerrada'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                      {station.prices?.slice(0, 2).map((price) => (
                        <PriceTag key={price.fuelType} fuelType={price.fuelType} price={price.priceCop} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel" style={{ padding: '24px' }}>
              <div className="section-header">
                <h3>Detalle seleccionado</h3>
              </div>
              {selected ? (
                <>
                  <p style={{ color: '#cbd5e1' }}>Comparando <strong>{selected.name}</strong>.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '18px 0' }}>
                    {selected.prices?.map((price) => (
                      <PriceTag key={price.fuelType} fuelType={price.fuelType} price={price.priceCop} />
                    ))}
                  </div>
                  <PriceHistoryChart stationId={selected.id} />
                </>
              ) : (
                <p className="text-muted">Selecciona una estación para ver su historial.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
