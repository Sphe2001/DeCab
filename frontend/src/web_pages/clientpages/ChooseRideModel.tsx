import React, { useState } from 'react';
import RidesList from './RidesList';
import { RideComponents } from './RideComponents';

export default function ChooseRideModel() {
  const [rideDetails, setRideDetails] = useState<RideComponents[]>([
    { id: 1, carType: 'Sedan', distance: '10 km', seats: 4, cost: 15 },
    { id: 2, carType: 'SUV', distance: '15 km', seats: 6, cost: 25 },
  ]);

  return (
    <div className="space-y-4">
      {rideDetails.map((ride) => (
        <RidesList key={ride.id} props={ride} />
      ))}
    </div>
  );
}
