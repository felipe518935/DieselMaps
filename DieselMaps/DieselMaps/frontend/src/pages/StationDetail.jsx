import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stationsAPI, authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import PriceTag from '../components/PriceTag';
import Navbar from '../components/Navbar';

export default function StationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [priceForm, setPriceForm] = useState({ fuelType: 'DIESEL', priceCop: '' });

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const { data } = await stationsAPI.getById(id);
        setStation(data);
      } catch (err) {
        setError('Error al cargar la estación');
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [id]);

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    setUpdatingPrice(true);
    try {
      await stationsAPI.updatePrice(id, {
        fuelType: priceForm.fuelType,
        priceCop: parseFloat(priceForm.priceCop),
      });
      // Recargar estación
      const { data } = await stationsAPI.getById(id);
      setStation(data);
      setPriceForm({ fuelType: 'DIESEL', priceCop: '' });
      alert('Precio actualizado correctamente');
    } catch (err) {
      alert('Error al actualizar el precio');
    } finally {
      setUpdatingPrice(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Estación no encontrada'}
          </div>
          <button
            onClick={() => navigate('/map')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ← Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  const canUpdatePrice =
    user && (user.role === 'OPERATOR' || user.role === 'ADMIN') &&
    (user.username === station.operatorUsername || user.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={() => navigate('/map')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
        >
          ← Volver al Mapa
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
            <p className="text-gray-800 mt-2">{station.brand}</p>

            <div className="flex gap-4 mt-4">
              <span
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  station.available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {station.available ? '✓ Disponible' : '✗ Cerrada'}
              </span>
              <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 text-sm font-medium">
                Operador: {station.operatorUsername}
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6 pb-6 border-b">
            <p className="text-gray-900">
              <span className="font-semibold">Dirección:</span> {station.address}
            </p>
            <p className="text-gray-900 mt-2">
              <span className="font-semibold">Coordenadas:</span> {station.latitude}, {station.longitude}
            </p>
          </div>

          {/* Prices */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Precios Actuales</h2>
            <div className="grid grid-cols-2 gap-4">
              {station.prices?.map((price) => (
                <div key={price.fuelType} className="bg-gray-50 p-4 rounded-lg">
                  <PriceTag fuelType={price.fuelType} price={price.priceCop} />
                  {price.prevPriceCop && (
                    <p className="text-xs text-gray-700 mt-2">
                      Anterior: ${price.prevPriceCop.toLocaleString('es-CO')} COP
                    </p>
                  )}
                  {price.recordedAt && (
                    <p className="text-xs text-gray-700">
                      Actualizado: {new Date(price.recordedAt).toLocaleString('es-CO')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Update Price Form - Only for Operator */}
          {canUpdatePrice && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Actualizar Precio</h3>
              <form onSubmit={handlePriceUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tipo de Combustible
                  </label>
                  <select
                    value={priceForm.fuelType}
                    onChange={(e) => setPriceForm({ ...priceForm, fuelType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CORRIENTE">CORRIENTE</option>
                    <option value="EXTRA">EXTRA</option>
                    <option value="DIESEL">DIESEL</option>
                    <option value="GAS">GAS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Precio (COP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceForm.priceCop}
                    onChange={(e) => setPriceForm({ ...priceForm, priceCop: e.target.value })}
                    placeholder="10500.50"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPrice}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {updatingPrice ? 'Actualizando...' : 'Actualizar Precio'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
