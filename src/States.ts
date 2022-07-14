import { PhotoFile } from 'react-native-vision-camera';
import { atom } from 'recoil';
import { Character } from './Types';

export const isPictureCaptured = atom({
  key: 'isPictureCaptured',
  default: false,
});

export const capturedPhoto = atom<PhotoFile | undefined>({
  key: 'capturedPhoto',
  default: undefined,
});

export const response = atom<Character[]>({
  key: 'response',
  default: [],
});
