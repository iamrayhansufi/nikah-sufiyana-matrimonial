/**
 * Enhanced logging system for database operations
 * This provides consistent logging across database operations while
 * protecting sensitive information like connection strings
 */

/**
 * Log a database operation with masked sensitive information
 */
export function logDbOperation(operation: string, details: Record<string, any> = {}) {
  // Add timestamp and operation
  const logData: Record<string, any> = {
    timestamp: new Date().toISOString(),
    operation,
    ...details
  };
  
  // Mask sensitive information
  if (logData.connectionString) {
    logData.connectionString = maskConnectionString(logData.connectionString);
  }
  
  if (logData.url) {
    logData.url = maskConnectionString(logData.url);
  }
    // Skip logging passwords and secrets
  const skipKeys = ['password', 'secret', 'token', 'key'];
  const sanitizedData: Record<string, any> = { ...logData };
  
  for (const key of Object.keys(sanitizedData)) {
    if (skipKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitizedData[key] = '[REDACTED]';
    }
  }
  
  console.log(`[DB] ${operation}:`, sanitizedData);
}

/**
 * Log a database error with helpful details
 */
export function logDbError(operation: string, error: unknown, details: Record<string, any> = {}) {
  let errorMessage = '';
  let errorStack = '';
  let errorType = 'Unknown';
  
  // Extract error information
  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || '';
    errorType = error.constructor.name;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }
  
  // Categorize common database errors
  const errorCategory = categorizeDbError(errorMessage);
  
  // Log the error with categorization
  console.error(`[DB ERROR] ${operation} - ${errorCategory}:`, {
    errorType,
    errorMessage,
    ...details,
    // Include stack trace in development only
    ...(process.env.NODE_ENV === 'development' ? { stack: errorStack } : {})
  });
}

/**
 * Categorize common database errors for easier troubleshooting
 */
function categorizeDbError(errorMessage: string): string {
  const lowerCaseError = errorMessage.toLowerCase();
  
  if (lowerCaseError.includes('password authentication')) {
    return 'Authentication Failed';
  } else if (lowerCaseError.includes('connection') && lowerCaseError.includes('timeout')) {
    return 'Connection Timeout';
  } else if (lowerCaseError.includes('duplicate key') || lowerCaseError.includes('unique constraint')) {
    return 'Duplicate Entry';
  } else if (lowerCaseError.includes('relation') && lowerCaseError.includes('does not exist')) {
    return 'Missing Table';
  } else if (lowerCaseError.includes('column') && lowerCaseError.includes('does not exist')) {
    return 'Missing Column';
  } else if (lowerCaseError.includes('ssl')) {
    return 'SSL Connection Issue';
  } else if (lowerCaseError.includes('connection refused')) {
    return 'Connection Refused';
  } else {
    return 'General Error';
  }
}

/**
 * Mask sensitive information in connection strings
 */
function maskConnectionString(connectionString: string): string {
  if (!connectionString) return '';
  
  try {
    // Simple mask for postgres URLs
    // Format: postgres://username:password@hostname:port/database
    return connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//\\1:********@');
  } catch (e) {
    return '[Error masking connection string]';
  }
}
