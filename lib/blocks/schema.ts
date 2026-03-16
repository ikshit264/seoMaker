import { z } from 'zod';

export const BreakpointSchema = z.enum(['lg', 'md', 'sm', 'xs', 'xxs']);
export type Breakpoint = z.infer<typeof BreakpointSchema>;

export const LayoutItemSchema = z.object({
  i: z.string(), // block id
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
  minW: z.number().int().optional(),
  maxW: z.number().int().optional(),
  minH: z.number().int().optional(),
  maxH: z.number().int().optional(),
  isDraggable: z.boolean().optional(),
  isResizable: z.boolean().optional(),
  isBounded: z.boolean().optional(),
});
export type LayoutItem = z.infer<typeof LayoutItemSchema>;

export const ResponsiveLayoutSchema = z.record(BreakpointSchema, z.array(LayoutItemSchema));
export type ResponsiveLayout = z.infer<typeof ResponsiveLayoutSchema>;

export const BlockTypeSchema = z.enum([
  'heading',
  'paragraph',
  'image',
  'code',
  'quote',
  'divider',
  'video',
  'recent-blogs',
  'related-articles',
  'author-profile',
  'pricing-cards',
  'contact-form',
  'newsletter-signup',
  'product-list',
  'faq-list',
  'cta-section'
]);
export type BlockType = z.infer<typeof BlockTypeSchema> | string;

export const BlockDataSchema = z.object({
  id: z.string(),
  type: z.string(), // Extensible: use string instead of enum for future custom blocks
  content: z.any().optional(), // Static content
  config: z.record(z.string(), z.any()).optional(), // Config for dynamic blocks
  styles: z.record(z.string(), z.any()).optional(), // Optional style overrides
});
export type BlockData = z.infer<typeof BlockDataSchema>;

export const PageMetadataSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  lastUpdated: z.string().datetime().optional(),
  version: z.string().optional(),
}).catchall(z.any());
export type PageMetadata = z.infer<typeof PageMetadataSchema>;

export const LayoutJsonSchema = z.object({
  metadata: PageMetadataSchema.optional(),
  layout: ResponsiveLayoutSchema,
  blocks: z.array(BlockDataSchema),
});
export type LayoutJson = z.infer<typeof LayoutJsonSchema>;

// Validate a full Layout JSON object with basic sanity checks
export function validateLayoutJson(data: unknown): LayoutJson {
  const parsed = LayoutJsonSchema.parse(data);

  // Custom validation: ensure every block ID in layout has a corresponding block in blocks array
  // and vice versa, although we don't strictly require 1:1, it's good to check block IDs are unique.
  const blockIds = new Set(parsed.blocks.map(b => b.id));
  if (blockIds.size !== parsed.blocks.length) {
    throw new Error("Validation Error: Block IDs must be unique.");
  }

  // Ensure layouts don't reference missing blocks
  for (const [bp, items] of Object.entries(parsed.layout)) {
    for (const item of items) {
      if (!blockIds.has(item.i)) {
        throw new Error(`Validation Error: Layout item ${item.i} at breakpoint ${bp} references an unknown block.`);
      }
    }
  }

  return parsed;
}
