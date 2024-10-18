import React, { useState, useEffect } from 'react';
import { getToken } from '../auth/GetToken';
import axios from 'axios';

interface Props {
  url: string;
  title: string;
}

export default function GetImage({ url, title }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      const token = getToken();
      try {
        const response = await axios.post(
          url, 
          { title }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const base64Image = response.data; 
        setImageSrc(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchPhoto();
  }, [url, title]);

  return imageSrc ? <img className='object-fill' src={imageSrc} alt={title} /> : null;
}
