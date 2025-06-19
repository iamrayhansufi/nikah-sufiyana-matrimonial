// Simple notification sound generator
export const createNotificationSound = () => {
  let audioContext: AudioContext | null = null;
  
  const initAudioContext = () => {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('Audio context created successfully');
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return null;
      }
    }
    return audioContext;
  };
  
  const playNotificationSound = () => {
    const ctx = initAudioContext();
    if (!ctx) {
      console.warn('Cannot play sound: no audio context');
      return;
    }
    
    try {
      // Resume audio context if it's suspended (browser requirement)
      if (ctx.state === 'suspended') {
        console.log('Resuming suspended audio context');
        ctx.resume().then(() => {
          console.log('Audio context resumed');
          createAndPlaySound(ctx);
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      } else {
        createAndPlaySound(ctx);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  
  const createAndPlaySound = (ctx: AudioContext) => {
    try {
      // Create a simple pleasant notification sound
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Set frequencies for a pleasant chord
      oscillator1.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator2.frequency.setValueAtTime(1200, ctx.currentTime);
      
      // Set the wave type
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      // Connect the oscillators to the gain node
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Set volume (0.1 = 10% volume)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      // Start and stop the sound
      oscillator1.start(ctx.currentTime);
      oscillator2.start(ctx.currentTime);
      oscillator1.stop(ctx.currentTime + 0.5);
      oscillator2.stop(ctx.currentTime + 0.5);
      
      console.log('Notification sound played successfully');
    } catch (error) {
      console.error('Error creating notification sound:', error);
    }
  };
  
  return playNotificationSound;
};
