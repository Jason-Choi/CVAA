import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useRecoilState } from 'recoil';
import { URI } from '../Constants';
import { useIsForeground } from '../hooks/useIsForeground';
import { Routes } from '../Routes';
import { capturedPhoto, response } from '../States';
import { Character } from '../Types';

type Props = NativeStackScreenProps<Routes, 'CameraPage'>;
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const CameraPage = ({ navigation }: Props) => {
    const camera = useRef<Camera>(null);
    const [responseState, setResponseState] = useRecoilState(response);
    const [capturedPhotoState, setCapturedPhotoState] =
        useRecoilState(capturedPhoto);
    const [isProcessing, setIsProcessing] = useState(false);
    const isFocused = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocused && isForeground;

    const devices = useCameraDevices('wide-angle-camera');
    console.log(devices)
    const device = devices.back;

    if (device === null || device === undefined) return null;

    async function capture() {
        console.log(await Camera.getAvailableCameraDevices());
        setIsProcessing(true);
        const photo = await camera.current?.takePhoto();
        const form = new FormData();
        const tmp = photo?.path.split('/') as string[];
        const filename = tmp[tmp.length - 1];

        form.append('files', {
            name: filename,
            type: 'image/jpeg',
            uri: 'file://' + photo?.path,
        });
        
        const res = await axios.post(
            `http://${URI}/ocr_api`,
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        const data: Character[] = res.data;
        setIsProcessing(false);
        setResponseState(
            data.filter(x => x.eye_sight < 2.0 && x.eye_sight > 0.0),
        );
        setCapturedPhotoState(photo);
        navigation.navigate('ResultsPage');
    }

    return (
        <View>
            <Reanimated.View style={styles.container}>
                <ReanimatedCamera
                    ref={camera}
                    style={{
                        width: size.windowWidth,
                        height: (size.windowWidth * 16) / 9,
                    }}
                    device={device}
                    isActive={isActive}
                    photo={true}
                    zoom={3}
                    orientation={'portrait'}
                />
            </Reanimated.View>
            <View style={styles.control}>
                {isProcessing ? (
                    <Button
                        onPress={capture}
                        title={'Processing'}
                        color="gray"
                    />
                ) : (
                    <Button onPress={capture} title={'Capture'} color="green" />
                )}
                <Text style={styles.copyright}>
                    Jaehwan Lee & Jiwon Choi, 2022 SKKU Co-Deep Learning Project
                </Text>
            </View>
        </View>
    );
};

const size = {
    windowWidth: Dimensions.get('window').width,
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    control: {
        position: 'relative',
        width: size.windowWidth * 0.9,
        margin: size.windowWidth * 0.05,
        alignSelf: 'center',
        height: 150,
    },
    copyright: {
        color: 'black',
        fontStyle: 'italic',
        textAlign: 'center',
        fontSize: 11,
        marginTop: 10,
        position: 'relative',
    },
});
export default CameraPage;
[
    {
        devices: ['wide-angle-camera'],
        formats: [
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
        ],
        hasFlash: true,
        hasTorch: true,
        id: '0',
        isMultiCam: false,
        maxZoom: 8,
        minZoom: 1,
        name: 'back (0)',
        neutralZoom: 1,
        position: 'back',
        supportsDepthCapture: false,
        supportsFocus: true,
        supportsLowLightBoost: true,
        supportsParallelVideoProcessing: true,
        supportsRawCapture: true,
    },
    {
        devices: ['wide-angle-camera'],
        formats: [
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
        ],
        hasFlash: false,
        hasTorch: false,
        id: '1',
        isMultiCam: false,
        maxZoom: 4,
        minZoom: 1,
        name: 'front (1)',
        neutralZoom: 1,
        position: 'front',
        supportsDepthCapture: false,
        supportsFocus: true,
        supportsLowLightBoost: true,
        supportsParallelVideoProcessing: false,
        supportsRawCapture: false,
    },
    {
        devices: ['ultra-wide-angle-camera'],
        formats: [
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
        ],
        hasFlash: false,
        hasTorch: false,
        id: '2',
        isMultiCam: false,
        maxZoom: 8,
        minZoom: 1,
        name: 'back (2)',
        neutralZoom: 1,
        position: 'back',
        supportsDepthCapture: false,
        supportsFocus: true,
        supportsLowLightBoost: true,
        supportsParallelVideoProcessing: false,
        supportsRawCapture: true,
    },
    {
        devices: ['wide-angle-camera'],
        formats: [
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
            [Object],
        ],
        hasFlash: false,
        hasTorch: false,
        id: '3',
        isMultiCam: false,
        maxZoom: 4,
        minZoom: 1,
        name: 'front (3)',
        neutralZoom: 1,
        position: 'front',
        supportsDepthCapture: false,
        supportsFocus: true,
        supportsLowLightBoost: true,
        supportsParallelVideoProcessing: false,
        supportsRawCapture: false,
    },
];