import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', birthDate: '', role: 'USER' });
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
      const { data } = await authAPI.register(form);
      login({ username: data.username, role: data.role }, data.token);
    } catch (err) {
      const payload = err.response?.data;
      setError(payload?.message || payload?.error || 'No se pudo registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame" style={{ paddingTop: '24px' }}>
        <div className="card" style={{ padding: '32px', maxWidth: '560px', margin: '0 auto' }}>
          <div className="section-header">
            <div>
              <h2>Comienza tu experiencia</h2>
              <p style={{ color: '#94a3b8' }}>Registra tu cuenta como usuario o como operador.</p>
            </div>
          </div>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
            <div className="form-field">
              <label>Rol</label>
              <select className="select" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="USER">Usuario</option>
                <option value="OPERATOR">Operador</option>
              </select>
            </div>
            <div className="form-field">
              <label>Usuario</label>
              <input
                className="input"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Correo</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Contraseña</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Teléfono</label>
              <input
                type="tel"
                className="input"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                className="input"
                value={form.birthDate}
                onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
                required
              />
            </div>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ marginTop: '22px', color: '#94a3b8' }}>
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="button-secondary" style={{ padding: '10px 16px' }} onClick={() => navigate('/login')}>
              Ingresar
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
