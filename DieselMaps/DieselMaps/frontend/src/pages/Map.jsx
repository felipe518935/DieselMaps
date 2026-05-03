import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import MapView from '../components/MapView.jsx';
import { stationsAPI, usersAPI } from '../api/auth.js';
import { useGeolocation } from '../hooks/useGeolocation.js';

const defaultLocation = { latitude: 4.711, longitude: -74.0721 };

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

export default function Map() {
  const { user } = useAuth();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [stations, setStations] = useState([]);
  const [activeStation, setActiveStation] = useState(null);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [efficiency, setEfficiency] = useState(10);
  const [error, setError] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const userLocation = location || defaultLocation;
  const nearestStation = stations[0] || null;

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavoriteIds([]);
        return;
      }
      try {
        const { data } = await usersAPI.getFavorites();
        setFavoriteIds(data.map((station) => station.id));
      } catch (err) {
        console.warn('No se pudo cargar favoritos', err);
      }
    }
    loadFavorites();
  }, [user]);

  useEffect(() => {
    async function fetchStations() {
      try {
        const { data } = await stationsAPI.getNearby(userLocation.latitude, userLocation.longitude, 15);
        const sortedStations = (data || []).slice().sort((a, b) => {
          const distA = getDistanceKm(userLocation.latitude, userLocation.longitude, Number(a.latitude), Number(a.longitude));
          const distB = getDistanceKm(userLocation.latitude, userLocation.longitude, Number(b.latitude), Number(b.longitude));
          return distA - distB;
        });
        setStations(sortedStations);
        if (!selectedFuel && sortedStations[0]?.prices?.length) {
          setSelectedFuel(sortedStations[0].prices[0].fuelType);
        }
      } catch (err) {
        setError('No se pudieron cargar las estaciones.');
      }
    }

    if (!geoLoading) {
      fetchStations();
    }
  }, [userLocation, geoLoading, selectedFuel]);

  const toggleFavorite = async (stationId) => {
    if (!user) {
      setFavoriteMessage('Debes iniciar sesión para agregar favoritos.');
      return;
    }

    try {
      await usersAPI.toggleFavorite(stationId);
      setFavoriteIds((current) =>
        current.includes(stationId) ? current.filter((id) => id !== stationId) : [...current, stationId],
      );
      setFavoriteMessage('Favorito actualizado correctamente.');
      setTimeout(() => setFavoriteMessage(''), 2500);
    } catch (err) {
      setFavoriteMessage('No se pudo actualizar favorito.');
    }
  };

  const handleStationSelect = (station) => {
    setActiveStation(station);
    if (!selectedFuel && station.prices?.length) {
      setSelectedFuel(station.prices[0].fuelType);
    }
  };

  const selectedDistance = activeStation
    ? getDistanceKm(userLocation.latitude, userLocation.longitude, Number(activeStation.latitude), Number(activeStation.longitude))
    : 0;
  const fuelNeeded = activeStation && efficiency > 0 ? selectedDistance / efficiency : 0;
  const selectedPriceObj = activeStation?.prices?.find((price) => price.fuelType === selectedFuel);
  const estimatedCost = selectedPriceObj ? fuelNeeded * selectedPriceObj.priceCop : null;

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame" style={{ padding: '0 0 40px' }}>
        <div className="section-header" style={{ gap: '12px' }}>
          <div>
            <h2>Mapa de estaciones</h2>
            <p style={{ color: '#94a3b8' }}>
              {geoError
                ? 'Ubicación no disponible. Mostrando estaciones aproximadas.'
                : 'Selecciona una estación y calcula tu recorrido, consumo y costo de combustible.'}
            </p>
          </div>
        </div>

        {favoriteMessage && <div className="success-alert" style={{ marginBottom: '18px' }}>{favoriteMessage}</div>}
        {error && <div className="alert" style={{ marginBottom: '18px' }}>{error}</div>}

        <div className="grid-2" style={{ gap: '24px', minHeight: 'calc(100vh - 160px)' }}>
          <section className="panel" style={{ padding: '24px', minHeight: '100%' }}>
            <div className="section-header">
              <div>
                <h3>Estaciones cercanas</h3>
                <p style={{ color: '#94a3b8' }}>Explora todas las estaciones y elige cuál quieres visitar.</p>
              </div>
            </div>

            {nearestStation ? (
              <div className="map-info-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Estación más cercana</h4>
                    <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>{nearestStation.name}</p>
                    <p style={{ margin: '12px 0 0', color: '#cbd5e1' }}>{nearestStation.address}</p>
                  </div>
                  <div style={{ display: 'grid', gap: '6px', textAlign: 'right' }}>
                    <span className={`status-pill ${nearestStation.available ? 'status-active' : 'status-closed'}`}>
                      {nearestStation.available ? 'Abierta' : 'Cerrada'}
                    </span>
                    <span className="price-pill">{getDistanceKm(userLocation.latitude, userLocation.longitude, Number(nearestStation.latitude), Number(nearestStation.longitude)).toFixed(1)} km</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '24px' }}>No se encontraron estaciones cercanas.</div>
            )}

            <div className="section-header" style={{ marginTop: '18px' }}>
              <div>
                <h3>Ruta seleccionada</h3>
                <p style={{ color: '#94a3b8' }}>Selecciona una estación para mostrar la línea y el costo.</p>
              </div>
            </div>

            {activeStation ? (
              <div className="map-info-card" style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '12px' }}>{activeStation.name}</h4>
                <p style={{ margin: '0 0 16px', color: '#94a3b8' }}>{activeStation.address}</p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Distancia estimada</span>
                    <strong>{selectedDistance.toFixed(1)} km</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Consumo por km</span>
                    <strong>{efficiency} km/L</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Litros necesarios</span>
                    <strong>{fuelNeeded ? fuelNeeded.toFixed(2) : '0.00'} L</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                    <span>Costo estimado</span>
                    <strong>{estimatedCost ? `$${estimatedCost.toLocaleString('es-CO')}` : 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{ color: '#94a3b8' }}>Tipo de combustible</label>
                    <select
                      value={selectedFuel}
                      onChange={(event) => setSelectedFuel(event.target.value)}
                      className="input"
                      style={{ background: '#0f172a', color: '#e2e8f0', borderColor: '#334155' }}
                    >
                      {activeStation.prices?.map((price) => (
                        <option key={price.fuelType} value={price.fuelType}>
                          {price.fuelType} - ${price.priceCop.toLocaleString('es-CO')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{ color: '#94a3b8' }}>Eficiencia de tu vehículo (km/L)</label>
                    <input
                      type="number"
                      min="1"
                      value={efficiency}
                      onChange={(event) => setEfficiency(Number(event.target.value))}
                      className="input"
                      style={{ background: '#0f172a', color: '#e2e8f0', borderColor: '#334155' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '24px' }}>Selecciona una estación para calcular tu viaje.</div>
            )}

            <div className="section-header" style={{ marginTop: '18px' }}>
              <div>
                <h3>Lista de estaciones</h3>
                <p style={{ color: '#94a3b8' }}>Haz clic en cualquier estación para activarla en el mapa.</p>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '18px' }}>
              {stations.map((station) => {
                const distanceKm = getDistanceKm(userLocation.latitude, userLocation.longitude, Number(station.latitude), Number(station.longitude));
                const isFavorite = favoriteIds.includes(station.id);
                return (
                  <div
                    key={station.id}
                    className={`card card-hover ${activeStation?.id === station.id ? 'card-selected' : ''}`}
                    onClick={() => handleStationSelect(station)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{station.name}</h4>
                        <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>{station.brand || 'Marca no registrada'}</p>
                        <p style={{ margin: '10px 0 0', color: '#cbd5e1', fontSize: '0.95rem' }}>{station.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(station.id);
                        }}
                        className="button-secondary"
                        style={{ whiteSpace: 'nowrap', height: '40px', alignSelf: 'flex-start' }}
                      >
                        {isFavorite ? 'Quitar favorito' : 'Favorito'}
                      </button>
                    </div>
                    <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
                        <span>{distanceKm.toFixed(1)} km</span>
                        <span>{station.available ? 'Abierta' : 'Cerrada'}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {station.prices?.slice(0, 3).map((price) => (
                          <span key={price.fuelType} className="price-pill">
                            {price.fuelType} ${price.priceCop.toLocaleString('es-CO')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel" style={{ padding: '0', minHeight: '100%' }}>
            <MapView
              stations={stations}
              activeStation={activeStation}
              userLocation={userLocation}
              favoriteIds={favoriteIds}
              onSelectStation={handleStationSelect}
              onToggleFavorite={toggleFavorite}
              routeTarget={activeStation}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
