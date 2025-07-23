// components/RainEffect.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Rain } from 'react-rainfall';

interface RainEffectProps {
  height?: string;
  width?: string;
  className?: string;
  volume?: number;
}

const RainEffect: React.FC<RainEffectProps> = ({
  height = '110vh',
  width = '100%',
  className = '',
  volume = 0.4,
}) => {
  const [flash, setFlash] = useState(false);
  // Use refs to hold a single instance of the Audio objects
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
  // This ref will hold the cleanup function for our interaction listener
  const cleanupInteractionListener = useRef<() => void>(() => {});

  // This effect runs only once on mount to set up all audio
  useEffect(() => {
    // Initialize audio objects
    const rainAudio = new Audio('/assets/rain.mp3');
    const thunderAudio = new Audio('/assets/thunder.mp3');

    // Configure audio properties
    rainAudio.loop = true;
    rainAudio.volume = volume;
    thunderAudio.volume = volume;

    // Store them in refs
    rainAudioRef.current = rainAudio;
    thunderAudioRef.current = thunderAudio;

    let thunderTimeout: NodeJS.Timeout;

    // A single function to start the thunder/lightning loop
    const startThunderLoop = () => {
      // Clear any existing timeout to prevent duplicates
      clearTimeout(thunderTimeout);
      
      const trigger = () => {
        setFlash(true);
        thunderAudio.currentTime = 0;
        thunderAudio.play().catch(e => console.error("Thunder playback failed:", e));
        setTimeout(() => setFlash(false), 100);

        // Set timeout for the next thunder clap
        const nextInterval = Math.random() * 20000 + 10000;
        thunderTimeout = setTimeout(trigger, nextInterval);
      };
      // Set the first thunder clap after an initial random delay
      thunderTimeout = setTimeout(trigger, Math.random() * 8000 + 3000);
    };

    // --- Autoplay Handling ---
    const playPromise = rainAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay was successful!
          console.log("Audio autoplay succeeded.");
          startThunderLoop(); // Just start the thunder, rain is already playing.
        })
        .catch(error => {
          // Autoplay was prevented.
          console.warn("Audio autoplay was blocked. Waiting for user interaction.");
          
          // Define a single function to start all audio on interaction
          const startAudioOnInteraction = () => {
            console.log("User interaction detected, starting audio.");
            rainAudio.play();
            startThunderLoop();
            
            // Clean up the listeners so this only runs once
            window.removeEventListener('click', startAudioOnInteraction);
            window.removeEventListener('touchstart', startAudioOnInteraction);
          };

          // Add listeners for the first interaction
          window.addEventListener('click', startAudioOnInteraction);
          window.addEventListener('touchstart', startAudioOnInteraction);

          // Store the cleanup logic in our ref
          cleanupInteractionListener.current = () => {
            window.removeEventListener('click', startAudioOnInteraction);
            window.removeEventListener('touchstart', startAudioOnInteraction);
          };
        });
    }

    // --- Master Cleanup Function ---
    return () => {
      rainAudio.pause();
      thunderAudio.pause();
      clearTimeout(thunderTimeout);
      // This will remove the interaction listener if it was ever created
      cleanupInteractionListener.current();
    };
  }, []); // The empty array ensures this effect runs only once on mount

  useEffect(() => {
    if (rainAudioRef.current) {
      rainAudioRef.current.volume = volume;
    }
    if (thunderAudioRef.current) {
      thunderAudioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div
      className={className}
      style={{ position: 'fixed', height, width, overflow: 'hidden' }}
    >
      <Rain numDrops={200} />
      {flash && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

export default RainEffect;