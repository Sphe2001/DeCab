import { useRef, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const center = { lat: 48.8584, lng: 2.2945 };

export default function DriverHomePage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  async function calculateRoute(): Promise<void> {
    if (!origin || !destination) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance?.text || '');
    setDuration(results.routes[0].legs[0].duration?.text || '');
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setOrigin(null);
    setDestination(null);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full h-2/3">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="w-64">
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}
            selectProps={{
              placeholder: 'Origin',
              onChange: (value: any) => setOrigin(value?.label || ''),
            }}
          />
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}
            selectProps={{
              placeholder: 'Destination',
              onChange: (value: any) => setDestination(value?.label || ''),
            }}
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={calculateRoute}
          >
            Calculate Route
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={clearRoute}
          >
            Clear Route
          </button>
        </div>
        <div className="mt-4">
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      </div>
    </div>
  );
}
