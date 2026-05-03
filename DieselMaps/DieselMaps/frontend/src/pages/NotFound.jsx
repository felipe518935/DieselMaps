import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function NotFound() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <div className="hero-panel" style={{ textAlign: 'center' }}>
          <h1>Página no encontrada</h1>
          <p className="section-subtitle">Lo sentimos, la ruta solicitada no existe.</p>
          <Link to="/" className="button button-primary" style={{ marginTop: '24px' }}>
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
