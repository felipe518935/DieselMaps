import { useEffect, useMemo, useState } from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  minHeight: '620px',
  borderRadius: '24px',
  overflow: 'hidden',
};

const defaultCenter = {
  lat: 4.711,
  lng: -74.0721,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
  scrollwheel: true,
  draggable: true,
};

export default function MapView({
  stations,
  activeStation,
  userLocation,
  favoriteIds = [],
  onSelectStation,
  onToggleFavorite,
  onMapClick,
  routeTarget,
  routeTargets,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [mapInstance, setMapInstance] = useState(null);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [zoomedStationId, setZoomedStationId] = useState(null);
  const [hasCenteredOnOrigin, setHasCenteredOnOrigin] = useState(false);

  const origin = useMemo(() => {
    if (!userLocation) return null;
    return {
      lat: Number(userLocation.latitude),
      lng: Number(userLocation.longitude),
    };
  }, [userLocation]);

  const selectedRouteTargets = useMemo(() => {
    if (routeTargets && routeTargets.length > 0) return routeTargets.filter((station) => station?.latitude && station?.longitude);
    if (routeTarget && routeTarget.latitude && routeTarget.longitude) return [routeTarget];
    return [];
  }, [routeTarget, routeTargets]);

  const routeSegments = useMemo(() => {
    if (!origin || selectedRouteTargets.length === 0) return [];

    const segments = [];
    const validStations = selectedRouteTargets;

    // from user origin to first station
    segments.push({
      origin,
      destination: {
        lat: Number(validStations[0].latitude),
        lng: Number(validStations[0].longitude),
      },
    });

    // successive station-to-station segments
    for (let i = 1; i < validStations.length; i += 1) {
      segments.push({
        origin: {
          lat: Number(validStations[i - 1].latitude),
          lng: Number(validStations[i - 1].longitude),
        },
        destination: {
          lat: Number(validStations[i].latitude),
          lng: Number(validStations[i].longitude),
        },
      });
    }

    return segments;
  }, [origin, selectedRouteTargets]);

  useEffect(() => {
    setDirectionsResponses(Array(routeSegments.length).fill(null));
  }, [routeSegments.length]);

  const handleDirectionsCallback = (result, index) => {
    if (result && result.status === 'OK') {
      setDirectionsResponses((current) => {
        const next = [...current];
        next[index] = result;
        return next;
      });
    }
  };

  useEffect(() => {
    if (!mapInstance || !origin || hasCenteredOnOrigin) return;
    mapInstance.panTo(origin);
    mapInstance.setZoom(13);
    setHasCenteredOnOrigin(true);
  }, [mapInstance, origin, hasCenteredOnOrigin]);

  useEffect(() => {
    if (!mapInstance || !activeStation || zoomedStationId === activeStation.id) return;
    const stationPosition = {
      lat: Number(activeStation.latitude),
      lng: Number(activeStation.longitude),
    };
    mapInstance.panTo(stationPosition);
    mapInstance.setZoom(15);
    setZoomedStationId(activeStation.id);
  }, [activeStation, mapInstance, zoomedStationId]);

  const reverseGeocode = async (lat, lng) => {
    if (!window.google?.maps?.Geocoder) return '';
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]?.formatted_address) {
          resolve(results[0].formatted_address);
        } else {
          resolve('');
        }
      });
    });
  };

  const handleMapClick = async (event) => {
    if (!onMapClick || !event.latLng) return;
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    const address = await reverseGeocode(latitude, longitude);
    onMapClick({ latitude, longitude, address });
  };

  const handleCenterOnUser = () => {
    if (!mapInstance || !origin) return;
    mapInstance.panTo(origin);
    mapInstance.setZoom(13);
    setHasCenteredOnOrigin(true);
  };

  const initialCenter = useMemo(() => origin || defaultCenter, [origin]);

  if (loadError) {
    return (
      <div className="loading-panel">
        <p>No se pudo cargar Google Maps.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-panel">
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="map-panel" style={{ minHeight: '100%', position: 'relative' }}>
      <button
        type="button"
        onClick={handleCenterOnUser}
        className="button button-secondary"
        style={{
          position: 'absolute',
          zIndex: 10,
          top: '16px',
          right: '16px',
          padding: '10px 14px',
          background: '#0f172a',
          border: '1px solid #334155',
          color: '#e2e8f0',
          boxShadow: '0 10px 20px rgba(15, 23, 42, 0.25)',
        }}
      >
        Centrar ubicación
      </button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        defaultCenter={initialCenter}
        defaultZoom={13}
        options={mapOptions}
        onLoad={(map) => setMapInstance(map)}
        onClick={handleMapClick}
      >
        {origin && (
          <Marker
            position={origin}
            label={{ text: 'Tú', color: '#ffffff', fontWeight: '700' }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        )}

        {stations?.map((station) => {
          const position = {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          };
          return (
            <Marker
              key={station.id}
              position={position}
              onClick={() => onSelectStation?.(station)}
              icon={
                activeStation?.id === station.id
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: '#0ea5e9',
                      fillOpacity: 1,
                      strokeColor: '#fff',
                      strokeWeight: 2,
                    }
                  : undefined
              }
            />
          );
        })}

        {routeSegments.map((segment, index) => (
          <DirectionsService
            key={`directions-service-${index}`}
            options={{
              origin: segment.origin,
              destination: segment.destination,
              travelMode: 'DRIVING',
            }}
            callback={(result) => handleDirectionsCallback(result, index)}
          />
        ))}

        {directionsResponses.map(
          (response, index) =>
            response && (
              <DirectionsRenderer
                key={`directions-renderer-${index}`}
                options={{
                  directions: response,
                  suppressMarkers: true,
                  preserveViewport: true,
                  polylineOptions: {
                    strokeColor: '#22c55e',
                    strokeOpacity: 0.9,
                    strokeWeight: 5,
                    icons: [
                      {
                        icon: {
                          path: 'M 0,-1 0,1',
                          strokeOpacity: 1,
                          scale: 4,
                        },
                        offset: '0',
                        repeat: '12px',
                      },
                    ],
                  },
                }}
              />
            ),
        )}

        {activeStation && (
          <InfoWindow
            position={{
              lat: Number(activeStation.latitude),
              lng: Number(activeStation.longitude),
            }}
            onCloseClick={() => onSelectStation?.(null)}
          >
            <div style={{ maxWidth: '270px', color: '#111' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#111' }}>{activeStation.name}</h3>
              <p style={{ margin: '0 0 8px', color: '#111', fontSize: '0.9rem' }}>{activeStation.address}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {(activeStation.prices || []).slice(0, 3).map((price) => (
                  <span key={price.fuelType} className="price-pill" style={{ color: '#111', background: '#e2e8f0' }}>
                    {price.fuelType}: ${price.priceCop.toLocaleString('es-CO')}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" className="button-secondary" onClick={() => onSelectStation?.(activeStation)}>
                  Ver en lista
                </button>
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => onToggleFavorite?.(activeStation.id)}
                >
                  {favoriteIds.includes(activeStation.id) ? 'Quitar favorito' : 'Favorito'}
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
