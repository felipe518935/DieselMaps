import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    role: 'USER',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const { data } = await authAPI.register(form);
      login({ username: data.username, role: data.role }, data.token);
      navigate('/map');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ submit: 'Error al registrarse' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)', padding: '3rem 1rem' }}>
      <div className="panel w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">⛽ Diesel Maps</h1>
        <p className="text-center text-slate-700 text-sm mb-6">
          Crea tu cuenta para comenzar
        </p>

        {errors.submit && (
          <div className="panel-alert">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Selecciona tu Rol *
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label htmlFor="role-user" className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition" style={{borderColor: form.role === 'USER' ? 'var(--secondary)' : 'rgba(15, 23, 43, 0.16)', background: form.role === 'USER' ? 'rgba(59, 130, 246, 0.08)' : 'transparent'}}>
                <input
                  id="role-user"
                  type="radio"
                  name="role"
                  value="USER"
                  checked={form.role === 'USER'}
                  onChange={handleChange}
                  className="mr-2 accent-secondary"
                />
                <span className="text-sm font-medium text-slate-950">👤 Usuario</span>
              </label>
              <label htmlFor="role-operator" className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition" style={{borderColor: form.role === 'OPERATOR' ? 'var(--accent)' : 'rgba(15, 23, 43, 0.16)', background: form.role === 'OPERATOR' ? 'rgba(245, 158, 11, 0.08)' : 'transparent'}}>
                <input
                  id="role-operator"
                  type="radio"
                  name="role"
                  value="OPERATOR"
                  checked={form.role === 'OPERATOR'}
                  onChange={handleChange}
                  className="mr-2 accent-accent"
                />
                <span className="text-sm font-medium text-slate-950">🛠️ Operador</span>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              placeholder="juan_doe"
              value={form.username}
              onChange={handleChange}
              className="input-modern"
              required
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              className="input-modern"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2">
              Contraseña (Min 8 caracteres, incluir mayúscula)
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="input-modern"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+57 301 234 5678"
              value={form.phone}
              onChange={handleChange}
              className="input-modern"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="input-modern"
              required
            />
            {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm" style={{ color: 'var(--text-light)', marginTop: '1.5rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--secondary)' }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
