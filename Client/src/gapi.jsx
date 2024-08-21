// src/gapi.js
import { useEffect } from 'react';
import { useGoogleLogin } from 'react-google-login';
import gapi from 'gapi-script';

const CLIENT_ID = '807753164999-uf9d3ntcgt5un7fu51m40p8l2fh2ml05.apps.googleusercontent.com';

const useGoogleApi = () => {
  useEffect(() => {
    const initializeGapi = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar',
        });
      });
    };

    initializeGapi();
  }, []);

  const { signIn, loaded } = useGoogleLogin({
    clientId: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/calendar',
    onSuccess: (response) => {
      console.log('Logged in successfully', response);
    },
    onError: (error) => {
      console.error('Login failed', error);
    },
  });

  return { signIn, loaded };
};

export default useGoogleApi;
