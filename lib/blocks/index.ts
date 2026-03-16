import { HeadingBlock } from '@/components/blocks/HeadingBlock';
import { ParagraphBlock } from '@/components/blocks/ParagraphBlock';
import { ImageBlock } from '@/components/blocks/ImageBlock';
import { TableBlock } from '@/components/blocks/TableBlock';
import { EmbedBlock } from '@/components/blocks/EmbedBlock';
import { CodeBlock } from '@/components/blocks/CodeBlock';
import { QuoteBlock } from '@/components/blocks/QuoteBlock';
import { ListBlock } from '@/components/blocks/ListBlock';
import { FaqBlock } from '@/components/blocks/FaqBlock';
import { NavigationBlock } from '@/components/blocks/NavigationBlock';
import { SectionBlock } from '@/components/blocks/SectionBlock';
import { blockRegistry } from './registry';
import { 
    Type, AlignLeft, Image as ImageIcon, Table, Link as LinkIcon, 
    Code, Quote, List, HelpCircle, ArrowRightLeft, Box 
} from 'lucide-react';

// Register built-in blocks
blockRegistry.register({
  type: 'section',
  name: 'Section',
  icon: Box,
  defaultContent: { title: 'New Section', blocks: [] },
  component: SectionBlock as any
});

blockRegistry.register({
  type: 'heading',
  name: 'Heading',
  icon: Type,
  defaultContent: { text: '' },
  component: HeadingBlock as any
});

blockRegistry.register({
  type: 'paragraph',
  name: 'Paragraph',
  icon: AlignLeft,
  defaultContent: '',
  component: ParagraphBlock as any
});

blockRegistry.register({
  type: 'image',
  name: 'Image',
  icon: ImageIcon,
  defaultContent: { url: '', caption: '' },
  component: ImageBlock as any
});

blockRegistry.register({
  type: 'table',
  name: 'Table',
  icon: Table,
  defaultContent: { rows: [['Header 1', 'Header 2'], ['', '']] },
  component: TableBlock as any
});

blockRegistry.register({
  type: 'embed',
  name: 'Embed',
  icon: LinkIcon,
  defaultContent: { url: '' },
  component: EmbedBlock as any
});

blockRegistry.register({
  type: 'code',
  name: 'Code',
  icon: Code,
  defaultContent: '',
  component: CodeBlock as any
});

blockRegistry.register({
  type: 'quote',
  name: 'Quote',
  icon: Quote,
  defaultContent: '',
  component: QuoteBlock as any
});

blockRegistry.register({
  type: 'list',
  name: 'List Block',
  icon: List,
  defaultContent: { title: 'Highlights', items: [''] },
  component: ListBlock as any
});

blockRegistry.register({
  type: 'faq',
  name: 'FAQ Section',
  icon: HelpCircle,
  defaultContent: { title: 'Frequently Asked Questions', items: [{ question: '', answer: '' }] },
  component: FaqBlock as any
});

blockRegistry.register({
  type: 'navigation',
  name: 'Navigation Links',
  icon: ArrowRightLeft,
  defaultContent: { prev: { text: 'Previous Post', url: '#' }, next: { text: 'Next Post', url: '#' } },
  component: NavigationBlock as any
});

export * from './registry';
