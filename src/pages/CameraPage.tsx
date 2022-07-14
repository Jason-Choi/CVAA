import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useRecoilState } from 'recoil';
import { CONTENT_SPACING, SAFE_AREA_PADDING } from '../Constants';
import { useIsForeground } from '../hooks/useIsForeground';
import { Routes } from '../Routes';
import { capturedPhoto,  response } from '../States';
const BUTTON_SIZE = 40;

type Props = NativeStackScreenProps<Routes, 'CameraPage'>;
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const CameraPage = ({ navigation }: Props) => {
  const camera = useRef<Camera>(null);
  const [responseState, setResponseState] = useRecoilState(response);
  const [capturedPhotoState, setCapturedPhotoState ] = useRecoilState(capturedPhoto);
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const devices = useCameraDevices();
  const device = devices.back;

  async function capture() {
    const photo = await camera.current?.takePhoto();
    const form = new FormData();
    const tmp = photo?.path.split('/') as string[];
    const filename = tmp[tmp.length - 1];
    
    form.append('files', {
      name: filename,
      type: 'image/jpeg',
      uri: 'file://' + photo?.path,
    });

    const res = await axios.post('http://115.145.36.213:8000/ocr_api', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setResponseState(res.data);
    setCapturedPhotoState(photo);
    navigation.navigate('ResultsPage');
  }

  return (
    <View style={styles.container}>
      {device != null && (
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <ReanimatedCamera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            photo={true}
            orientation={'portrait'}
          />
        </Reanimated.View>
      )}
      <View style={styles.captureButton} onTouchEnd={capture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    backgroundColor: 'red',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CameraPage;
