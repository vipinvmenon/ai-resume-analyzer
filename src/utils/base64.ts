/**
 * Base64 encoding utilities
 */

import { BASE64_CHUNK_SIZE } from '@/lib/constants';

/**
 * Convert ArrayBuffer to base64 string in chunks to avoid call stack overflow
 */
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';

  // Process in chunks to avoid call stack overflow
  for (let i = 0; i < uint8Array.length; i += BASE64_CHUNK_SIZE) {
    const chunk = uint8Array.slice(i, i + BASE64_CHUNK_SIZE);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}

