/**
 * Debug logger utility for tracking authentication issues
 */

const DEBUG_ENABLED = true;

export const debugLog = {
  auth: (message, data) => {
    if (DEBUG_ENABLED) {
      console.log(`🔐 Auth: ${message}`, data || '');
    }
  },
  
  session: (message, data) => {
    if (DEBUG_ENABLED) {
      console.log(`👤 Session: ${message}`, data || '');
    }
  },
  
  middleware: (message, data) => {
    if (DEBUG_ENABLED) {
      console.log(`🚫 Middleware: ${message}`, data || '');
    }
  },
  
  api: (message, data) => {
    if (DEBUG_ENABLED) {
      console.log(`🌐 API: ${message}`, data || '');
    }
  },
  
  db: (message, data) => {
    if (DEBUG_ENABLED) {
      console.log(`💾 DB: ${message}`, data || '');
    }
  },
  
  error: (message, error) => {
    console.error(`❌ ERROR: ${message}`, error || '');
  }
};
