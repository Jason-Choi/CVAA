import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    Canvas,
    Group,
    Image,
    Rect,
    useImage,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';

import { useRecoilState } from 'recoil';
import { Routes } from '../Routes';
import { capturedPhoto, response, pixelRatio } from '../States';

import Slider from '@react-native-community/slider';
import { scaleLinear } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';
import { Character } from '../Types';

type Props = NativeStackScreenProps<Routes, 'ResultsPage'>;

const ResultsPage = ({ navigation }: Props) => {
    const [responseState] = useRecoilState(response);
    const [selectedResponse, setSelectedResponse] = useState<Character[]>([]);
    const [capturedPhotoState] = useRecoilState(capturedPhoto);
    const [currentVAState, setCurrentVAState] = useState(0);
    const [pixelRatioState, setPixelRatioState] = useRecoilState(pixelRatio);
    const picture = useImage('file://' + capturedPhotoState?.path);

    const vaList = useMemo(
        () =>
            [...new Set(responseState.map(x => x.eye_sight))].sort(
                (a, b) => a - b,
            ),
        [responseState],
    );

    const colorMap = useMemo(() => {
        const scale = scaleLinear()
            .domain([vaList[0], vaList[vaList.length - 1]])
            .range([0, 1]);
        return (value: number) => interpolateViridis(scale(value));
    }, [vaList]);

    useEffect(() => {
        setSelectedResponse(
            responseState.filter(x => x.eye_sight === currentVAState),
        );
    }, [currentVAState]);

    if (picture === null || responseState === null) return null;

    const size = {
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height,
        pictureWidth: capturedPhotoState?.height as number,
        pictureHeight: capturedPhotoState?.width as number,
    };
    const scale = (s: number) => (s * size.windowWidth) / size.pictureWidth;

    const styles = StyleSheet.create({
        container: {
            position: 'relative',
        },
        canvas: {
            width: size.windowWidth,
            height: size.windowHeight,
        },
        slider: {
            width: size.windowWidth,
            height: 50,
        },
        control: {
            position: 'absolute',
            bottom: -20,
            height: 150,
            alignItems: 'center',
        },
        textinput: {
            width: size.windowWidth,
            height: 50,
            borderColor: 'gray',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
        },
    });
    console.log(currentVAState, pixelRatioState, vaList);
    return (
        <View>
            <View style={styles.container}>
                <Canvas style={styles.canvas}>
                    <Image
                        image={picture}
                        fit="contain"
                        x={0}
                        y={
                            (size.windowHeight - scale(size.pictureHeight)) *
                            -0.5
                        }
                        width={size.windowWidth}
                        height={size.windowHeight}
                    />
                    {selectedResponse.map((box, i) => (
                        <Group key={i}>
                            <Rect
                                x={scale(box.x1)}
                                y={scale(box.y1)}
                                width={scale(box.x2 - box.x1)}
                                height={scale(box.y2 - box.y1)}
                                color={colorMap(box.eye_sight)}
                                strokeWidth={2}
                                style="fill"
                                opacity={0.5}
                            />
                        </Group>
                    ))}
                </Canvas>
            </View>
            <View style={styles.control}>
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: colorMap(currentVAState),
                    }}
                >
                    {`${((currentVAState * pixelRatioState) / 100)
                        .toString()
                        .slice(0, 3)}`}
                </Text>

                <Slider
                    style={styles.textinput}
                    minimumValue={vaList[0]}
                    maximumValue={vaList[vaList.length - 1]}
                    step={0.1}
                    value={currentVAState}
                    onValueChange={value => {
                        if (vaList.includes(value)) setCurrentVAState(value);
                        else {
                            const index = vaList.findIndex(x => x > value);
                            vaList[index] - value > value - vaList[index - 1]
                                ? setCurrentVAState(vaList[index - 1])
                                : setCurrentVAState(vaList[index]);
                        }
                    }}
                />
                <TextInput
                    style={styles.slider}
                    value={`${pixelRatioState}`}
                    onChangeText={text => {
                        setPixelRatioState(Number(text));
                    }}
                />
            </View>
        </View>
    );
};

export default ResultsPage;
