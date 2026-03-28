import assert from 'node:assert/strict';

import { parseAiSemanticDocument, semanticDocumentToLayoutContent } from '../lib/ai-content';
import { normalizeLayoutContent } from '../lib/editor-content';

function run(name: string, fn: () => void) {
  fn();
  console.log(`PASS ${name}`);
}

run('parseAiSemanticDocument recovers fenced JSON and wraps full-page output into sections', () => {
  const raw = "```json\n{\n  \"title\": \"AI SEO Blog\",\n  \"content\": [\n    { \"type\": \"paragraph\", \"text\": \"Intro paragraph.\" },\n    { \"type\": \"list\", \"title\": \"Key Takeaways\", \"items\": [\"Point one\", \"Point two\"] },\n    { \"type\": \"faqs\", \"items\": [{ \"question\": \"What is AI SEO?\", \"answer\": \"A process for scaling search content.\" }] }\n  ]\n}\n```";

  const document = parseAiSemanticDocument(raw, 'full-page');
  assert.equal(document.type, 'document');
  assert.equal(document.nodes.length, 1);
  assert.equal(document.nodes[0].type, 'section');
  assert.equal(document.nodes[0].title, 'AI SEO Blog');

  const mapped = semanticDocumentToLayoutContent(document).content;
  assert.equal(mapped.blocks.length, 1);
  assert.equal(mapped.blocks[0].type, 'section');
  assert.equal(mapped.blocks[0].content.blocks.length, 3);
  assert.equal(mapped.blocks[0].content.blocks[1].type, 'list');
  assert.equal(mapped.blocks[0].content.blocks[2].type, 'faq');
});

run('parseAiSemanticDocument accepts alias fields like sections, body, and image nodes', () => {
  const raw = JSON.stringify({
    title: 'Buyer Guide',
    sections: [
      {
        type: 'section',
        title: 'Choosing a Tool',
        nodes: [
          { type: 'paragraph', body: 'Start with your team workflow.' },
          { type: 'table', headers: ['Tool', 'Best For'], rows: [['Platform A', 'Teams']] },
          { type: 'image', caption: 'Dashboard comparison placeholder' }
        ]
      }
    ]
  });

  const document = parseAiSemanticDocument(raw, 'section');
  const mapped = semanticDocumentToLayoutContent(document).content;
  const children = mapped.blocks[0].content.blocks;

  assert.equal(children[0].type, 'paragraph');
  assert.equal(children[1].type, 'table');
  assert.equal(children[2].type, 'image');
});

run('normalizeLayoutContent recursively drops malformed nested blocks', () => {
  const normalized = normalizeLayoutContent({
    blocks: [
      {
        id: 'section-1',
        type: 'section',
        content: {
          title: 'Parent',
          blocks: [
            { id: 'paragraph-1', type: 'paragraph', content: 'Safe child' },
            { id: '', type: 'paragraph', content: 'Bad child' },
            { id: 'nested-section', type: 'section', content: { title: 'Nested', blocks: [{ foo: 'bar' } as any] } }
          ]
        }
      },
      { foo: 'bar' } as any
    ]
  });

  assert.equal(normalized.blocks.length, 1);
  const sectionChildren = normalized.blocks[0].content.blocks;
  assert.equal(sectionChildren.length, 2);
  assert.equal(sectionChildren[1].content.blocks.length, 0);
});

