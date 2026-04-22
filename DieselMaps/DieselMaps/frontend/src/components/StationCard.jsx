import PriceTag from './PriceTag';
import { Link } from 'react-router-dom';

export default function StationCard({ station }) {
  return (
    <div className="card transform hover:-translate-y-1 transition-all duration-300 p-6 border-l-4 hover:border-l-4" style={{borderLeftColor: 'var(--secondary)'}}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-1" style={{color: 'var(--text)'}}>{station.name}</h3>
          <p className="text-sm font-medium flex items-center gap-1" style={{color: 'var(--text-light)'}}>
            <span style={{color: 'var(--secondary)'}}>🏷️</span> {station.brand}
          </p>
        </div>
        <span className={station.available ? 'status-available' : 'status-closed'}>
          {station.available ? '✅ Disponible' : '❌ Cerrada'}
        </span>
      </div>

      <p className="text-xs mb-4 flex items-center gap-1" style={{color: 'var(--text-light)'}}>
        <span style={{color: 'var(--accent)'}}>📍</span> {station.address}
      </p>

      <div className="space-y-3 mb-5">
        {station.prices?.length > 0 ? (
          station.prices.map((price) => (
            <PriceTag
              key={price.fuelType}
              fuelType={price.fuelType}
              price={price.priceCop}
            />
          ))
        ) : (
          <p className="text-xs text-slate-500">Sin precios registrados aún</p>
        )}
      </div>

      <Link
        to={`/station/${station.id}`}
        className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:gap-3"
        style={{color: 'var(--secondary)'}}
      >
        Ver detalles completos <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}
