import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="site-frame">
        <section className="hero-panel">
          <div className="section-header">
            <div>
              <p className="tag">Visión profesional</p>
              <h1 className="section-title">DieselMaps · Inteligencia de combustible</h1>
              <p className="section-subtitle">
                Plataforma moderna para visualizar estaciones, comparar precios, trazar rutas y gestionar operaciones con una interfaz oscura y fluida.
              </p>
            </div>
            <div>
              <span className="status-pill status-active">Experiencia para usuarios, operadores y administradores</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link to="/map" className="button button-primary">
              Explorar mapa
            </Link>
            <Link to="/login" className="button button-secondary">
              Inicia sesión
            </Link>
          </div>
        </section>

        <section className="grid-3" style={{ marginTop: '32px', gap: '24px' }}>
          {[
            {
              title: 'Mapa en tiempo real',
              description: 'Encuentra estaciones cercanas, revisa disponibilidad y precios rápidamente.',
            },
            {
              title: 'Matriz comparativa',
              description: 'Compara hasta tres estaciones con precios y métricas clave al instante.',
            },
            {
              title: 'Operaciones segmentadas',
              description: 'Registra estaciones y actualiza precios si eres operador o administrador.',
            },
          ].map((item) => (
            <div key={item.title} className="card" style={{ padding: '28px' }}>
              <h3 style={{ margin: 0, marginBottom: '14px' }}>{item.title}</h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>{item.description}</p>
            </div>
          ))}
        </section>

        <section className="grid-2" style={{ marginTop: '32px', gap: '24px' }}>
          <div className="panel" style={{ padding: '28px' }}>
            <div className="section-header">
              <h3>Diseño centrado en el usuario</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Interfaz nocturna, navegación clara y controles adaptativos para cada perfil. El sistema brinda una experiencia inmediata, profesional y enfocada en la eficiencia.
            </p>
          </div>
          <div className="panel" style={{ padding: '28px' }}>
            <div className="section-header">
              <h3>Integración completa con API</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Todas las operaciones se comunican con el backend: autenticación, estaciones, precios, historial, favoritos y alertas.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
