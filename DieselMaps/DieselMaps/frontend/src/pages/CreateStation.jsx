import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationsAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import GoogleMapPicker from '../components/GoogleMapPicker';

export default function CreateStation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    brand: '',
    latitude: 4.7110,
    longitude: -74.0721,
    address: '',
    prices: {
      CORRIENTE: '',
      EXTRA: '',
      DIESEL: '',
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = useCallback((location) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: location.lat,
      longitude: location.lng,
    }));
  }, []);

  if (!user || (user.role !== 'OPERATOR' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto p-8">
          <div className="panel-alert">
            No tienes permiso para crear estaciones
          </div>
          <button
            onClick={() => navigate('/map')}
            className="btn-secondary mt-4"
          >
            ← Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePriceChange = (fuelType, value) => {
    setForm({
      ...form,
      prices: {
        ...form.prices,
        [fuelType]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const prices = Object.entries(form.prices)
        .filter(([_, value]) => value !== '' && value !== null)
        .map(([fuelType, value]) => ({
          fuelType,
          priceCop: parseFloat(value),
        }));

      if (prices.length === 0) {
        setErrors({ submit: 'Registra al menos un precio de combustible' });
        setLoading(false);
        return;
      }

      const stationData = {
        name: form.name,
        brand: form.brand,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        address: form.address,
        prices,
      };

      await stationsAPI.create(stationData);
      alert('Estación creada exitosamente');
      navigate('/map');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ submit: 'Error al crear la estación' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={() => navigate('/map')}
          className="text-secondary hover:text-primary text-sm font-medium mb-4"
        >
          ← Volver al Mapa
        </button>

        <div className="panel">
          <h1 className="text-3xl font-bold text-slate-950 mb-2">Crear Nueva Estación</h1>
          <p className="text-slate-700 mb-6">
            Completa los datos para registrar una nueva estación de combustible
          </p>

          {errors.submit && (
            <div className="panel-alert">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Nombre de la Estación *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Estación Central"
                className="input-modern"
                required
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Marca (Ej: Terpel, Biomax, Primax)
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Marca de la estación"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>

            <div className="grid gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-900">Precios de combustible</p>
                <p className="text-xs text-slate-500 mt-1">Agrega los precios al registrar la estación</p>
              </div>
              {['CORRIENTE', 'EXTRA', 'DIESEL'].map((fuelType) => (
                <div key={fuelType}>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    {fuelType}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.prices[fuelType]}
                    onChange={(e) => handlePriceChange(fuelType, e.target.value)}
                    placeholder="Ej: 11500"
                    className="input-modern"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Latitud (desde el mapa)
                </label>
                <input
                  type="number"
                  name="latitude"
                  step="0.000001"
                  value={form.latitude}
                  readOnly
                  className="input-modern read-only"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Longitud (desde el mapa)
                </label>
                <input
                  type="number"
                  name="longitude"
                  step="0.000001"
                  value={form.longitude}
                  readOnly
                  className="input-modern read-only"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                📍 Selecciona la Ubicación en el Mapa *
              </label>
              <GoogleMapPicker
                onLocationSelect={handleLocationSelect}
                initialLat={parseFloat(form.latitude)}
                initialLng={parseFloat(form.longitude)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle 50 #10-50, Bogotá"
                className="input-modern"
                required
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="badge-info">
              ✅ <strong>Ubicación seleccionada:</strong> {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creando...' : 'Crear Estación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
