import CryptoJS from 'crypto-js';

export function base64Encode(text: string): string {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    throw new Error('Invalid input for Base64 encoding');
  }
}

export function base64Decode(base64: string): string {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    throw new Error('Invalid URL encoded string');
  }
}

export function htmlEncode(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function htmlDecode(text: string): string {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || '';
}

export function unixToHuman(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

export function humanToUnix(dateString: string): number {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

export function hexToAscii(hex: string): string {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  
  let result = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    const byte = parseInt(cleanHex.substr(i, 2), 16);
    result += String.fromCharCode(byte);
  }
  return result;
}

export function asciiToHex(ascii: string): string {
  let result = '';
  for (let i = 0; i < ascii.length; i++) {
    const hex = ascii.charCodeAt(i).toString(16);
    result += hex.padStart(2, '0');
  }
  return result.toUpperCase();
}

export function generateHash(text: string, algorithm: string): string {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(text).toString();
    case 'sha1':
      return CryptoJS.SHA1(text).toString();
    case 'sha256':
      return CryptoJS.SHA256(text).toString();
    case 'sha512':
      return CryptoJS.SHA512(text).toString();
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}

export function convertNumberBase(value: string, fromBase: number, toBase: number): string {
  if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
    throw new Error('Base must be between 2 and 36');
  }
  
  const decimal = parseInt(value, fromBase);
  if (isNaN(decimal)) {
    throw new Error('Invalid number for the specified base');
  }
  
  return decimal.toString(toBase).toUpperCase();
}

export function convertStringCase(text: string, caseType: string): string {
  switch (caseType) {
    case 'camelCase':
      return text.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
    case 'PascalCase':
      return text.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
        .replace(/^(.)/, (char) => char.toUpperCase());
    case 'snake_case':
      return text.replace(/[-\s]+/g, '_').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
    case 'kebab-case':
      return text.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    case 'SCREAMING_SNAKE_CASE':
      return text.replace(/[-\s]+/g, '_').replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
    case 'lowercase':
      return text.toLowerCase();
    case 'UPPERCASE':
      return text.toUpperCase();
    case 'Title Case':
      return text.replace(/\b\w/g, char => char.toUpperCase());
    default:
      return text;
  }
}

export function escapeBackslashes(text: string): string {
  return text.replace(/\\/g, '\\\\');
}

export function unescapeBackslashes(text: string): string {
  return text.replace(/\\\\/g, '\\');
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateRandomString(length: number, charset: string): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export function sortLines(text: string, ascending: boolean = true): string {
  const lines = text.split('\n');
  lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
  return lines.join('\n');
}

export function deduplicateLines(text: string): string {
  const lines = text.split('\n');
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join('\n');
}
