import React from 'react';

export default function DriverHomePage() {
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
        <input
          type="text"
          placeholder="Origin"
          ref={originRef}
          className="border rounded px-4 py-2 mb-2 w-64"
        />
        <input
          type="text"
          placeholder="Destination"
          ref={destinationRef}
          className="border rounded px-4 py-2 mb-2 w-64"
        />
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
