import React, { useEffect, useState } from 'react';
import ClientNavBar from '../../components/ClientNavBar';
import { getToken, clearToken } from '../auth/GetToken';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PasswordReset from '../../components/PasswordReset';
import { KeyIcon, ChevronRightIcon, XMarkIcon, ArrowUpTrayIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';


interface UserDetails {
  firstName: string;
  email: string;
  phoneNumber: string;
  profile ?: File;
}


export default function ClientManageAccountPage() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: '',
    email: '',
    phoneNumber: '',
    profile: undefined
  });

  const [activeTab, setActiveTab] = useState<string>('Profile');

  const [originalDetails, setOriginalDetails] = useState<UserDetails>({
    firstName: '',
    email: '',
    phoneNumber: '',
    profile: undefined
  }); 
  const [isEditable, setIsEditable] = useState<boolean>(false); 
  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchPhoto = async () => {
      const token = getToken(); 
      try {
        const response = await fetch('http://localhost:8181/api/client/auth/getPhoto', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the image');
        }

        const base64Image = await response.text();
        
        setImageSrc(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchPhoto();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0], 
      }));
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getToken();

      if (!token) {
        toast.error('No token found, please login.');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8181/api/client/auth/getClient', {
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


  const handleUpdate = async () => {
    const token = getToken();

    if (!token) {
      toast.error('No token found, please login.');
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', userDetails.firstName);
    formData.append('email', userDetails.email);
    formData.append('phoneNumber', userDetails.phoneNumber);

    if (userDetails.profile) {
      formData.append('profile', userDetails.profile);
    }

    try {
      const response = await fetch('http://localhost:8181/api/client/auth/update/client', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, 
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
      <ClientNavBar />
      <ToastContainer />
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/5 bg-gray-100 h-screen p-6">
          <ol className="space-y-4">
            <li
              className={`cursor-pointer p-2 rounded-md ${activeTab === 'Profile' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => setActiveTab('Profile')}
            >
              Profile
            </li>
            <li
              className={`cursor-pointer p-2 rounded-md ${activeTab === 'Privacy & Security' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
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
            <div className="relative inline-block">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Client"
                      className="w-48 h-48 rounded-full object-fill border-2" // Rounded image with fixed size
                    />
                  ) : (
                    <p>Loading image...</p>
                  )}

                  {/* Photo Upload with Button */}
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('photoUpload')?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full"
                    >
                      <ArrowUpTrayIcon className="w-6 h-6" />
                    </button>
                  )}

                  {/* Hidden file input */}
                  <input
                    id="photoUpload"
                    name="profile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

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

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={userDetails.phoneNumber}
                onChange={handleInputChange}
                readOnly={!isEditable}
                className={`block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ${
                  isEditable ? 'focus:ring-2 focus:ring-inset focus:ring-indigo-600' : ''
                }`}
              />
            </div>
          </form>

            <div className="mt-6 space-x-4">
              {isEditable ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Update Information
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditable(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Edit Information
                </button>
              )}
            </div>
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
                        <PasswordReset />
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
