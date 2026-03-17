import { loadRuntimeConfig } from '@/config';
import { createDatabase } from '@/lib/db';
import { createStores } from '@/lib/store';
import { RuntimeConfig } from '@/types';

export function getRuntimeConfig(): RuntimeConfig {
  return loadRuntimeConfig();
}

export const runtimeConfig = new Proxy({} as RuntimeConfig, {
  get(_target, prop) {
    const current = getRuntimeConfig();
    return current[prop as keyof RuntimeConfig];
  }
});

export const database = createDatabase(runtimeConfig);
export const stores = createStores(runtimeConfig);
