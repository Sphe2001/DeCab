import React, { useEffect, useState } from 'react';
import { getToken, clearToken } from '../web_pages/auth/GetToken';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function DriverPasswordReset() {
    const navigate = useNavigate();

    // Reset password state
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
  
    // Handle password update
    const handleUpdatePassword = async () => {
      if (newPassword !== confirmNewPassword) {
        setPasswordError('New password and confirm password do not match.');
        return;
      }
  
      const token = getToken();
      if (!token) {
        toast.error('No token found, please login.');
        navigate('/');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:8181/api/driver/auth/update/driver/password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        });
  
        const result = await response.json();
  
        if (!result || !response.ok) {
          setIsUpdated(false);
          setPasswordError('Current password is incorrect.');
          return;
        } else {
          setIsUpdated(true);
        }
      } catch (error) {
        toast.error('Error updating password');
      }
    };
  
    useEffect(() => {
      if (isUpdated) {
        clearToken();
        toast.success('Password updated successfully. Please login again.');
        navigate('/');
      }
    }, [isUpdated, navigate]);
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
  
          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="block w-full rounded-md py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
  
          {passwordError && <p className="text-red-500">{passwordError}</p>}
  
          <button
            type="button"
            onClick={handleUpdatePassword}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    );
  }
