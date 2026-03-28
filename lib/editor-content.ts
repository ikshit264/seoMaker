export interface GridBlockData {
  id: string;
  type: string;
  content?: any;
}

export interface LayoutEngineContent {
  blocks: GridBlockData[];
}

export interface BlockTreeContext {
  block: GridBlockData;
  ancestors: string[];
  parentSectionId?: string;
  index: number;
}

export interface StructureSummary {
  totalBlocks: number;
  sectionCount: number;
  faqCount: number;
  tableCount: number;
  listCount: number;
  imageCount: number;
  maxDepth: number;
}

export interface TargetContextSummary {
  selectedBlockId?: string;
  selectedBlockLabel?: string;
  parentSectionId?: string;
  ancestorSectionTitles: string[];
  nearbyBlockLabels: string[];
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function randomIdSegment() {
  return Math.random().toString(36).slice(2, 10);
}

export function createBlockId(prefix = 'block') {
  return `${prefix}-${Date.now()}-${randomIdSegment()}`;
}

function cloneBlockWithNewIds(block: GridBlockData): GridBlockData {
  const clonedContent =
    block.type === 'section' && Array.isArray(block.content?.blocks)
      ? {
          ...block.content,
          blocks: cloneBlocksWithNewIds(block.content.blocks),
        }
      : block.content;

  return {
    ...block,
    id: createBlockId(block.type || 'block'),
    content: clonedContent,
  };
}

export function cloneBlocksWithNewIds(blocks: GridBlockData[]): GridBlockData[] {
  return blocks.map(cloneBlockWithNewIds);
}

export function cloneLayoutContentWithNewIds(content: LayoutEngineContent): LayoutEngineContent {
  return {
    blocks: cloneBlocksWithNewIds(content.blocks || []),
  };
}

export function normalizeLayoutContent(content: Partial<LayoutEngineContent> | null | undefined): LayoutEngineContent {
  return {
    blocks: normalizeBlocks(Array.isArray(content?.blocks) ? content.blocks : []),
  };
}

function normalizeSectionContent(content: unknown) {
  const safeContent = isPlainObject(content) ? content : {};

  return {
    ...safeContent,
    title: typeof safeContent.title === 'string' ? safeContent.title : 'Untitled section',
    blocks: normalizeBlocks(Array.isArray(safeContent.blocks) ? safeContent.blocks : []),
  };
}

export function normalizeBlocks(blocks: unknown[]): GridBlockData[] {
  return blocks
    .filter((block): block is GridBlockData => isPlainObject(block) && typeof block.id === 'string' && typeof block.type === 'string')
    .map((block) => {
      if (block.type !== 'section') {
        return block;
      }

      return {
        ...block,
        content: normalizeSectionContent(block.content),
      };
    });
}

function visitBlocks(
  blocks: GridBlockData[],
  visitor: (context: BlockTreeContext) => boolean | void,
  ancestors: string[] = [],
  parentSectionId?: string
): boolean {
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (!block?.id) {
      continue;
    }

    const shouldStop = visitor({ block, ancestors, parentSectionId, index });
    if (shouldStop) {
      return true;
    }

    if (block.type === 'section' && Array.isArray(block.content?.blocks)) {
      const nestedStopped = visitBlocks(block.content.blocks, visitor, [...ancestors, block.id], block.id);
      if (nestedStopped) {
        return true;
      }
    }
  }

  return false;
}

export function findBlockContext(blocks: GridBlockData[], targetId?: string | null): BlockTreeContext | null {
  if (!targetId) {
    return null;
  }

  let result: BlockTreeContext | null = null;

  visitBlocks(blocks, (context) => {
    if (context.block.id === targetId) {
      result = context;
      return true;
    }
    return false;
  });

  return result;
}

function replaceBlockInList(blocks: GridBlockData[], targetId: string, replacements: GridBlockData[]): GridBlockData[] {
  const next: GridBlockData[] = [];

  for (const block of blocks) {
    if (!block?.id) {
      continue;
    }

    if (block.id === targetId) {
      next.push(...replacements);
      continue;
    }

    if (block.type === 'section' && Array.isArray(block.content?.blocks)) {
      next.push({
        ...block,
        content: {
          ...block.content,
          blocks: replaceBlockInList(block.content.blocks, targetId, replacements),
        },
      });
      continue;
    }

    next.push(block);
  }

  return next;
}

