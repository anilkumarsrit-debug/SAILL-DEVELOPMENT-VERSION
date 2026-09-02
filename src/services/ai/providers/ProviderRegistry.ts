/**
 * SAILL Enterprise AI Platform - Provider Registry
 *
 * Registry for managing AI providers and executing automatic failover.
 */

import { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { FallbackProvider } from './FallbackProvider';
import { defaultAIConfig } from '../aiConfig';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, AIProvider> = new Map();
  private primaryProviderId: string;
  private fallbackProviderId: string;

  private constructor() {
    // Register built-in providers
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new FallbackProvider());

    this.primaryProviderId = defaultAIConfig.providerConfig.primaryProvider;
    this.fallbackProviderId = defaultAIConfig.providerConfig.fallbackProvider;
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public registerProvider(provider: AIProvider) {
    this.providers.set(provider.id, provider);
  }

  public getProvider(id: string): AIProvider | undefined {
    return this.providers.get(id);
  }

  public getPrimaryProvider(): AIProvider {
    return this.providers.get(this.primaryProviderId) || new GeminiProvider();
  }

  public getFallbackProvider(): AIProvider {
    return this.providers.get(this.fallbackProviderId) || new FallbackProvider();
  }

  public setPrimaryProvider(id: string) {
    if (this.providers.has(id)) {
      this.primaryProviderId = id;
    }
  }

  public listProviders(): { id: string; name: string }[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name
    }));
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
