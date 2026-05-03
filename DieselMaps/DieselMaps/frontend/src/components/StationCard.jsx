import { Link } from 'react-router-dom';
import PriceTag from './PriceTag.jsx';

export default function StationCard({ station }) {
  return (
    <article className="card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{station.name}</h3>
          <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>{station.brand}</p>
        </div>
        <span className={`status-pill ${station.available ? 'status-active' : 'status-closed'}`}>
          {station.available ? 'Operativa' : 'Cerrada'}
        </span>
      </div>
      <p style={{ margin: 0, color: '#cbd5e1' }}>{station.address}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {station.prices?.map((price) => (
          <PriceTag key={price.fuelType} fuelType={price.fuelType} price={price.priceCop} />
        ))}
      </div>
      <Link className="button button-secondary" to={`/station/${station.id}`} style={{ width: 'fit-content' }}>
        Ver detalles
      </Link>
    </article>
  );
}
