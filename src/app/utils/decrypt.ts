export function decrypt(encryptedText: string, key: string): string {
  const parts = encryptedText.split(":");
  const encrypted = parts[1];

  let decrypted = "";
  for (let i = 0; i < encrypted.length; i += 2) {
    const encryptedChar = parseInt(encrypted.substr(i, 2), 16);
    const keyChar = key.charCodeAt((i / 2) % key.length);
    decrypted += String.fromCharCode(encryptedChar ^ keyChar);
  }

  return decrypted;
}
