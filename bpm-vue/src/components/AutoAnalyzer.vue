<script lang="ts" setup>
import { guess } from 'web-audio-beat-detector';
import { cn } from '../utils/cn';
import BpmButton from './BpmButton.vue';
import { ref } from 'vue';

const listening = ref<boolean>(false);

const emit = defineEmits({
  listenStart: () => true,
  bpmChange: (bpm: number) => true,
});

function handleClick() {
  listening.value = true;
  emit('listenStart');

  listenAudio().then((audioBuffer) => {
    console.log(
      'Audio buffer:',
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    guess(
      increaseContrast(audioBuffer, calculateDynamicGain(audioBuffer, 10)),
      0,
      5
    )
      .then((tempo) => {
        console.warn('TEMPO:', tempo);
        emit('bpmChange', tempo.bpm);
      })
      .catch(() => {
        alert('Nothing found');
      })
      .finally(() => {
        listening.value = false;
      });
  });
}
</script>
<template>
  <BpmButton
    :disabled="listening"
    :custom-class="cn({ 'bg-zinc-100': listening })"
    @click="handleClick">
    Auto
    <small>
      <small>
        <small>
          <i> (Beta)</i>
        </small>
      </small>
    </small>
  </BpmButton>
</template>
<script>

const audioContext = new AudioContext();


function listenAudio(): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
        if (navigator.mediaDevices) {
            return navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);
                    const audioChunks: any = [];

                    mediaRecorder.addEventListener('dataavailable', (event) => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener('stop', () => {
                        const audioBlob = new Blob(audioChunks);
                        const reader = new FileReader();

                        reader.readAsArrayBuffer(audioBlob);
                        reader.onloadend = () => {
                            const arrayBuffer = reader.result as ArrayBuffer;
                            audioContext.decodeAudioData(
                                arrayBuffer,
                                (audioBuffer) => {
                                    // Now you have an AudioBuffer
                                    resolve(audioBuffer);
                                }
                            );
                        };
                    });

                    // Start recording
                    mediaRecorder.start();

                    // For demonstration, stop recording after 5 seconds
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000);
                })
                .catch((err) => console.log('Error:', err));
        } else {
            // browser unable to access media devices
            // (update your browser)

            reject('No media devices');
            return;
        }
    });
}

function increaseContrast(audioBuffer: AudioBuffer, gain: number) {
    // Assuming a mono audio source for simplicity
    const rawData = audioBuffer.getChannelData(0);
    const newData = new Float32Array(rawData.length);

    let quieter = 0;
    let louder = 0;

    for (let i = 0; i < rawData.length; i++) {
        // Apply a non-linear transformation to increase contrast
        // This example uses a simple method to exaggerate differences
        // Adjust this logic to meet your specific requirements
        const sample = rawData[i] * gain;
        if (sample < 0.5 && sample > -0.5) {
            // Quieter sounds
            quieter += 1;
            newData[i] = sample * 0.8; // Reduce amplitude of quieter sounds
        } else {
            // Louder sounds
            louder += 1;
            newData[i] = sample * 1.2; // Increase amplitude of louder sounds
        }

        // Clipping protection
        newData[i] = Math.max(-1, Math.min(1, newData[i]));
    }
    console.log('Quieter:', quieter, 'Louder:', louder);

    // Create a new AudioBuffer to hold the modified data
    const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        rawData.length,
        audioContext.sampleRate
    );
    newBuffer.copyToChannel(newData, 0);

    return newBuffer;
}

/**
 *
 * @param audioBuffer monochannel audio buffer
 * @param targetPeak multiply by 10 what you actually want to eliminate outliers
 * @returns number for gain
 */
function calculateDynamicGain(audioBuffer: AudioBuffer, targetPeak = 10.0) {
    const rawData = audioBuffer.getChannelData(0); // Assuming mono for simplicity

    const tempGain = 1;

    const peakAmplitude = rawData.reduce(
        (prevPeak, dataSample) =>
            Math.abs(dataSample * tempGain) > prevPeak
                ? Math.abs(dataSample * tempGain)
                : prevPeak,
        0
    );

    const gain = peakAmplitude > 0 ? targetPeak / peakAmplitude : 0;

    return Math.max(Math.min(gain, 100), 1);
}
</script>
