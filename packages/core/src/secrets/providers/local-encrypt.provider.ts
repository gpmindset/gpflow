import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { ISecretProvider } from '@/interfaces/secrets.interface';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const STORAGE_FILE = path.join(os.homedir(), '.gpflow-secrets.json');

export class LocalEncryptProvider implements ISecretProvider {
  private secrets: Record<string, Record<string, string>> = {};
  private readonly key: Buffer;

  constructor(passphrase: string) {
    this.key = crypto.scryptSync(passphrase, 'gpflow-salt', 32);
    this.loadFromDisk();
  }

  private async loadFromDisk() {
    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf8');
      this.secrets = JSON.parse(data);
    } catch (err) {
      this.secrets = {};
    }
  }

  private async saveToDisk() {
    await fs.writeFile(STORAGE_FILE, JSON.stringify(this.secrets, null, 2), 'utf8');
  }

  private encrypt(plainText: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  private decrypt(cipherText: string): string {
    const data = Buffer.from(cipherText, 'base64');
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
  }

  async get(workflowId: string, key: string): Promise<string | undefined> {
    await this.loadFromDisk();
    const userSecrets = this.secrets[workflowId];
    if (!userSecrets || !userSecrets[key]) return undefined;
    return this.decrypt(userSecrets[key]);
  }

  async set(workflowId: string, key: string, value: string): Promise<void> {
    await this.loadFromDisk();
    if (!this.secrets[workflowId]) {
      this.secrets[workflowId] = {};
    }
    this.secrets[workflowId][key] = this.encrypt(value);
    await this.saveToDisk();
  }

  async delete(workflowId: string, key: string): Promise<void> {
    await this.loadFromDisk();
    delete this.secrets[workflowId]?.[key];
    await this.saveToDisk();
  }

  async list(workflowId: string): Promise<string[]> {
    await this.loadFromDisk();
    return Object.keys(this.secrets[workflowId] || {});
  }

  async deleteAll(workflowId: string): Promise<void> {
    await this.loadFromDisk();
    delete this.secrets[workflowId];
    await this.saveToDisk();
  }
}
