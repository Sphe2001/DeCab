import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { toast } from 'react-toastify';


interface MapProps {
  originLocation: google.maps.LatLng | google.maps.LatLngLiteral | null;
  destinationLocation: google.maps.LatLng | google.maps.LatLngLiteral | null;
  directionsResponse: google.maps.DirectionsResult | null;
  center?: google.maps.LatLngLiteral;
}

const defaultCenter = { lat: -25.749362, lng: 28.188300 };

export default function MapComponent({
  originLocation,
  destinationLocation,
  directionsResponse,
  center = defaultCenter,
}: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY, 
    libraries: ['places'],
  });

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapKey, setMapKey] = useState(1);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude }); 
      },
      () => {
        toast.error('Could not retrieve your location, using default location');
        setMapCenter(defaultCenter); 
      }
    );
  }, []);


  useEffect(() => {
    console.log('Origin location:', originLocation);
    console.log('Destination location:', destinationLocation);
    console.log('Map center:', mapCenter);
  }, [originLocation, destinationLocation, mapCenter]);


  if (loadError) {
    return <div>Error loading maps</div>;
  }


  if (!isLoaded || !mapCenter) {
    return <div>Loading map...</div>; 
  }

  return (
    <GoogleMap
      key={mapKey}
      center={mapCenter} 
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
      {originLocation && (
        <Marker position={originLocation as google.maps.LatLng | google.maps.LatLngLiteral} />
      )}
      {destinationLocation && (
        <Marker position={destinationLocation as google.maps.LatLng | google.maps.LatLngLiteral} />
      )}
      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
    </GoogleMap>
  );
}
