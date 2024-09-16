import React, { useState, useEffect } from 'react';
import { getToken } from './GetToken';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  children: React.ReactNode;
}

export default function ClientAuth({ children }: Props) {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = getToken();

      if (!token) {
        toast.error('No token found, please login.');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8181/api/authCheck/isClient', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }

        const data = await response.json();
        setIsClient(data === true);
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Error fetching user role');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    if (isClient === false) {
      toast.error('You are not authorized to access this page.');
      navigate('/');
    }
  }, [isClient, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isClient ? <>{children}</> : null;
}
