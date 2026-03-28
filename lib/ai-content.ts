import { z } from 'zod';
import {
  GridBlockData,
  LayoutEngineContent,
  buildBlockOutline,
  createBlockId,
  summarizeStructure,
} from '@/lib/editor-content';

export const AiGenerationModeSchema = z.enum(['full-page', 'section']);
export type AiGenerationMode = z.infer<typeof AiGenerationModeSchema>;

export const AiTargetContextSchema = z.object({
  selectedBlockId: z.string().optional(),
  selectedBlockLabel: z.string().optional(),
  parentSectionId: z.string().optional(),
  ancestorSectionTitles: z.array(z.string()).default([]),
  nearbyBlockLabels: z.array(z.string()).default([]),
});
export type AiTargetContext = z.infer<typeof AiTargetContextSchema>;

const ParagraphNodeSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string().min(1),
});

const BulletListNodeSchema = z.object({
  type: z.literal('bullet_list'),
  title: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
});

const TableNodeSchema = z.object({
  type: z.literal('table'),
  title: z.string().optional(),
  headers: z.array(z.string().min(1)).optional(),
  rows: z.array(z.array(z.string().default(''))).min(1),
});

const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const FaqNodeSchema = z.object({
  type: z.literal('faq'),
  title: z.string().optional(),
  items: z.array(FaqItemSchema).min(1),
});

const QuoteNodeSchema = z.object({
  type: z.literal('quote'),
  text: z.string().min(1),
});

const ImagePlaceholderNodeSchema = z.object({
  type: z.literal('image_placeholder'),
  caption: z.string().optional(),
});

export type AiSemanticNode =
  | z.infer<typeof ParagraphNodeSchema>
  | z.infer<typeof BulletListNodeSchema>
  | z.infer<typeof TableNodeSchema>
  | z.infer<typeof FaqNodeSchema>
  | z.infer<typeof QuoteNodeSchema>
  | z.infer<typeof ImagePlaceholderNodeSchema>
  | {
      type: 'section' | 'subsection';
      title: string;
      children: AiSemanticNode[];
    };

export const AiSemanticNodeSchema: z.ZodType<AiSemanticNode> = z.lazy(() =>
  z.union([
    ParagraphNodeSchema,
    BulletListNodeSchema,
    TableNodeSchema,
    FaqNodeSchema,
    QuoteNodeSchema,
    ImagePlaceholderNodeSchema,
    z.object({
      type: z.enum(['section', 'subsection']),
      title: z.string().min(1),
      children: z.array(AiSemanticNodeSchema).default([]),
    }),
  ])
);

export const AiSemanticDocumentSchema = z.object({
  type: z.literal('document'),
  title: z.string().optional(),
  summary: z.string().optional(),
  nodes: z.array(AiSemanticNodeSchema).min(1),
});
export type AiSemanticDocument = z.infer<typeof AiSemanticDocumentSchema>;

export const AiGenerateRequestSchema = z.object({
  mode: AiGenerationModeSchema,
  prompt: z.string().min(10, 'Prompt is too short'),
  targetContext: AiTargetContextSchema.optional(),
});
export type AiGenerateRequest = z.infer<typeof AiGenerateRequestSchema>;

export const AiGenerateResponseSchema = z.object({
  semanticDocument: AiSemanticDocumentSchema,
  mappedContent: z.object({
    blocks: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        content: z.any().optional(),
      })
    ),
  }),
  summary: z.object({
    originalOutline: z.array(z.string()),
    generatedOutline: z.array(z.string()),
    generatedStructure: z.object({
      totalBlocks: z.number(),
      sectionCount: z.number(),
      faqCount: z.number(),
      tableCount: z.number(),
      listCount: z.number(),
      imageCount: z.number(),
      maxDepth: z.number(),
    }),
  }),
  warnings: z.array(z.string()),
});
export type AiGenerateResponse = z.infer<typeof AiGenerateResponseSchema>;

export interface SemanticToBlockMapperResult {
  content: LayoutEngineContent;
  warnings: string[];
}

type JsonLikeRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonLikeRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stripCodeFences(input: string) {
  return input.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

function extractJsonCandidate(input: string) {
  const trimmed = stripCodeFences(input);
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function normalizeNodeType(type: unknown) {
  if (typeof type !== 'string') {
    return undefined;
  }

  return type.trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeStringList(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);
}

function coerceFaqItems(values: unknown) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => {
      if (isRecord(item)) {
        const question = typeof item.question === 'string' ? item.question.trim() : '';
        const answer = typeof item.answer === 'string' ? item.answer.trim() : '';

        if (question && answer) {
          return { question, answer };
        }
      }

      return null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

function coerceTableRows(values: unknown) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((row) => {
      if (!Array.isArray(row)) {
        return null;
      }

      return row.map((cell) => (cell == null ? '' : String(cell).trim()));
    })
    .filter((row): row is string[] => Array.isArray(row) && row.length > 0);
}

function coerceSemanticNode(value: unknown): AiSemanticNode | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = normalizeNodeType(value.type);
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const text =
    typeof value.text === 'string'
      ? value.text.trim()
      : typeof value.content === 'string'
        ? value.content.trim()
        : typeof value.body === 'string'
          ? value.body.trim()
          : '';

  switch (type) {
    case 'section':
    case 'subsection': {
      const childrenSource =
        Array.isArray(value.children) ? value.children : Array.isArray(value.nodes) ? value.nodes : Array.isArray(value.items) ? value.items : [];
      const children = childrenSource.map(coerceSemanticNode).filter((node): node is AiSemanticNode => Boolean(node));

      if (!title) {
        return null;
      }

      return {
        type,
        title,
        children,
      };
    }
    case 'paragraph':
      return text ? { type: 'paragraph', text } : null;
    case 'bullet_list':
    case 'bullets':
    case 'list': {
      const items = normalizeStringList(value.items);
      return items.length ? { type: 'bullet_list', title: title || undefined, items } : null;
    }
    case 'table': {
      const rows = coerceTableRows(value.rows);
      const headers = normalizeStringList(value.headers);
      return rows.length ? { type: 'table', title: title || undefined, headers: headers.length ? headers : undefined, rows } : null;
    }
    case 'faq':
    case 'faqs': {
      const items = coerceFaqItems(value.items);
      return items.length ? { type: 'faq', title: title || undefined, items } : null;
    }
    case 'quote':
      return text ? { type: 'quote', text } : null;
    case 'image_placeholder':
    case 'image':
      return {
        type: 'image_placeholder',
        caption: typeof value.caption === 'string' ? value.caption.trim() : title || undefined,
      };
    default:
      return null;
  }
}

function coerceSemanticDocumentShape(value: unknown): AiSemanticDocument {
  if (!isRecord(value)) {
    throw new Error('AI response was not a JSON object');
  }

  const nodesSource =
    Array.isArray(value.nodes)
      ? value.nodes
      : Array.isArray(value.sections)
        ? value.sections
        : Array.isArray(value.content)
          ? value.content
          : [];

  const nodes = nodesSource.map(coerceSemanticNode).filter((node): node is AiSemanticNode => Boolean(node));

  if (!nodes.length) {
    throw new Error('AI response did not include any usable content nodes');
  }

  return {
    type: 'document',
    title: typeof value.title === 'string' ? value.title.trim() : undefined,
    summary: typeof value.summary === 'string' ? value.summary.trim() : undefined,
    nodes,
  };
}

function ensureStructuredTopLevelNodes(document: AiSemanticDocument, mode: AiGenerationMode): AiSemanticDocument {
  if (mode !== 'full-page') {
    return document;
  }

  const alreadyStructured = document.nodes.some((node) => node.type === 'section' || node.type === 'subsection');
  if (alreadyStructured) {
    return document;
  }

  return {
    ...document,
    nodes: [
      {
        type: 'section',
        title: document.title || 'Overview',
        children: document.nodes,
      },
    ],
  };
}

function normalizeTableRows(headers: string[] | undefined, rows: string[][]): string[][] {
  const preparedRows = rows.map((row) => row.map((cell) => cell ?? ''));
  const maxLength = Math.max(headers?.length || 0, ...preparedRows.map((row) => row.length), 1);
  const paddedRows = preparedRows.map((row) => [...row, ...new Array(Math.max(0, maxLength - row.length)).fill('')]);

  if (headers?.length) {
    return [[...headers, ...new Array(Math.max(0, maxLength - headers.length)).fill('')], ...paddedRows];
  }

  return paddedRows;
}

function semanticNodeToBlocks(node: AiSemanticNode, warnings: string[], depth = 0): GridBlockData[] {
  if (depth > 4) {
    warnings.push(`Dropped content under "${'title' in node ? node.title : node.type}" because the nesting depth exceeded the current editor limit.`);
    return [];
  }

  switch (node.type) {
    case 'section':
    case 'subsection':
      return [
        {
          id: createBlockId('section'),
          type: 'section',
          content: {
            title: node.title,
            blocks: node.children.flatMap((child) => semanticNodeToBlocks(child, warnings, depth + 1)),
          },
        },
      ];
    case 'paragraph':
      return [
        {
          id: createBlockId('paragraph'),
          type: 'paragraph',
          content: node.text.trim(),
        },
      ];
    case 'bullet_list':
      return [
        {
          id: createBlockId('list'),
          type: 'list',
          content: {
            title: node.title || 'Key Points',
            items: node.items.filter(Boolean),
          },
        },
      ];
    case 'table':
      return [
        {
          id: createBlockId('table'),
          type: 'table',
          content: {
            title: node.title,
            rows: normalizeTableRows(node.headers, node.rows),
          },
        },
      ];
    case 'faq':
      return [
        {
          id: createBlockId('faq'),
          type: 'faq',
          content: {
            title: node.title || 'Frequently Asked Questions',
            items: node.items.map((item) => ({
              question: item.question,
              answer: item.answer,
            })),
          },
        },
      ];
    case 'quote':
      return [
        {
          id: createBlockId('quote'),
          type: 'quote',
          content: node.text,
        },
      ];
    case 'image_placeholder':
      return [
        {
          id: createBlockId('image'),
          type: 'image',
          content: {
            url: '',
            caption: node.caption || 'Replace this placeholder with the final image URL.',
          },
        },
      ];
    default:
      warnings.push(`Unsupported semantic node type "${(node as { type: string }).type}" was ignored.`);
      return [];
  }
}

export function semanticDocumentToLayoutContent(document: AiSemanticDocument): SemanticToBlockMapperResult {
  const warnings: string[] = [];
  const blocks = document.nodes.flatMap((node) => semanticNodeToBlocks(node, warnings));

  return {
    content: { blocks },
    warnings,
  };
}

export function buildAiResponse(
  originalContent: LayoutEngineContent | null | undefined,
  semanticDocument: AiSemanticDocument
): AiGenerateResponse {
  const mapped = semanticDocumentToLayoutContent(semanticDocument);

  return {
    semanticDocument,
    mappedContent: mapped.content,
    summary: {
      originalOutline: buildBlockOutline(originalContent, 16),
      generatedOutline: buildBlockOutline(mapped.content, 16),
      generatedStructure: summarizeStructure(mapped.content),
    },
    warnings: mapped.warnings,
  };
}

export function buildGeminiPrompt(request: AiGenerateRequest) {
  const targetContext = request.targetContext;
  const structureInstructions =
    request.mode === 'full-page'
      ? [
          'Create a complete top-to-bottom blog article.',
          'Use top-level section nodes for the article flow.',
          'Include an opening section, 3 to 6 substantial body sections, and a closing section.',
          'Use subsection nodes where a section needs scannable depth.',
          'Add bullet_list, table, and faq nodes when they improve clarity and search usefulness.',
        ].join(' ')
      : [
          'Create a complete section that can drop into an existing article.',
          'Return one or more section or subsection nodes when possible.',
        ].join(' ');

  return [
    `Generation mode: ${request.mode}.`,
    'User requirements:',
    request.prompt.trim(),
    targetContext
      ? `Selected target context: ${JSON.stringify(targetContext)}`
      : 'Selected target context: none.',
    'Return semantic JSON only.',
    'Use sections and subsections when the response needs clear hierarchy.',
    'Use table nodes only when tabular comparison helps.',
    'Use faq nodes when user intent suggests question-based content.',
    'Keep content specific, editable, and production-oriented.',
    structureInstructions,
  ].join('\n\n');
}

export function parseAiSemanticDocument(rawText: string, mode: AiGenerationMode): AiSemanticDocument {
  const jsonCandidate = extractJsonCandidate(rawText);
  const parsed = JSON.parse(jsonCandidate);
  const coerced = coerceSemanticDocumentShape(parsed);
  const structured = ensureStructuredTopLevelNodes(coerced, mode);

  return AiSemanticDocumentSchema.parse(structured);
}

export const AI_SEMANTIC_JSON_SCHEMA = {
  $id: 'AiSemanticDocument',
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['document'] },
    title: { type: 'string' },
    summary: { type: 'string' },
    nodes: {
      type: 'array',
      minItems: 1,
      items: { $ref: '#/$defs/node' },
    },
  },
  required: ['type', 'nodes'],
  additionalProperties: false,
  $defs: {
    node: {
      anyOf: [
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['section', 'subsection'] },
            title: { type: 'string' },
            children: {
              type: 'array',
              items: { $ref: '#/$defs/node' },
            },
          },
          required: ['type', 'title', 'children'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['paragraph'] },
            text: { type: 'string' },
          },
          required: ['type', 'text'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['bullet_list'] },
            title: { type: 'string' },
            items: {
              type: 'array',
              minItems: 1,
              items: { type: 'string' },
            },
          },
          required: ['type', 'items'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['table'] },
            title: { type: 'string' },
            headers: {
              type: 'array',
              items: { type: 'string' },
            },
            rows: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
          required: ['type', 'rows'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['faq'] },
            title: { type: 'string' },
            items: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  answer: { type: 'string' },
                },
                required: ['question', 'answer'],
                additionalProperties: false,
              },
            },
          },
          required: ['type', 'items'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['quote'] },
            text: { type: 'string' },
          },
          required: ['type', 'text'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['image_placeholder'] },
            caption: { type: 'string' },
          },
          required: ['type'],
          additionalProperties: false,
        },
      ],
    },
  },
};
