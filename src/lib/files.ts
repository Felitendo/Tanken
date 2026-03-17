import fs from 'node:fs';
import path from 'node:path';

export function ensureDirectory(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function ensureJsonFile<T>(filePath: string, fallback: T): void {
  if (!fs.existsSync(filePath)) {
    writeJson(filePath, fallback);
  }
}

export function loadJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(filePath: string, data: unknown): void {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
