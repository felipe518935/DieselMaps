import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usersAPI } from '../api/auth.js';

const navItems = [
  { label: 'Mapa', path: '/map' },
  { label: 'Rutas', path: '/routes' },
  { label: 'Comparar', path: '/compare' },
  { label: 'Favoritos', path: '/favorites' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const location = useLocation();

  const loadAlerts = async () => {
    if (!user) {
      setAlerts([]);
      return;
    }

    try {
      const { data } = await usersAPI.getAlerts();
      setAlerts(data.map((alert) => ({ ...alert, isRead: alert.isRead ?? alert.read })));
    } catch (err) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  const handleRead = async (alertId) => {
    setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, isRead: true, read: true } : alert)));
    try {
      await usersAPI.markAlertAsRead(alertId);
      await loadAlerts();
    } catch (err) {
      console.error(err);
      await loadAlerts();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          Diesel<span>Maps</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Inicio
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {(user?.role === 'OPERATOR' || user?.role === 'ADMIN') && (
            <Link to="/create-station" className="nav-link nav-cta">
              Registrar estación
            </Link>
          )}
        </nav>

        <div className="nav-links">
          {user ? (
            <>
              <button type="button" className="nav-link" onClick={() => setShowAlerts((value) => !value)}>
                Alertas {unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
              <span className="tag">{user.username} • {user.role}</span>
              <button type="button" className="nav-link nav-cta" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Ingresar
              </Link>
              <Link to="/register" className="nav-link nav-cta">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>

      {showAlerts && user && (
        <div className="site-frame" style={{ marginTop: '-10px' }}>
          <div className="panel" style={{ padding: '18px', marginTop: '10px' }}>
            <div className="section-header">
              <h3>Notificaciones</h3>
            </div>
            {alerts.length === 0 ? (
              <p className="text-muted">No tienes alertas nuevas.</p>
            ) : (
              <div className="grid-2" style={{ gap: '14px' }}>
                {alerts.map((alert) => (
                  <div key={alert.id} className="card" style={{ padding: '18px' }}>
                    <p style={{ margin: 0 }}>{alert.message}</p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px',
                      }}
                    >
                      <span className={`status-pill ${alert.isRead ? 'status-closed' : 'status-active'}`}>
                        {alert.isRead ? 'Leída' : 'Nueva'}
                      </span>
                      {!alert.isRead && (
                        <button type="button" className="button-secondary" onClick={() => handleRead(alert.id)}>
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
