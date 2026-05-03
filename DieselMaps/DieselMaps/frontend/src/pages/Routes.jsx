import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { stationsAPI } from '../api/auth.js';
import Navbar from '../components/Navbar.jsx';
import MapView from '../components/MapView.jsx';

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Routes() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);
  const [efficiency, setEfficiency] = useState(40);
  const [selectedFuel, setSelectedFuel] = useState('');

  const selectedStation = selectedStations[0] || null;
  const routeDistanceKm = useMemo(() => {
    if (!selectedStation || !location) return 0;
    return getDistanceKm(location.latitude, location.longitude, Number(selectedStation.latitude), Number(selectedStation.longitude));
  }, [selectedStation, location]);

  const consumption = selectedStation && efficiency > 0 ? routeDistanceKm / efficiency : null;
  const selectedPriceObj = selectedStation?.prices?.find((p) => p.fuelType === selectedFuel);
  const cost = consumption && selectedPriceObj ? consumption * selectedPriceObj.priceCop : null;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!location || geoLoading) return;

    const fetchStations = async () => {
      setLoadingStations(true);
      try {
        const { data } = await stationsAPI.getNearby(location.latitude, location.longitude, 15);
        setStations(data || []);
      } catch (error) {
        console.error('Error cargando estaciones:', error);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchStations();
  }, [location, geoLoading]);

  useEffect(() => {
    if (selectedStation?.prices?.length) {
      setSelectedFuel(selectedStation.prices[0].fuelType);
    } else {
      setSelectedFuel('');
    }
  }, [selectedStation]);

  const toggleStation = (station) => {
    if (selectedStations.find((s) => s.id === station.id)) {
      setSelectedStations(selectedStations.filter((s) => s.id !== station.id));
    } else if (selectedStations.length < 3) {
      setSelectedStations([...selectedStations, station]);
    }
  };

  if (authLoading || geoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center bounce-in">
          <div className="spinner mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-light)' }} className="font-medium">Cargando planificador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <div className="section-header">
          <div>
            <h2>Planificación de rutas</h2>
            <p style={{ color: '#94a3b8' }}>
              {geoError ? 'Mostrando estaciones aproximadas cerca de tu ubicación.' : 'Selecciona estaciones para ver la ruta y el costo de viaje.'}
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '22px' }}>
          <section className="panel" style={{ padding: '28px' }}>
            <h3 style={{ marginBottom: '18px' }}>Estaciones cercanas</h3>
            {loadingStations ? (
              <div className="card" style={{ padding: '22px' }}>Cargando estaciones...</div>
            ) : stations.length > 0 ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {stations.map((station) => {
                  const isSelected = selectedStations.some((s) => s.id === station.id);
                  return (
                    <div
                      key={station.id}
                      className={`card card-small ${isSelected ? 'card-selected' : ''}`}
                      onClick={() => toggleStation(station)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <strong>{station.name}</strong>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>{station.address}</p>
                      </div>
                      <div>{isSelected ? 'Seleccionada' : 'Seleccionar'}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="alert">No se encontraron estaciones cercanas.</div>
            )}
          </section>

          <section className="panel" style={{ padding: '28px' }}>
            <h3 style={{ marginBottom: '18px' }}>Cálculo de ruta</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Eficiencia (km/L)</label>
                <input
                  type="number"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="input-field"
                  min="1"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Combustible</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecciona un combustible</option>
                  {selectedStation?.prices?.map((price) => (
                    <option key={price.fuelType} value={price.fuelType}>
                      {price.fuelType} - ${price.priceCop.toLocaleString('es-CO')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <p style={{ marginBottom: '10px', color: '#94a3b8' }}>Distancia estimada</p>
                <p style={{ fontSize: '1.6rem', margin: 0 }}>{selectedStation ? `${routeDistanceKm.toFixed(1)} km` : '-'}</p>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <p style={{ marginBottom: '10px', color: '#94a3b8' }}>Consumo estimado</p>
                <p style={{ fontSize: '1.6rem', margin: 0 }}>{consumption ? `${consumption.toFixed(2)} L` : '-'}</p>
              </div>
              <div className="card" style={{ padding: '20px' }}>
                <p style={{ marginBottom: '10px', color: '#94a3b8' }}>Costo estimado</p>
                <p style={{ fontSize: '1.6rem', margin: 0 }}>{cost ? `$${cost.toLocaleString('es-CO')}` : '-'}</p>
              </div>
            </div>
          </section>

          <section className="panel" style={{ padding: '28px' }}>
            <h3 style={{ marginBottom: '18px' }}>Mapa de la ruta</h3>
            <MapView
              stations={stations}
              userLocation={location}
              activeStation={selectedStation}
              routeTargets={selectedStations}
              onSelectStation={toggleStation}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
