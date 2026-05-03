import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/map');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login({ username: data.username, role: data.role }, data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame" style={{ paddingTop: '24px' }}>
        <div className="card" style={{ padding: '32px', maxWidth: '520px', margin: '0 auto' }}>
          <div className="section-header">
            <div>
              <h2>Bienvenido de nuevo</h2>
              <p style={{ color: '#94a3b8' }}>Ingresa tus credenciales para acceder a DieselMaps.</p>
            </div>
          </div>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
            <div className="form-field">
              <label>Usuario</label>
              <input
                type="text"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                className="input"
                required
              />
            </div>
            <div className="form-field">
              <label>Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="input"
                required
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p style={{ marginTop: '22px', color: '#94a3b8' }}>
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/register')} className="button-secondary" style={{ padding: '10px 16px' }}>
              Regístrate
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
