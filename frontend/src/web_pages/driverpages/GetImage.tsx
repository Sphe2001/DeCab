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

  return imageSrc ? (
    <img
      className="object-cover w-full h-full rounded-md"
      src={imageSrc}
      alt={title}
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
      <span className="text-gray-500">Loading...</span>
    </div>
  );
}
