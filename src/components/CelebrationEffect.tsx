import { useEffect } from "react";

interface CelebrationEffectProps {
  onComplete?: () => void;
}

const CelebrationEffect = ({ onComplete }: CelebrationEffectProps) => {
  useEffect(() => {
    // Play celebration sound
    playCelebrationSound();
    
    // Call onComplete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const playCelebrationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a sequence of notes for celebration
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      
      const startTime = audioContext.currentTime + (index * 0.15);
      const duration = 0.2;
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  };

  // Generate random positions for emojis
  const emojis = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: i % 2 === 0 ? "🎉" : "👏",
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {emojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-celebration"
          style={{
            left: `${item.left}%`,
            top: "-10%",
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes celebration {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(10vh) rotate(180deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) scale(0.8);
            opacity: 0;
          }
        }
        .animate-celebration {
          animation: celebration 2s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default CelebrationEffect;
