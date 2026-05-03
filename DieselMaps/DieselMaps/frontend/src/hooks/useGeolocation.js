import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible');
      setLoading(false);
      return;
    }

    const watcher = navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      },
    );

    return () => {
      if (watcher && watcher.clearWatch) {
        watcher.clearWatch();
      }
    };
  }, []);

  return { location, loading, error };
}
