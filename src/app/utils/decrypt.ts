export function decrypt(encryptedText: string, key: string): string {
  if (!encryptedText || typeof encryptedText !== 'string') {
    return encryptedText || '';
  }
  
  const parts = encryptedText.split(":");
  if (!parts || parts.length < 2) {
    return encryptedText;
  }
  
  const encrypted = parts[1];
  if (!encrypted) {
    return encryptedText;
  }

  let decrypted = "";
  for (let i = 0; i < encrypted.length; i += 2) {
    const encryptedChar = parseInt(encrypted.substr(i, 2), 16);
    const keyChar = key.charCodeAt((i / 2) % key.length);
    decrypted += String.fromCharCode(encryptedChar ^ keyChar);
  }

  return decrypted;
}
