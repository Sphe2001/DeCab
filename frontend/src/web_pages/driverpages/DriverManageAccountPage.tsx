import React, { useEffect, useState } from 'react';
import DriverNavBar from '../../components/DriverNavBar';
import { getToken, clearToken } from '../auth/GetToken';
import { KeyIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DriverPasswordReset from '../../components/DriverPasswordReset';

interface UserDetails {
  photo?: File;
  firstName: string;
  lastName: string;
  email: string;
  licence?: File;
  phoneNumber: string;
}

export default function DriverManageAccountPage() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    photo: undefined,
    firstName: '',
    lastName: '',
    email: '',
    licence: undefined,
    phoneNumber: ''
  });

  const [activeTab, setActiveTab] = useState<string>('Profile');

  const [originalDetails, setOriginalDetails] = useState<UserDetails>({
    photo: undefined,
    firstName: '',
    lastName: '',
    email: '',
    licence: undefined,
    phoneNumber: ''
  });
  
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getToken();

      if (!token) {
        toast.error('No token found, please login.');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8181/api/driver/auth/getDriver', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserDetails(data);
        setOriginalDetails(data);
      } catch (error) {
        toast.error('Error fetching user details');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0], // Handle file input
      }));
    }
  };

  const handleUpdate = async () => {
    const token = getToken();

    if (!token) {
      toast.error('No token found, please login.');
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', userDetails.firstName);
    formData.append('lastName', userDetails.lastName);
    formData.append('email', userDetails.email);
    formData.append('phoneNumber', userDetails.phoneNumber);

    if (userDetails.photo) {
      formData.append('photo', userDetails.photo);
    }

    if (userDetails.licence) {
      formData.append('licence', userDetails.licence);
    }

    try {
      const response = await fetch('http://localhost:8181/api/driver/auth/update/driver', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      clearToken();
      toast.success('Information updated. Please login again.');
      navigate('/');
    } catch (error) {
      toast.error('Error updating user details');
    }
  };

  const handleCancel = () => {
    setUserDetails(originalDetails);
    setIsEditable(false);
  };

  const handlePasswordReset = () => {
    setShowPasswordReset(true);
  };

  const handleCloseModal = () => {
    setShowPasswordReset(false);
  };

  return (
    <div>
      <DriverNavBar />
      <ToastContainer />
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-100 h-screen p-6">
          <ol className="space-y-4">
            <li
              className={`cursor-pointer p-2 rounded-md ${
                activeTab === 'Profile' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              onClick={() => setActiveTab('Profile')}
            >
              Profile
            </li>
            <li
              className={`cursor-pointer p-2 rounded-md ${
                activeTab === 'Privacy & Security' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
              onClick={() => setActiveTab('Privacy & Security')}
            >
              Privacy & Security
            </li>
          </ol>
        </div>

        <div className="w-3/4 p-8">
          {activeTab === 'Profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">User Profile</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={userDetails.firstName}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={userDetails.lastName}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-4">
                  <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Upload Photo
                  </label>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                {/* Licence Upload */}
                <div className="mb-4">
                  <label htmlFor="licence" className="block text-sm font-medium leading-6 text-gray-900">
                    Upload Licence
                  </label>
                  <input
                    id="licence"
                    name="licence"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={userDetails.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditable}
                    className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                      isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                    }`}
                  />
                </div>

                <div className="flex justify-end">
                  {isEditable ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="mr-4 px-4 py-2 bg-gray-300 text-black rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditable(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Privacy & Security' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Privacy & Security Settings</h2>
              
              <div 
                className="flex items-center justify-between cursor-pointer p-2 bg-white rounded-md hover:bg-gray-100"
                onClick={handlePasswordReset}
              >
              

                <div className='flex items-start'>
                <label className="text-lg mr-3 ">Reset Password</label>
                <KeyIcon fill='currentColor' stroke='white' className="w-5 h-5 mt-1 text-gray-600"/>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </div>

                {/* Password Reset Modal */}
                  {showPasswordReset && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ">
                      <div className="bg-white p-6 rounded-md shadow-md relative w-5/12">
                        <button
                          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                          onClick={handleCloseModal}
                        >
                          
                          <XMarkIcon stroke='black' className='w-5' />
                        </button>
                        <DriverPasswordReset />
                      </div>
                    </div>
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
