// Utility to help test offline functionality
export const simulateOffline = () => {
  // Override navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  
  // Trigger offline event
  window.dispatchEvent(new Event('offline'));
  
  console.log('🔌 Simulated offline mode');
};

export const simulateOnline = () => {
  // Override navigator.onLine
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  });
  
  // Trigger online event
  window.dispatchEvent(new Event('online'));
  
  console.log('🌐 Simulated online mode');
};

// Add to window for testing
if (typeof window !== 'undefined') {
  (window as any).simulateOffline = simulateOffline;
  (window as any).simulateOnline = simulateOnline;
}
