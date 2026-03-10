import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiVolume2 } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(8px); }
`;

const Pill = styled.button<{ $leaving: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.85);
  font: 600 0.82rem/1 'Quicksand', sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  appearance: none;
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeIn)} 0.4s ease forwards;
  transition: background 0.2s ease, border-color 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.65);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const VolumeNudge: React.FC = () => {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dismissedRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const checkRef = useRef<number | null>(null);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setLeaving(true);
    setTimeout(() => setShow(false), 400);
  };

  useEffect(() => {
    let cancelled = false;

    const checkVolume = () => {
      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 256;

        const dest = ctx.createMediaStreamDestination();
        const source = ctx.createMediaStreamSource(dest.stream);
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const startTime = Date.now();

        const poll = () => {
          if (cancelled || dismissedRef.current) return;

          // After 4 seconds of showing, auto-dismiss
          if (show && Date.now() - startTime > 4000) {
            dismiss();
            return;
          }

          analyser.getByteFrequencyData(data);
          const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
          const level = avg / 255;

          if (level > 0.2 && show) {
            dismiss();
            return;
          }

          checkRef.current = requestAnimationFrame(poll);
        };

        // Wait a bit for audio to start, then begin checking
        setTimeout(() => {
          if (!cancelled) poll();
        }, 2000);
      } catch {
        // AudioContext not supported — show nudge anyway after delay
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled && !dismissedRef.current) setShow(true);
          }, 3000);
        }
      }
    };

    // Show after 3s — we can't reliably detect system volume from browser
    // so we show briefly and auto-dismiss after 4s
    const timer = setTimeout(() => {
      if (!cancelled && !dismissedRef.current) setShow(true);
    }, 3000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (checkRef.current) cancelAnimationFrame(checkRef.current);
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  // Auto-hide after 4 seconds of being visible
  useEffect(() => {
    if (!show || dismissedRef.current) return;
    const autoHide = setTimeout(() => dismiss(), 4000);
    return () => clearTimeout(autoHide);
  }, [show]);

  if (!show) return null;

  return (
    <Pill $leaving={leaving} onClick={dismiss}>
      <FiVolume2 />
      Turn up your volume — birds, crickets, and thunderstorms await
    </Pill>
  );
};

export default VolumeNudge;
