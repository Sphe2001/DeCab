import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { getToken } from './auth/AuthCheck';
import { useNavigate } from 'react-router-dom';

const defaultCenter = { lat: -25.749362, lng: 28.188300 }; 



export default  function ClientHomePage() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = getToken();

      if (!token) {
        toast.error('No token found, please login.');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8181/api/authCheck/isClient', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }

        const data = await response.json();
        if (data === true) {
          setIsClient(true);
        } else {
          setIsClient(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Error fetching user role');
        navigate('/');
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    if (isClient === false) {
      toast.error('You are not authorized to access this page.');
      navigate('/');
    }
  }, [isClient, navigate]);

  
  
  

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapKey, setMapKey] = useState(1); 
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [center, setCenter] = useState(defaultCenter); 

  const [origin, setOrigin] = useState<{ label: string; value: any } | null>(null);
  const [destination, setDestination] = useState<{ label: string; value: any } | null>(null);
  const [originLocation, setOriginLocation] = useState<google.maps.LatLng | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
      },
      () => {
        toast.error('Could not retrieve your location');
      }
    );
  }, []);

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  async function calculateRoute(e: React.FormEvent): Promise<void> {
    e.preventDefault(); 

    if (!origin || !destination) {
      toast.error('Please select both origin and destination');
      return;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: origin.label,
        destination: destination.label,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || '');
      setDuration(results.routes[0].legs[0].duration?.text || '');
    } catch (error) {
      toast.error('Could not calculate the route. Please try again.');
      console.error('Error calculating route:', error);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setOrigin(null);
    setDestination(null);
    setOriginLocation(null);
    setDestinationLocation(null);
    setMapKey(mapKey + 1);
    toast.info('Route cleared');
  }

  const handleOriginChange = (value: any) => {
    setOrigin(value);
    setOriginLocation(value?.value.geometry.location || null);
    setDirectionsResponse(null);
  };

  const handleDestinationChange = (value: any) => {
    setDestination(value);
    setDestinationLocation(value?.value.geometry.location || null);
    setDirectionsResponse(null);
  };



    

  return (
    <div className="h-screen w-screen flex">
      <div className="w-96 p-8">
        <h1 className="text-2xl font-bold mb-4">Client Home Page</h1>
        <form onSubmit={calculateRoute} className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="location">
              Origin
            </label>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}
              selectProps={{
                placeholder: 'Origin',
                onChange: handleOriginChange,
                value: origin, 
              }}
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="destination">
              Destination
            </label>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}
              selectProps={{
                placeholder: 'Destination',
                onChange: handleDestinationChange,
                value: destination,
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Search
          </button>
          <button
            type="button"
            className="w-full bg-red-500 text-white p-2 rounded-md mt-2"
            onClick={clearRoute}
          >
            Clear
          </button>
        </form>
        <div className="mt-4">
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      </div>

      <div className="w-full">
        <GoogleMap
          key={mapKey}
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
          
          {originLocation && <Marker position={originLocation} />}
          {destinationLocation && <Marker position={destinationLocation} />}
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>

      <ToastContainer />
    </div>
  );
}
