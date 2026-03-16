import React from 'react';

export interface BlockProps<TData = any, TConfig = any> {
  id: string;
  isEditMode: boolean;
  content?: TData;
  config?: TConfig;
  styles?: React.CSSProperties;
  depth: number;
  onChange?: (updates: Partial<{ content: TData; config: TConfig; styles: React.CSSProperties }>) => void;
}

// Ensure resolver returns the dynamic data to be injected into 'content' properties
export type BlockResolver<TConfig = any, TData = any> = (config: TConfig) => Promise<TData>;

export interface BlockDefinition<TData = any, TConfig = any> {
  type: string;
  name: string;
  description?: string;
  icon?: React.ElementType; // Lucide or any icon
  defaultContent?: TData;
  defaultConfig?: TConfig;
  component: React.ComponentType<BlockProps<TData, TConfig>>;
  resolver?: BlockResolver<TConfig, TData>;
}

class BlockRegistry {
  private blocks = new Map<string, BlockDefinition>();

  register(definition: BlockDefinition) {
    if (this.blocks.has(definition.type)) {
      console.warn(`Block with type ${definition.type} is already registered.`);
    }
    this.blocks.set(definition.type, definition);
  }

  get(type: string): BlockDefinition | undefined {
    return this.blocks.get(type);
  }

  getAll(): BlockDefinition[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Used on the server-side to resolve dynamic blocks before rendering
   */
  async resolveBlockData(type: string, config: any): Promise<any | null> {
    const def = this.get(type);
    if (!def || !def.resolver) {
      return null;
    }
    try {
      return await def.resolver(config || def.defaultConfig);
    } catch (err) {
      console.error(`Error resolving block ${type}:`, err);
      return null;
    }
  }
}

export const blockRegistry = new BlockRegistry();
