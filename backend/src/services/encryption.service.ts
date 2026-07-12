import crypto from 'crypto';

const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';

export class EncryptionService {
  /**
   * Generate RSA key pair for user
   */
  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.ENCRYPTION_PASSPHRASE as string,
      },
    });
  }

  /**
   * Encrypt data with AES-256
   */
  static encryptData(data: string, encryptionKey: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypt data with AES-256
   */
  static decryptData(encryptedData: string, encryptionKey: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }

  /**
   * Encrypt with public key (RSA)
   */
  static encryptWithPublicKey(publicKey: string, data: string): string {
    const buffer = Buffer.from(data, 'utf-8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  /**
   * Decrypt with private key (RSA)
   */
  static decryptWithPrivateKey(privateKey: string, encryptedData: string, passphrase: string): string {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          passphrase: passphrase,
        },
        buffer
      );
      return decrypted.toString('utf-8');
    } catch (error) {
      throw new Error('Failed to decrypt data with private key');
    }
  }

  /**
   * Generate file hash for integrity verification
   */
  static generateFileHash(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verify file hash
   */
  static verifyFileHash(data: Buffer, hash: string): boolean {
    const calculatedHash = this.generateFileHash(data);
    return calculatedHash === hash;
  }
}
