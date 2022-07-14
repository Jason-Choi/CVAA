import React from 'react';
import { useState, useEffect } from 'react';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { Routes } from './Routes';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraPage from './pages/CameraPage';
import { Linking } from 'react-native';
import { RecoilRoot } from 'recoil';
import ResultsPage from './pages/ResultsPage';

const Stack = createNativeStackNavigator<Routes>();

const App = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const requestCameraPermission = async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermissionStatus(permission);
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            statusBarStyle: 'dark',
            animationTypeForReplace: 'push',
          }}
          initialRouteName={'CameraPage'}
        >
          <Stack.Screen name="CameraPage" component={CameraPage} />
          <Stack.Screen name="ResultsPage" component={ResultsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
