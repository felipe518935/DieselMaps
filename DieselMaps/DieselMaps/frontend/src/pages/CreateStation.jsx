import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import MapView from '../components/MapView.jsx';
import { stationsAPI } from '../api/auth.js';
import { useGeolocation } from '../hooks/useGeolocation.js';

const defaultPrices = [
  { fuelType: 'DIESEL', label: 'Diésel' },
  { fuelType: 'CORRIENTE', label: 'Corriente' },
  { fuelType: 'EXTRA', label: 'Extra' },
];

export default function CreateStation() {
  const navigate = useNavigate();
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [form, setForm] = useState({ name: '', brand: '', address: '', latitude: '', longitude: '' });
  const [prices, setPrices] = useState({ DIESEL: '', CORRIENTE: '', EXTRA: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userLocation = location || { latitude: 4.711, longitude: -74.0721 };
  const previewStation = form.latitude && form.longitude ? [{
    id: 'preview',
    name: form.name || 'Nueva estación',
    address: form.address || 'Ubicación seleccionada',
    latitude: form.latitude,
    longitude: form.longitude,
    available: true,
    prices: Object.entries(prices)
      .filter(([, value]) => value !== '')
      .map(([fuelType, value]) => ({ fuelType, priceCop: Number(value) })),
  }] : [];

  useEffect(() => {
    if (!geoLoading && geoError && !form.latitude && !form.longitude) {
      setForm((current) => ({ ...current, latitude: String(userLocation.latitude), longitude: String(userLocation.longitude) }));
    }
  }, [geoLoading, geoError, userLocation.latitude, userLocation.longitude]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      name: form.name,
      brand: form.brand,
      address: form.address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      prices: Object.entries(prices)
        .filter(([, value]) => value !== '')
        .map(([fuelType, value]) => ({ fuelType, priceCop: Number(value) })),
    };

    try {
      await stationsAPI.create(payload);
      setSuccess('Estación creada correctamente.');
      setTimeout(() => navigate('/map'), 800);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al registrar la estación.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = ({ latitude, longitude, address }) => {
    setForm((current) => ({
      ...current,
      latitude: String(latitude),
      longitude: String(longitude),
      address: address || current.address,
    }));
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame" style={{ paddingTop: '24px' }}>
        <div className="section-header">
          <div>
            <h2>Registrar nueva estación</h2>
            <p style={{ color: '#94a3b8' }}>Registra coordenadas, nombre de estación y precios de combustible. Haz clic en el mapa para ajustar la ubicación.</p>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
          <div className="card" style={{ padding: '32px' }}>
            {error && <div className="alert">{error}</div>}
            {success && <div className="success-alert">{success}</div>}

            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <div className="form-field">
                <label>Nombre de estación</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Marca</label>
                <input
                  className="input"
                  value={form.brand}
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Dirección</label>
                <input
                  className="input"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                />
              </div>
              <div className="grid-2" style={{ gap: '18px' }}>
                <div className="form-field">
                  <label>Latitud</label>
                  <input
                    type="number"
                    className="input"
                    value={form.latitude}
                    onChange={(event) => setForm({ ...form, latitude: event.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Longitud</label>
                  <input
                    type="number"
                    className="input"
                    value={form.longitude}
                    onChange={(event) => setForm({ ...form, longitude: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="section-header" style={{ marginTop: '18px' }}>
                <h3>Precios de combustible</h3>
              </div>
              <div className="grid-3" style={{ gap: '16px' }}>
                {defaultPrices.map((item) => (
                  <div key={item.fuelType} className="form-field">
                    <label>{item.label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input"
                      value={prices[item.fuelType]}
                      onChange={(event) => setPrices({ ...prices, [item.fuelType]: event.target.value })}
                      placeholder="Precio COP"
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="button button-primary" disabled={loading}>{loading ? 'Guardando...' : 'Registrar estación'}</button>
            </form>
          </div>

          <div className="card" style={{ padding: '24px', minHeight: '560px' }}>
            <div className="section-header">
              <h3>Mapa de ubicación</h3>
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>Haz clic en el mapa para ajustar latitud y longitud.</p>
            <div style={{ height: '460px', borderRadius: '18px', overflow: 'hidden' }}>
              <MapView
                stations={previewStation}
                activeStation={previewStation[0]}
                userLocation={userLocation}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
