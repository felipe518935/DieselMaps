import { GoogleMap, Marker, InfoWindow, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import PriceTag from './PriceTag';

const mapContainerStyle = { width: '100%', height: '500px' };

const defaultCenter = { lat: 4.711, lng: -74.0721 };

export default function MapView({ stations = [], onStationClick, userLocation, selectedStation }) {
  const [directions, setDirections] = useState(null);
  const [routeError, setRouteError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  const handleMarkerClick = useCallback((station) => {
    onStationClick?.(station);
  }, [onStationClick]);

  const handleDirectionsCallback = useCallback((response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
        setRouteError(null);
      } else {
        console.error('Error al calcular la ruta:', response);
        setRouteError(response.status);
      }
    }
  }, []);

  if (loadError) return <div className="text-center p-8 text-red-600">Error al cargar el mapa</div>;
  if (!isLoaded) return <div className="text-center p-8 text-gray-800">Cargando mapa...</div>;

  const mapCenter = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : defaultCenter;

  const directionsRequest = userLocation && selectedStation ? {
    origin: { lat: userLocation.latitude, lng: userLocation.longitude },
    destination: {
      lat: parseFloat(selectedStation.latitude),
      lng: parseFloat(selectedStation.longitude),
    },
    travelMode: 'DRIVING',
  } : null;

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
        }}
      >
        {userLocation && (
          <Marker
            position={mapCenter}
            title="Tu ubicación"
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: '#2563eb',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 1.8,
            }}
          />
        )}

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={{
              lat: parseFloat(station.latitude),
              lng: parseFloat(station.longitude),
            }}
            title={station.name}
            icon={{
              path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
              fillColor: station.available ? '#10b981' : '#ef4444',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 2,
            }}
            onClick={() => handleMarkerClick(station)}
          />
        ))}

        {directionsRequest && !directions && (
          <DirectionsService
            options={directionsRequest}
            callback={handleDirectionsCallback}
          />
        )}

        {directions && (
          <DirectionsRenderer
            options={{
              directions,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 6,
              },
            }}
          />
        )}

        {selectedStation && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedStation.latitude),
              lng: parseFloat(selectedStation.longitude),
            }}
            onCloseClick={() => onStationClick?.(null)}
          >
            <div className="p-3 min-w-[200px]">
              <h3 className="font-bold text-sm text-gray-900">{selectedStation.name}</h3>
              <p className="text-xs text-gray-700 mb-2">{selectedStation.brand}</p>
              <div className="space-y-1">
                {selectedStation.prices?.length > 0 ? (
                  selectedStation.prices.map((p) => (
                    <div key={p.fuelType} className="text-xs">
                      <PriceTag fuelType={p.fuelType} price={p.priceCop} />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">Sin precios registrados</p>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {routeError && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 14px',
            borderRadius: 12,
            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
            color: '#b91c1c',
            fontSize: '0.85rem',
            zIndex: 10,
          }}
        >
          Error calculando la ruta: {routeError}
        </div>
      )}
    </div>
  );
}
