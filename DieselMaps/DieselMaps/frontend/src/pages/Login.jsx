import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login(form);
      login({ username: data.username, role: data.role }, data.token);
      navigate('/map');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="panel overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-8 text-white text-center rounded-t-2xl">
            <h1 className="text-4xl font-bold mb-2">⛽ Diesel Maps</h1>
            <p className="text-sm opacity-90">Sistema de Precios de Combustible</p>
          </div>

          {/* Body */}
          <div className="p-8">
            {error && (
              <div className="panel-alert">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-950 mb-2">
                  👤 Nombre de Usuario
                </label>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-modern"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-950 mb-2">
                  🔒 Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-modern"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    Ingresando...
                  </>
                ) : (
                  <>
                    🚀 Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'rgba(15, 23, 43, 0.12)' }}></div>

            {/* Sign Up Link */}
            <p className="text-center text-sm" style={{ color: 'var(--text-light)' }}>
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-bold" style={{ color: 'var(--secondary)' }}
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