function insertBlocksAfterInList(blocks: GridBlockData[], targetId: string, additions: GridBlockData[]): GridBlockData[] {
  const next: GridBlockData[] = [];

  for (const block of blocks) {
    if (!block?.id) {
      continue;
    }

    if (block.id === targetId) {
      next.push(block, ...additions);
      continue;
    }

    if (block.type === 'section' && Array.isArray(block.content?.blocks)) {
      next.push({
        ...block,
        content: {
          ...block.content,
          blocks: insertBlocksAfterInList(block.content.blocks, targetId, additions),
        },
      });
      continue;
    }

    next.push(block);
  }

  return next;
}

export function replaceBlocksAtSelection(
  content: LayoutEngineContent,
  targetId: string | null | undefined,
  replacements: GridBlockData[]
): LayoutEngineContent {
  if (!targetId) {
    return { blocks: [...replacements] };
  }

  return {
    blocks: replaceBlockInList(content.blocks || [], targetId, replacements),
  };
}

export function insertBlocksAtSelection(
  content: LayoutEngineContent,
  targetId: string | null | undefined,
  additions: GridBlockData[]
): LayoutEngineContent {
  if (!targetId) {
    return {
      blocks: [...(content.blocks || []), ...additions],
    };
  }

  return {
    blocks: insertBlocksAfterInList(content.blocks || [], targetId, additions),
  };
}

function blockLabel(block: GridBlockData): string {
  switch (block.type) {
    case 'section':
      return `Section: ${block.content?.title || 'Untitled section'}`;
    case 'paragraph':
      return `Paragraph: ${String(block.content || '').slice(0, 72)}`;
    case 'list':
      return `List: ${block.content?.title || 'Untitled list'}`;
    case 'table':
      return `Table: ${block.content?.rows?.[0]?.join(' | ') || 'Table'}`;
    case 'faq':
      return `FAQ: ${block.content?.title || 'FAQ'}`;
    case 'image':
      return `Image: ${block.content?.caption || 'Image block'}`;
    case 'quote':
      return `Quote`;
    default:
      return `${block.type}`;
  }
}

export function buildBlockOutline(content: LayoutEngineContent | null | undefined, maxItems = 18): string[] {
  const outline: string[] = [];
  const blocks = content?.blocks || [];

  visitBlocks(blocks, ({ block, ancestors }) => {
    if (outline.length >= maxItems) {
      return true;
    }
    const indent = '  '.repeat(ancestors.length);
    outline.push(`${indent}${blockLabel(block)}`);
    return false;
  });

  return outline;
}

export function summarizeStructure(content: LayoutEngineContent | null | undefined): StructureSummary {
  const summary: StructureSummary = {
    totalBlocks: 0,
    sectionCount: 0,
    faqCount: 0,
    tableCount: 0,
    listCount: 0,
    imageCount: 0,
    maxDepth: 0,
  };

  visitBlocks(content?.blocks || [], ({ block, ancestors }) => {
    summary.totalBlocks += 1;
    summary.maxDepth = Math.max(summary.maxDepth, ancestors.length);

    if (block.type === 'section') summary.sectionCount += 1;
    if (block.type === 'faq') summary.faqCount += 1;
    if (block.type === 'table') summary.tableCount += 1;
    if (block.type === 'list') summary.listCount += 1;
    if (block.type === 'image') summary.imageCount += 1;

    return false;
  });

  return summary;
}

export function summarizeTargetContext(
  content: LayoutEngineContent | null | undefined,
  selectedBlockId?: string | null
): TargetContextSummary {
  const blocks = content?.blocks || [];
  const selected = findBlockContext(blocks, selectedBlockId);

  if (!selected) {
    return {
      selectedBlockId: undefined,
      ancestorSectionTitles: [],
      nearbyBlockLabels: buildBlockOutline(content, 6),
    };
  }

  const siblingSource = selected.parentSectionId
    ? findBlockContext(blocks, selected.parentSectionId)?.block.content?.blocks || blocks
    : blocks;

  const nearbyBlockLabels = siblingSource
    .slice(Math.max(0, selected.index - 2), selected.index + 3)
    .map((block: GridBlockData) => blockLabel(block));

  const ancestorSectionTitles = selected.ancestors
    .map((ancestorId) => findBlockContext(blocks, ancestorId)?.block.content?.title)
    .filter(Boolean);

  return {
    selectedBlockId: selected.block.id,
    selectedBlockLabel: blockLabel(selected.block),
    parentSectionId: selected.parentSectionId,
    ancestorSectionTitles,
    nearbyBlockLabels,
  };
}
