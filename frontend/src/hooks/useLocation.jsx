

// import { useCallback } from "react";
import { useState, useCallback, useEffect } from 'react';

import { toast } from "../components/Shared/Toast";

export const useGeolocation = () => {
  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser does not support geolocation.",
          toastType: "error",
        });
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast({
              title: "Location Denied!",
              description:
                "Location is required to use this feature. Please enable it in your browser settings.",
              toastType: "error",
            });
          } else {
            toast({
              title: "Location Error",
              description: "Location access denied or unavailable.",
              toastType: "error",
            });
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);
 return { getLocation };
};



const LocationPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';



const useLocationGeo = (options={enableHighAccuracy:true,timeout:10000,maximumAge:0}) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(LocationPermissionStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Check if geolocation is supported
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  // Request permission and get location
  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords);
        setStatus('granted');
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setStatus('denied');
        setIsLoading(false);
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission was denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case err.TIMEOUT:
            setError('The request to get location timed out');
            break;
          default:
            setError('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  return {
    coords,
    error,
    status,
    requestPermission,
    isLoading,
  };
};

export default useLocationGeo;