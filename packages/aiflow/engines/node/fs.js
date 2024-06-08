import fs from 'fs/promises'; // Import the promise-based methods
import path from 'path';
import settings from '../../settings.js';

// Higher-order function for applying standard error handling and callbacks
const withErrorHandling = (fn) => {
  return async (filePath, ...args) => {
    let handlers = args[args.length - 1];
    const hasCallbackSignature = handlers?.__callbacks;
    if (!hasCallbackSignature) {
      handlers = {};
    } else {
      args.pop(); // Remove handlers from args if it is actually the handlers object
    }

    try {
      const result = await fn(filePath, ...args);
      handlers.success?.(result);
      return result;
    } catch (error) {
      handlers.error?.(error);
      if (settings.BREAK_ON_ERROR || handlers.breakOnError) {
        throw error; // Configurable: either global or per-call basis
      } else {
        console.error("Error occurred:", error);
        return handlers.defaultValue; // Use provided default value on error
      }
    } finally {
      handlers.finally?.();
    }
  };
};

export const fileExists = withErrorHandling(async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});

export const isFile = withErrorHandling(async (filePath) => {
  const stats = await fs.stat(filePath);
  return stats.isFile();
});

export const isDirectory = withErrorHandling(async (filePath) => {
  const stats = await fs.stat(filePath);
  return stats.isDirectory();
});

export const readFile = withErrorHandling((filePath) => fs.readFile(filePath, 'utf-8'));

export const readDir = withErrorHandling((dirPath, config = {}) => fs.readdir(dirPath, config));

export const createDir = withErrorHandling((dirPath) => fs.mkdir(dirPath, { recursive: true }));

export const writeFile = withErrorHandling((filePath, data) => fs.writeFile(filePath, data, 'utf-8'));

export const importFile = withErrorHandling(async (filePath) => (await import(filePath)).default);

// Path operations
export const resolvePath = (...args) => path.resolve(...args);
export const joinPath = (...args) => path.join(...args);
export const dirname = (filePath) => path.dirname(filePath);
export const basename = (filePath) => path.basename(filePath);