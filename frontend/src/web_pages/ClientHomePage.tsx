

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientHomePage() {
  const [mapSrc, setMapSrc] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');

  const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY;

  console.log(API_KEY)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapSrc(
            `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${latitude},${longitude}`
          );
        },
        (error) => {
          toast.error('Error fetching location');
          console.error('Error Code = ' + error.code + ' - ' + error.message);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Location: ${location}, Destination: ${destination}`);
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="w-96 p-8">
        <h1 className="text-2xl font-bold mb-4">Client Home Page</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your current location"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="destination">
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your destination"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="w-full">
        {mapSrc ? (
          <iframe
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          ></iframe>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
