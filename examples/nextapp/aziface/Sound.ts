/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FaceTecCustomization } from '../public/core/facetec/FaceTecCustomization';
const FACESCAN_SUCCESSFUL_SOUND_FILE = '/vocal/facescan_successful_sound_file.mp3';
const PLEASE_FRAME_YOUR_FACE_SOUND_FILE = '/vocal/please_frame_your_face_sound_file.mp3';
const PLEASE_MOVE_CLOSER_SOUND_FILE = '/vocal/please_move_closer_sound_file.mp3';
const PLEASE_PRESS_BUTTON_SOUND_FILE = '/vocal/please_press_button_sound_file.mp3';
const PLEASE_RETRY_SOUND_FILE = '/vocal/please_retry_sound_file.mp3';
const UPLOADING_SOUND_FILE = '/vocal/uploading_sound_file.mp3';
export class Sound {
  public setVocalGuidanceSoundFiles = (currentCustomization: FaceTecCustomization): FaceTecCustomization => {
    currentCustomization.vocalGuidanceCustomization ??= {} as any;
    currentCustomization.vocalGuidanceCustomization.pleaseFrameYourFaceInTheOvalSoundFile =
      PLEASE_FRAME_YOUR_FACE_SOUND_FILE as string;
    currentCustomization.vocalGuidanceCustomization.pleaseMoveCloserSoundFile = PLEASE_MOVE_CLOSER_SOUND_FILE as string;
    currentCustomization.vocalGuidanceCustomization.pleaseRetrySoundFile = PLEASE_RETRY_SOUND_FILE as string;
    currentCustomization.vocalGuidanceCustomization.uploadingSoundFile = UPLOADING_SOUND_FILE as string;
    currentCustomization.vocalGuidanceCustomization.facescanSuccessfulSoundFile =
      FACESCAN_SUCCESSFUL_SOUND_FILE as string;
    currentCustomization.vocalGuidanceCustomization.pleasePressTheButtonToStartSoundFile =
      PLEASE_PRESS_BUTTON_SOUND_FILE as string;
    return currentCustomization;
  };
}
