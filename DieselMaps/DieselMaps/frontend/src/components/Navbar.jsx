import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar p-4 shadow-2xl border-b-4" style={{borderBottomColor: 'var(--accent)'}}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/map" className="text-2xl font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-white">
          <span className="text-3xl">⛽</span> Diesel Maps
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm glass px-3 py-1 rounded-full text-white font-medium">
                {user.username}
                <span className="text-xs ml-2 px-2 py-0.5 rounded font-semibold" style={{backgroundColor: 'var(--accent)', color: 'var(--text)'}}>
                  {user.role}
                </span>
              </span>
              <Link
                to="/routes"
                className="btn-accent transform hover:scale-105 transition-all duration-200"
              >
                🧭 Rutas
              </Link>
              {user.role === 'OPERATOR' || user.role === 'ADMIN' ? (
                <Link
                  to="/create-station"
                  className="btn-secondary transform hover:scale-105 transition-all duration-200"
                >
                  ➕ Estación
                </Link>
              ) : null}
              <button
                onClick={handleLogout}
                className="btn-accent transform hover:scale-105 transition-all duration-200"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="glass hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-all duration-200 text-white font-medium"
              >
                🔐 Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-medium transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
