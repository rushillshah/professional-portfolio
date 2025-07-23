const ScrollIndicator = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      pointerEvents: 'none',
      animation: 'bounce 2s infinite',
      fontSize: '24px',
      opacity: 0.7,
    }}>
      ↓
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 10px); }
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;
