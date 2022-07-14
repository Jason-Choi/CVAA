import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Canvas, Image, SkImage, useImage } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useRecoilState } from 'recoil';
import { Routes } from '../Routes';
import { response, capturedPhoto } from '../States';

type Props = NativeStackScreenProps<Routes, 'ResultsPage'>;

const ResultsPage = ({ navigation }: Props) => {
    const [responseState] = useRecoilState(response);
    const [capturedPhotoState] = useRecoilState(capturedPhoto);
    
    const picture = useImage("file://" + capturedPhotoState?.path);
    console.log(capturedPhotoState);

    const width = capturedPhotoState?.width as number;
    const height = capturedPhotoState?.height as number;

    return (
        <View style={styles.container}>
            <Canvas style={{width}}>
                {picture &&(
                    <Image 
                        image={picture}
                        fit="contain"
                        x={0}
                        y={0}
                        width={capturedPhotoState?.height as number}
                        height={capturedPhotoState?.width as number}
                    />
                )}
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    canvas : {

    }
});

export default ResultsPage;
