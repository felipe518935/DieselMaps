import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Routes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="panel">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-slate-950">Rutas</h1>
            <p className="text-slate-700 text-sm">
              Aquí comenzamos a planificar recorridos entre estaciones. Pronto podrás crear una ruta, seleccionar estaciones y visualizar tu camino.
            </p>
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <h2 className="font-semibold text-xl text-slate-900 mb-3">Próximamente</h2>
              <p className="text-slate-600 leading-relaxed">
                La funcionalidad de rutas ya está en camino: puedes explorar estaciones cercanas y en breve podrás generar un recorrido entre ellas.
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="btn-primary w-full sm:w-auto"
            >
              Volver al Mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
