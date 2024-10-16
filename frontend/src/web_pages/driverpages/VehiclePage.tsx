import React, { useEffect, useState } from 'react';
import DriverNavBar from '../../components/DriverNavBar'
import { getToken, clearToken } from '../auth/GetToken';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface vehicleDetails{
    carModel : string;
    carType : string;
    seats: number;
    numberPlate: string;
    colour : string;
    insurance? : File;
    licenceDisc? : File;
    frontView? : File;
    sideView? : File;
    backView? : File;
}

export default function VehiclePage() {
    const [activeTab, setActiveTab] = useState<string>('My Vehicle');
    const navigate = useNavigate();

    const [vehicleDetails, setVehicleDetails] = useState<vehicleDetails>({
        carModel : '',
        carType : '',
        seats: 0,
        numberPlate: '',
        colour : '',
        insurance : undefined,
        licenceDisc : undefined,
        frontView : undefined,
        sideView : undefined,
        backView : undefined,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVehicleDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
      };
    
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
          setVehicleDetails((prevDetails) => ({
            ...prevDetails,
            [name]: files[0], 
          }));
        }
      };

      const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVehicleDetails((prevDetails) => ({
          ...prevDetails,
          [name]: name === 'seats' ? Number(value) : value,
        }));
      };

      const handleRegister = async () => {
        const token = getToken();
    
        if (!token) {
          toast.error('No token found, please login.');
          navigate('/');
          return;
        }
    
        const formData = new FormData();
        formData.append('carModel', vehicleDetails.carModel);
        formData.append('carType', vehicleDetails.carType);
        formData.append('seats', String(vehicleDetails.seats));
        formData.append('numberPlate', vehicleDetails.numberPlate);
        formData.append('colour', vehicleDetails.colour);
    
        if (vehicleDetails.insurance) {
          formData.append('insurance', vehicleDetails.insurance);
        }
    
        if (vehicleDetails.licenceDisc) {
          formData.append('licenceDisc', vehicleDetails.licenceDisc);
        }

        if (vehicleDetails.frontView) {
            formData.append('frontView', vehicleDetails.frontView);
        }

        if (vehicleDetails.sideView) {
            formData.append('sideView', vehicleDetails.sideView);
        }

        if (vehicleDetails.backView) {
            formData.append('backView', vehicleDetails.backView);
        }

        
    
        try {
          const response = await fetch('http://localhost:8181/api/vehicle/register', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData, 
          });
    
          if (!response.ok) {
            throw new Error('Failed to update user details');
          }
          toast.success('Vehicle registration submited');
          navigate('/d-myvehicle');
        } catch (error) {
          toast.error('Error registering vehicle');
        }
      };
  return (
    <div>
        <DriverNavBar/>
        <ToastContainer />
        <div className='flex'>
            <div className="w-1/5 bg-gray-100 h-screen p-6">
                <ol className="space-y-4">
                    <li
                    className={`cursor-pointer p-2 rounded-md ${
                        activeTab === 'Register Vehicle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                    onClick={() => setActiveTab('Register Vehicle')}
                    >
                    Register Vehicle
                    </li>
                    <li
                    className={`cursor-pointer p-2 rounded-md ${
                        activeTab === 'My Vehicle' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                    onClick={() => setActiveTab('My Vehicle')}
                    >
                    My Vehicle
                    </li>
                    <li
                    className={`cursor-pointer p-2 rounded-md ${
                        activeTab === 'Something' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                    }`}
                    onClick={() => setActiveTab('Something')}
                    >
                    Something
                    </li>
            </ol>
            </div>
            <div className="w-3/4 p-8">
            {activeTab === 'Register Vehicle' && (
                <div>
                    <form>
                        <div className='mb-4'>
                            <label htmlFor="numberPlate" className="block text-sm font-medium leading-6 text-gray-900">
                                Number Plate
                            </label>
                            <input
                                id="numberPlate"
                                name="numberPlate"
                                type="text"
                                value={vehicleDetails.numberPlate} 
                                onChange={handleInputChange}
                                className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300`}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="carModel" className="block text-sm font-medium leading-6 text-gray-900">
                                Car Model
                            </label>
                            <input
                                id="carModel"
                                name="carModel"
                                type="text"
                                value={vehicleDetails.carModel}
                                onChange={handleInputChange}
                                className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300`}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="carType" className="block text-sm font-medium leading-6 text-gray-900">
                                Car Type
                            </label>
                            <select 
                                name='carType'
                                value={vehicleDetails.carType}
                                onChange={handleSelectChange}
                                className="block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            >
                                <option value="null">--Select--</option>
                                <option value="sedan">Sedan</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="suv">SUV</option>
                                <option value="coupe">Coupe</option>
                                <option value="minibus">MiniBus</option>
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="colour" className="block text-sm font-medium leading-6 text-gray-900">
                                Colour
                            </label>
                            <input
                                id="colour"
                                name="colour"
                                type="text"
                                value={vehicleDetails.colour}
                                onChange={handleInputChange}
                                className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300`}
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="seats" className="block text-sm font-medium leading-6 text-gray-900">
                                Seats
                            </label>
                            <select 
                                name='seats'
                                value={vehicleDetails.seats}
                                onChange={handleSelectChange}
                                className="block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                            >
                                <option value={0}>--Select--</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="insurance" className="block text-sm font-medium leading-6 text-gray-900">
                                Insurance
                            </label>
                            <input
                                id="insurance"
                                name="insurance"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className=""
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="licenceDisc" className="block text-sm font-medium leading-6 text-gray-900">
                                Licence Disc
                            </label>
                            <input
                                id="licenceDisc"
                                name="licenceDisc"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className=""
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="frontView" className="block text-sm font-medium leading-6 text-gray-900">
                                Front View
                            </label>
                            <input
                                id="frontView"
                                name="frontView"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className=""
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="sideView" className="block text-sm font-medium leading-6 text-gray-900">
                                Side View
                            </label>
                            <input
                                id="sideView"
                                name="sideView"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className=""
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="backView" className="block text-sm font-medium leading-6 text-gray-900">
                                Back View
                            </label>
                            <input
                                id="backView"
                                name="backView"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className=""
                            />
                        </div>
                        <div>
                            <button
                            type="button"
                            onClick={handleRegister}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Register
                        </button>
                        </div>
                    </form> 
                </div>

                    
            )}
            
                {activeTab === 'My Vehicle' && (
                    <div>My Vehicle</div>
                )}
            
                {activeTab === 'Something' && (
                    <div>Something</div>
                )}
            </div>
        </div>
    </div>
  )
}
