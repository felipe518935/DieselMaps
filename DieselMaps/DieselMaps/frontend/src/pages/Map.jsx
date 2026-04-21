import { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { stationsAPI } from '../api/auth';
import MapView from '../components/MapView';
import StationCard from '../components/StationCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Map() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { location, loading: geoLoading } = useGeolocation();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!location || geoLoading) return;

    const fetchStations = async () => {
      setLoading(true);
      try {
        const { data } = await stationsAPI.getNearby(
          location.latitude,
          location.longitude,
          radiusKm
        );
        setStations(data);
      } catch (error) {
        console.error('Error cargando estaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [location, radiusKm, geoLoading]);

  if (authLoading || geoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg)'}}>
        <div className="text-center bounce-in">
          <div className="spinner mx-auto mb-4"></div>
          <p style={{color: 'var(--text-light)'}} className="font-medium">Cargando Diesel Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'var(--bg)'}}>
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <div className="card map-container mb-6 fade-in">
              <MapView
                stations={stations}
                onStationClick={setSelectedStation}
                userLocation={location}
                selectedStation={selectedStation}
              />
            </div>

            {/* Controls */}
            <div className="card p-6 fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--text)'}}>
                    <span style={{color: 'var(--secondary)'}}>🔍</span> Radio de búsqueda:
                    <span className="font-bold" style={{color: 'var(--primary)'}}>{radiusKm} km</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full sm:w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-slate-800 font-medium flex items-center gap-1">
                    <span style={{color: 'var(--secondary)'}}>📍</span> {stations.length} estaciones encontradas
                  </p>
                  {loading && (
                    <p className="text-xs animate-pulse mt-1" style={{color: 'var(--primary)'}}>
                      🔄 Actualizando...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {selectedStation ? (
              <div className="card p-6 fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="text-xl font-bold mb-4 flex items-center justify-between" style={{color: 'var(--text)'}}>
                  <span className="flex items-center gap-2">
                    <span style={{color: 'var(--secondary)'}}>📋</span> Detalles de la Estación
                  </span>
                  <button
                    onClick={() => setSelectedStation(null)}
                    className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full hover:scale-110 transform duration-200"
                  >
                    ✕
                  </button>
                </h2>
                <StationCard station={selectedStation} />
              </div>
            ) : (
              <div className="card p-6 fade-in" style={{animationDelay: '0.2s', borderLeft: `4px solid var(--primary)`}}>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span style={{color: 'var(--accent)'}}>💡</span> <span>Consejo Útil</span>
                </h3>
                <p className="text-sm leading-relaxed" style={{color: 'var(--text-light)'}}>
                  Haz clic en un marcador del mapa para ver los detalles completos de la estación de servicio y comparar precios.
                </p>
              </div>
            )}

            {/* Lista de estaciones */}
            <div className="card p-6 fade-in" style={{animationDelay: '0.3s'}}>
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2" style={{color: 'var(--text)'}}>
                <span style={{color: 'var(--secondary)'}}>🗺️</span> Estaciones Cercanas
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-slate-100">
                {stations.length > 0 ? (
                  stations.map((station, index) => (
                    <div
                      key={station.id}
                      onClick={() => setSelectedStation(station)}
                      className="station-item"
                      style={{animationDelay: `${0.4 + index * 0.05}s`}}
                    >
                      <p className="font-semibold text-sm mb-1" style={{color: 'var(--text)'}}>{station.name}</p>
                      <p className="text-xs flex items-center gap-1 mb-2" style={{color: 'var(--text-light)'}}>
                        <span style={{color: 'var(--secondary)'}}>🏷️</span> {station.brand}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className={station.available ? 'status-available' : 'status-closed'}>
                          {station.available ? '✅ Disponible' : '❌ Cerrada'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🚫</div>
                    <p className="text-sm text-slate-700 mb-2 font-medium">No hay estaciones cercanas</p>
                    <p className="text-xs text-slate-600">Intenta aumentar el radio de búsqueda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
