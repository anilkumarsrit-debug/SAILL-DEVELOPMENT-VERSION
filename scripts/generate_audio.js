import fs from 'fs';
import path from 'path';

// Generate a 13-second beautiful ambient piano + soft pad WAV audio file (44100 Hz, 16-bit stereo)
const sampleRate = 44100;
const duration = 13.0; // 13 seconds
const numSamples = Math.floor(sampleRate * duration);
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = numSamples * blockAlign;
const buffer = Buffer.alloc(44 + dataSize);

// Write WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
buffer.writeUInt16LE(numChannels, 22); // NumChannels
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(byteRate, 28); // ByteRate
buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Musical notes and chords (D major key: D, F#, A, C#, E, G)
// Chord progressions: Dmaj9 (0-3.5s), Gmaj9 (3.5-7.0s), Bm9 (7.0-10.2s), Dadd9 (10.2-13.0s)
const chords = [
  { start: 0.0, end: 3.6, freqs: [146.83, 220.0, 277.18, 369.99, 554.37] }, // D3, A3, C#4, F#4, C#5
  { start: 3.4, end: 7.2, freqs: [98.0, 196.0, 246.94, 293.66, 369.99] },   // G2, G3, B3, D4, F#4
  { start: 6.9, end: 10.4, freqs: [123.47, 185.0, 220.0, 293.66, 554.37] }, // B2, F#3, A3, D4, C#5
  { start: 10.1, end: 13.0, freqs: [146.83, 220.0, 293.66, 369.99, 587.33] } // D3, A3, D4, F#4, D5
];

// Piano / chime arpeggio melody
const melody = [
  { time: 0.3, freq: 440.0, dur: 1.8, pan: -0.2 },   // A4
  { time: 0.9, freq: 554.37, dur: 1.8, pan: 0.2 },  // C#5
  { time: 1.6, freq: 659.25, dur: 2.0, pan: -0.1 },  // E5
  { time: 2.4, freq: 739.99, dur: 2.2, pan: 0.3 },  // F#5

  { time: 3.6, freq: 587.33, dur: 1.8, pan: -0.3 },  // D5
  { time: 4.3, freq: 440.0, dur: 1.8, pan: 0.1 },   // A4
  { time: 5.0, freq: 739.99, dur: 2.0, pan: 0.3 },  // F#5
  { time: 5.8, freq: 880.0, dur: 2.4, pan: -0.2 },  // A5

  { time: 7.1, freq: 739.99, dur: 1.8, pan: -0.2 },  // F#5
  { time: 7.8, freq: 587.33, dur: 1.8, pan: 0.2 },  // D5
  { time: 8.5, freq: 659.25, dur: 2.0, pan: -0.1 },  // E5
  { time: 9.3, freq: 554.37, dur: 2.2, pan: 0.3 },  // C#5

  { time: 10.3, freq: 659.25, dur: 2.0, pan: -0.2 }, // E5
  { time: 10.9, freq: 880.0, dur: 2.2, pan: 0.2 },  // A5
  { time: 11.5, freq: 739.99, dur: 2.5, pan: -0.1 }, // F#5
  { time: 12.0, freq: 1174.66, dur: 2.8, pan: 0.0 } // D6 (Sparkling resolution)
];

for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;

  // Master Envelope (Fade in 1.2s, Fade out 2.5s)
  let masterEnv = 1.0;
  if (t < 1.2) {
    masterEnv = (t / 1.2) * (t / 1.2);
  } else if (t > 10.5) {
    const fadeProgress = (t - 10.5) / 2.5;
    masterEnv = Math.max(0, 1.0 - fadeProgress * fadeProgress);
  }

  let sampleLeft = 0;
  let sampleRight = 0;

  // 1. Pad Chords
  for (const chord of chords) {
    if (t >= chord.start && t <= chord.end) {
      const chordT = t - chord.start;
      const chordDur = chord.end - chord.start;
      let padEnv = 1.0;
      if (chordT < 0.8) {
        padEnv = chordT / 0.8;
      } else if (chordT > chordDur - 0.9) {
        padEnv = (chordDur - chordT) / 0.9;
      }

      for (let k = 0; k < chord.freqs.length; k++) {
        const freq = chord.freqs[k];
        const detune = (k % 2 === 0 ? 1.002 : 0.998);
        const osc1 = Math.sin(2 * Math.PI * freq * t);
        const osc2 = Math.sin(2 * Math.PI * freq * detune * t);
        const oscSub = Math.sin(2 * Math.PI * (freq * 0.5) * t);

        const padVal = (osc1 * 0.4 + osc2 * 0.4 + oscSub * 0.2) * padEnv * 0.055;
        const pan = (k % 2 === 0 ? 0.35 : -0.35);
        sampleLeft += padVal * (0.5 - pan * 0.5);
        sampleRight += padVal * (0.5 + pan * 0.5);
      }
    }
  }

  // 2. Piano / Chime Notes
  for (const note of melody) {
    if (t >= note.time && t <= note.time + note.dur) {
      const noteT = t - note.time;
      // Exponential decay
      const attack = Math.min(1.0, noteT / 0.015);
      const decay = Math.exp(-noteT * 2.8);
      const noteEnv = attack * decay;

      const f = note.freq;
      const oscFundamental = Math.sin(2 * Math.PI * f * t);
      const osc2nd = Math.sin(2 * Math.PI * f * 2 * t) * 0.4;
      const osc3rd = Math.sin(2 * Math.PI * f * 3 * t) * 0.15;
      const oscShimmer = Math.sin(2 * Math.PI * f * 4 * t) * 0.08 * Math.exp(-noteT * 6.0);

      const noteVal = (oscFundamental + osc2nd + osc3rd + oscShimmer) * noteEnv * 0.12;
      const pan = note.pan;
      sampleLeft += noteVal * (0.5 - pan * 0.5);
      sampleRight += noteVal * (0.5 + pan * 0.5);
    }
  }

  // Master gain
  sampleLeft = sampleLeft * masterEnv * 0.85;
  sampleRight = sampleRight * masterEnv * 0.85;

  // Soft clipping
  sampleLeft = Math.max(-0.95, Math.min(0.95, sampleLeft));
  sampleRight = Math.max(-0.95, Math.min(0.95, sampleRight));

  // Convert to 16-bit PCM integer
  const intL = Math.floor(sampleLeft * 32767);
  const intR = Math.floor(sampleRight * 32767);

  const offset = 44 + i * 4;
  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
}

const outDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, 'saill_intro.wav');
fs.writeFileSync(outPath, buffer);
console.log(`Successfully generated intro audio WAV file: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
