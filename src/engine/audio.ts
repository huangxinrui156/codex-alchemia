let context: AudioContext | undefined;
export function tone(kind: "touch" | "mix") {
  try {
    context ??= new AudioContext();
    const ctx = context;
    void ctx.resume().catch(() => {});
    if (kind === "touch") {
      const buf = ctx.createBuffer(
        1,
        Math.ceil(ctx.sampleRate * 0.05),
        ctx.sampleRate,
      );
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
      const src = ctx.createBufferSource(),
        filter = ctx.createBiquadFilter(),
        gain = ctx.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 1500;
      gain.gain.value = 0.045;
      src.buffer = buf;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      return;
    }
    [523.25, 783.99, 1046.5].forEach((hz, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        start = ctx.currentTime + i * 0.08;
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.07 / (i + 1), start + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.01);
    });
  } catch {
    /* Audio is optional on restricted devices. */
  }
}
