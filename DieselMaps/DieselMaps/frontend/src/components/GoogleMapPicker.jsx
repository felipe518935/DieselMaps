import { useEffect, useRef } from 'react';

export default function GoogleMapPicker({ onLocationSelect, initialLat = 4.71, initialLng = -74.07 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const latestOnLocationSelectRef = useRef(onLocationSelect);

  useEffect(() => {
    latestOnLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    // Simular carga de Google Maps ya que la API key podría no estar disponible
    // En producción, usar la Google Maps SDK real
    if (!mapRef.current) return;

    // Para esta demostración, mostrar un picker simple
    const loadGoogleMaps = async () => {
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 14,
            center: { lat: initialLat, lng: initialLng },
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: false,
          });

          mapInstanceRef.current = map;

          // Crear marcador inicial
          markerRef.current = new window.google.maps.Marker({
            position: { lat: initialLat, lng: initialLng },
            map: map,
            draggable: true,
            title: 'Arrastra para cambiar ubicación',
          });

          // Evento al soltar el marcador
          markerRef.current.addListener('dragend', () => {
            const pos = markerRef.current.getPosition();
            latestOnLocationSelectRef.current({
              lat: pos.lat(),
              lng: pos.lng(),
            });
          });

          // Evento al hacer clic en el mapa
          map.addListener('click', (event) => {
            markerRef.current.setPosition(event.latLng);
            latestOnLocationSelectRef.current({
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          });

          // Llamada inicial
          latestOnLocationSelectRef.current({
            lat: initialLat,
            lng: initialLng,
          });
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error cargando Google Maps:', error);
      }
    };

    loadGoogleMaps();
  }, []);

  return (
    <div className="rounded-lg overflow-hidden shadow-md border-2 border-blue-200">
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#f0f0f0',
        }}
        className="rounded"
      />
      <div className="p-3 bg-blue-50 border-t border-blue-200 text-sm text-blue-800">
        📍 Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación
      </div>
    </div>
  );
}
