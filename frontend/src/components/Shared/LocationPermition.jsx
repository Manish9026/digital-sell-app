
import { Alert } from './Alert'
import React, { useState, useEffect, useCallback } from 'react';

const LocationPermition = () => {
  return (
    <div>
        <Alert/>
    </div>
  )
}

import { MapPin, X, AlertCircle, CheckCircle2, Settings2 } from 'lucide-react';

// export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

// interface LocationPopupProps {
//   onLocationReceived?: (position: GeolocationPosition) => void;
//   onClose?: () => void;
//   showPopup: boolean;
// }

const LocationPopup =({
  onLocationReceived,
  onClose,
  showPopup,
}) => {
  const [status, setStatus] = useState('idle');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle popup visibility with animation
  useEffect(() => {
    if (showPopup) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with CSS transition time
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const requestLocation = useCallback( () => {

    // return   
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setStatus('requesting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        setStatus('granted');
        if (onLocationReceived) {
          onLocationReceived({latitude:position.coords.latitude,longitude:position.coords.longitude});
          console.log({latitude:position.coords.latitude,longitude:position.coords.longitude});
          
        }
      },
      (err) => {
        setStatus('denied');
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  },[]);

  const openBrowserSettings = () => {
    const browser = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (browser.includes('firefox')) {
      instructions = '1. Click the lock icon in the address bar\n2. Click "Clear Permission"\n3. Refresh the page';
    } else if (browser.includes('chrome') || browser.includes('edge')) {
      instructions = '1. Click the lock/info icon in the address bar\n2. Click "Site settings"\n3. Find "Location" and click "Reset"\n4. Refresh the page';
    } else if (browser.includes('safari')) {
      instructions = '1. Open Safari Preferences\n2. Go to Privacy & Security\n3. Manage Website Data\n4. Find this website and remove it\n5. Refresh the page';
    } else {
      instructions = 'Please check your browser settings to reset location permissions, then refresh the page.';
    }

    alert(`To enable location access:\n\n${instructions}`);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 w-full h-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-200  transition-opacity duration-300 ${showPopup ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden transition-transform duration-300 ${showPopup ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MapPin className="mr-2 text-blue-500" size={20} />
            Location Access
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {status === 'idle' && (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We need your location to provide you with personalized services and nearby recommendations.
              </p>
              <button
                onClick={requestLocation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Allow Location Access
              </button>
            </>
          )}

          {status === 'requesting' && (
            <div className="text-center py-4">
              <div className="animate-pulse flex justify-center mb-4">
                <MapPin className="text-blue-500" size={32} />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Requesting your location...</p>
            </div>
          )}

          {status === 'granted' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4 text-green-500">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">Location access granted!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Thank you for this permission 
                {/* Latitude: {position?.coords.latitude.toFixed(6)} */}
                <br />
                {/* Longitude: {position?.coords.longitude.toFixed(6)} */}
              </p>
              <button
                onClick={handleClose}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          )}

          {status === 'denied' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4 text-red-500">
                <AlertCircle size={32} />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={openBrowserSettings}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  <Settings2 className="mr-2" size={18} />
                  Open Browser Settings
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {status === 'unavailable' && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4 text-red-500">
                <AlertCircle size={32} />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
          Your location is only used when you're using the app and won't be stored or shared.
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;

