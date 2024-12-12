import React, { useState } from 'react';
import RidesList from './RidesList';
import { RideInfo } from './RideInfo';

export default function ChooseRideModal() {
  const [rideDetails, setRideDetails] = useState<RideInfo[]>([
    { rideId: 1, carType: 'Sedan', distance: '10 km', seats: 4, cost: 15 },
    { rideId: 2, carType: 'SUV', distance: '15 km', seats: 6, cost: 25 },
  ]);

  return (
    <div className="space-y-4">
      {rideDetails.map((ride) => (
        <RidesList key={ride.rideId} props={ride} />
      ))}
    </div>
  );
}
