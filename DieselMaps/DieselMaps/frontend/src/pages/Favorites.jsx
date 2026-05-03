import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { usersAPI } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    usersAPI
      .getFavorites()
      .then(({ data }) => setFavorites(data || []))
      .catch(() => setError('No fue posible recuperar tus favoritos.'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <div className="section-header">
          <div>
            <h2>Favoritos</h2>
            <p style={{ color: '#94a3b8' }}>Accede rápido a tus estaciones preferidas.</p>
          </div>
        </div>

        {!user ? (
          <div className="card" style={{ padding: '28px' }}>
            <p style={{ margin: 0, color: '#cbd5e1' }}>Debes iniciar sesión para ver tus favoritos.</p>
            <Link to="/login" className="button button-primary" style={{ marginTop: '18px' }}>
              Iniciar sesión
            </Link>
          </div>
        ) : loading ? (
          <div className="card" style={{ padding: '28px' }}>Cargando favoritos...</div>
        ) : error ? (
          <div className="alert">{error}</div>
        ) : favorites.length === 0 ? (
          <div className="card" style={{ padding: '28px' }}>
            <p style={{ margin: 0, color: '#cbd5e1' }}>Aún no tienes estaciones favoritas.</p>
          </div>
        ) : (
          <div className="grid-2" style={{ gap: '20px' }}>
            {favorites.map((favorite) => (
              <div key={favorite.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{favorite.stationName}</h3>
                    <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>
                      Agregado el {favorite.createdAt ? new Date(favorite.createdAt).toLocaleDateString('es-CO') : 'fecha desconocida'}
                    </p>
                  </div>
                  <Link to={`/station/${favorite.stationId}`} className="button button-secondary" style={{ alignSelf: 'center' }}>
                    Ver estación
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
