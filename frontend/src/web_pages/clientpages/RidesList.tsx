import React from 'react';
import { RideInfo } from './RideInfo';

interface ListProps {
  props: RideInfo;
}

const RidesList: React.FC<ListProps> = ({ props }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-md shadow-sm hover:shadow-lg transition-shadow">
      <div className="font-semibold">
        {props.carType} - {props.distance}
      </div>
      <div className="text-gray-500">Seats: {props.seats}</div>
      <div className="text-green-500 font-bold">{props.cost}</div>
    </div>
  );
};

export default RidesList;
