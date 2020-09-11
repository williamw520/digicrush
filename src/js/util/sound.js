/*
  Digi Crush
  A game to crush the digits.
  Copyright (C) 2020 William Wong.  All rights reserved.
  williamw520@gmail.com
*/

export class SoundGenerator {

    constructor(audioCtx, toFilter) {
        this.audioCtx = audioCtx;
        this.gain = this.audioCtx.createGain();                                 // create the gain node
        this.gain.connect(toFilter ? toFilter : this.audioCtx.destination);     // connect to the optional toFilter node or just to the audio context's sink.
    }

    // play a sound of the wave type at the frequency and at the volume, optionally with a delay time.
    play(waveType, frequency, volume, delaySeconds) {
        this.oscillator = this.audioCtx.createOscillator();                     // new oscillator for every play() call.
        this.oscillator.connect(this.gain);                                     // hook it up to the gain node, and then to the destination sink.
        this.oscillator.type = waveType || "sine";
        this.frequency(frequency, delaySeconds);
        const adjustment = 0.02;                                                // turn down the volume 20ms before play time.
        const adjustedStartTime = delaySeconds ? delaySeconds - adjustment : 0; // compute the start time for playing.
        const volumeRestoreTime = delaySeconds ? delaySeconds : adjustment;     // compute the time to restore the volume.
        this.volume(1/1000, adjustedStartTime);                                 // turn down the volume before playing to avoid starting noise.
        this.oscillator.start(adjustedStartTime);                               // start playing the wave
        this.volume(volume, volumeRestoreTime);                                 // restore the volume
        return this;
    }

    stop(delaySeconds) {
        let timeToVolumeDown    = this.audioCtx.currentTime + (delaySeconds ? delaySeconds - 0.05 : 0);
        let timeToStop          = this.audioCtx.currentTime + (delaySeconds ? delaySeconds : 0.05);
        this.gain.gain.setTargetAtTime(1/1000, timeToVolumeDown, 0.02);         // wind down the gain volume 50ms before stopping.
        this.oscillator.stop(timeToStop);
        return this;
    }

    wave(waveType) {
        if (this.oscillator && waveType)
            this.oscillator.type = waveType;
        return this;
    }

    frequency(frequency, delaySeconds) {
        if (this.oscillator) {
            let effectiveTime = this.audioCtx.currentTime + (delaySeconds ? delaySeconds : 0);
            this.oscillator.frequency.setValueAtTime(frequency, effectiveTime);
        }
        return this;
    }

    volume(volume, delaySeconds) {
        let effectiveTime = this.audioCtx.currentTime + (delaySeconds ? delaySeconds : 0);
        this.gain.gain.exponentialRampToValueAtTime(volume, effectiveTime);
        return this;
    }
    
}
