import { TimeOfDay } from "@/hooks/celestialPosition";

export const THEME: Record<TimeOfDay, { grad: string[]; glow: string; text: string }> = {
  dawn: {
    grad: ['#FFD36E', '#FF6F48', '#A0409B', '#5A2F87', '#352267'],
    glow: '#FFA52A',
    text: '#FFFFFF',
  },
  morning: {
    grad: ['#FFD700', '#F0E68C', '#87CEFA', '#4682B4'],
    glow: '#FFD700',
    text: '#2c3e50',
  },
  day: {
    grad: ['#E0F6FF', '#89CFF0', '#007FFF', '#0059B2'],
    glow: '#FFFFE0',
    text: '#2c3e50',
  },
  afternoon: {
    grad: ['#FFA500', '#FFC700', '#4169E1', '#483D8B'],
    glow: '#FFCA28',
    text: '#2c3e50',
  },
  dusk: {
    grad: ['#FFB347', '#FF9037', '#E16A34', '#5C2E7F', '#34175A'],
    glow: '#FF9A3C',
    text: '#FFFFFF',
  },
  night: {
    grad: ['#020824', '#03133D', '#06246A', '#0C338E'],
    glow: '#F9F5B1',
    text: '#FFFFFF',
  },
};
