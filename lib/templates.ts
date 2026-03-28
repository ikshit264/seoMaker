import {
  LayoutEngineContent,
  cloneLayoutContentWithNewIds,
  summarizeStructure,
} from '@/lib/editor-content';

export type TemplateCategory = 'service' | 'comparison' | 'how-to' | 'local-seo' | 'product';

export interface TemplatePreview {
  sectionTitles: string[];
  summary: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  useCase: string;
  preview: TemplatePreview;
  content: LayoutEngineContent;
}

export interface TemplateImportResult {
  template: TemplateDefinition;
  content: LayoutEngineContent;
}

const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'service-landing',
    name: 'Service Landing Page',
    category: 'service',
    description: 'Strong service page with benefits, process, comparison table, and FAQ.',
    useCase: 'Best for agency, consultant, or local service business pages.',
    preview: {
      sectionTitles: ['Why Choose Us', 'How It Works', 'Service Packages', 'Frequently Asked Questions'],
      summary: 'Conversion-focused structure with proof points and pricing comparison.',
    },
    content: {
      blocks: [
        {
          id: 'service-overview',
          type: 'section',
          content: {
            title: 'Professional Service Solutions That Solve the Real Problem',
            blocks: [
              {
                id: 'service-overview-p',
                type: 'paragraph',
                content:
                  'Use this opening section to define the service clearly, call out the main customer pain point, and explain the result clients can expect after working with you.',
              },
              {
                id: 'service-overview-list',
                type: 'list',
                content: {
                  title: 'What This Page Should Cover',
                  items: [
                    'What the service includes and who it is for',
                    'Why your approach is different from competitors',
                    'What outcomes, timelines, or deliverables users should expect',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'service-why',
          type: 'section',
          content: {
            title: 'Why Choose This Service',
            blocks: [
              {
                id: 'service-why-subsection',
                type: 'section',
                content: {
                  title: 'Core Benefits',
                  blocks: [
                    {
                      id: 'service-why-subsection-p',
                      type: 'paragraph',
                      content:
                        'Explain the value proposition in plain language. Focus on business outcomes, reduced friction, and confidence-building detail.',
                    },
                    {
                      id: 'service-why-subsection-list',
                      type: 'list',
                      content: {
                        title: 'Benefit Highlights',
                        items: [
                          'Clear process from discovery to delivery',
                          'Custom recommendations based on the user requirement',
                          'Support, reporting, or iteration after launch',
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'service-process',
          type: 'section',
          content: {
            title: 'How It Works',
            blocks: [
              {
                id: 'service-process-list',
                type: 'list',
                content: {
                  title: 'Suggested Steps',
                  items: [
                    'Initial consultation and scope definition',
                    'Research, planning, and approval',
                    'Execution with milestone check-ins',
                    'Final delivery with refinement and handoff',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'service-table-section',
          type: 'section',
          content: {
            title: 'Service Packages or Plan Comparison',
            blocks: [
              {
                id: 'service-table',
                type: 'table',
                content: {
                  rows: [
                    ['Plan', 'Best For', 'Key Deliverables', 'Turnaround'],
                    ['Starter', 'Single need', 'Core setup and one revision cycle', '3-5 business days'],
                    ['Growth', 'Most businesses', 'Strategy, delivery, and optimization support', '1-2 weeks'],
                    ['Custom', 'Complex scope', 'Tailored workflow, reporting, and consulting', 'Varies by scope'],
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'service-faq-section',
          type: 'faq',
          content: {
            title: 'Frequently Asked Questions',
            items: [
              {
                question: 'What information should a customer provide before starting?',
                answer: 'Explain what inputs, assets, access, timelines, or business context you need before the work can begin smoothly.',
              },
              {
                question: 'How long does the service usually take?',
                answer: 'Set realistic expectations with a clear turnaround range and mention what can affect timing.',
              },
              {
                question: 'Can the service be customized for a specific requirement?',
                answer: 'Confirm whether custom scope, add-ons, or tailored deliverables are available and when that makes sense.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'product-comparison',
    name: 'Product Comparison Page',
    category: 'comparison',
    description: 'Comparison-led page with feature table, recommendation logic, and FAQ.',
    useCase: 'Best for software, tools, marketplaces, and product alternatives.',
    preview: {
      sectionTitles: ['Comparison Overview', 'Feature Breakdown', 'Best Choice By Use Case', 'Questions Users Ask'],
      summary: 'Helpful comparison structure built for decision-stage traffic.',
    },
    content: {
      blocks: [
        {
          id: 'comparison-intro',
          type: 'section',
          content: {
            title: 'Compare the Best Options Side by Side',
            blocks: [
              {
                id: 'comparison-intro-p',
                type: 'paragraph',
                content:
                  'Use this introduction to explain what is being compared, the criteria used, and what readers should look for before making a decision.',
              },
            ],
          },
        },
        {
          id: 'comparison-table-section',
          type: 'section',
          content: {
            title: 'Feature Breakdown',
            blocks: [
              {
                id: 'comparison-table',
                type: 'table',
                content: {
                  rows: [
                    ['Feature', 'Option A', 'Option B', 'Option C'],
                    ['Primary strength', 'Fast onboarding', 'Deep customization', 'Lower cost'],
                    ['Best suited for', 'Small teams', 'Advanced teams', 'Budget-focused buyers'],
                    ['Pricing model', 'Subscription', 'Tiered enterprise', 'Usage-based'],
                    ['Support level', 'Standard', 'Priority', 'Email only'],
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'comparison-recommendations',
          type: 'section',
          content: {
            title: 'Best Choice by Scenario',
            blocks: [
              {
                id: 'comparison-scenarios',
                type: 'list',
                content: {
                  title: 'Recommendation Framework',
                  items: [
                    'Choose Option A if speed and simplicity matter most',
                    'Choose Option B if workflow depth and scale matter more than price',
                    'Choose Option C if cost control is the main decision factor',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'comparison-faq',
          type: 'faq',
          content: {
            title: 'Questions Users Ask Before Choosing',
            items: [
              {
                question: 'Which option offers the best value for most users?',
                answer: 'Use this answer to explain value relative to pricing, flexibility, and support rather than naming a winner without context.',
              },
              {
                question: 'What trade-offs should users consider before switching?',
                answer: 'Call out migration effort, setup complexity, missing features, or team change management concerns.',
              },
              {
                question: 'How should someone decide between these options quickly?',
                answer: 'Give readers a short decision framework based on budget, feature needs, and team maturity.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    category: 'how-to',
    description: 'Long-form educational structure with steps, table, and FAQ.',
    useCase: 'Best for SEO guides, tutorials, and educational pages.',
    preview: {
      sectionTitles: ['What You Need Before Starting', 'Step-by-Step Process', 'Common Mistakes', 'FAQ'],
      summary: 'Instruction-led page structure with actionable steps and troubleshooting.',
    },
    content: {
      blocks: [
        {
          id: 'guide-intro',
          type: 'section',
          content: {
            title: 'How to Complete the Process Efficiently',
            blocks: [
              {
                id: 'guide-intro-p',
                type: 'paragraph',
                content:
                  'Start with a concise explanation of the end goal, who this guide is for, and how long the process typically takes.',
              },
            ],
          },
        },
        {
          id: 'guide-prereq',
          type: 'section',
          content: {
            title: 'What You Need Before Starting',
            blocks: [
              {
                id: 'guide-prereq-list',
                type: 'list',
                content: {
                  title: 'Checklist',
                  items: [
                    'Required inputs, assets, or access',
                    'Recommended tools or accounts',
                    'Benchmarks or success criteria to measure progress',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'guide-steps',
          type: 'section',
          content: {
            title: 'Step-by-Step Process',
            blocks: [
              {
                id: 'guide-step-1',
                type: 'section',
                content: {
                  title: 'Step 1: Setup and Preparation',
                  blocks: [
                    {
                      id: 'guide-step-1-p',
                      type: 'paragraph',
                      content: 'Explain the first phase with enough detail that a reader can complete it without guessing.',
                    },
                  ],
                },
              },
              {
                id: 'guide-step-2',
                type: 'section',
                content: {
                  title: 'Step 2: Execute the Core Workflow',
                  blocks: [
                    {
                      id: 'guide-step-2-p',
                      type: 'paragraph',
                      content: 'Document the main actions, checks, and validation points required during execution.',
                    },
                  ],
                },
              },
              {
                id: 'guide-step-3',
                type: 'section',
                content: {
                  title: 'Step 3: Review and Improve',
                  blocks: [
                    {
                      id: 'guide-step-3-list',
                      type: 'list',
                      content: {
                        title: 'Final Checks',
                        items: [
                          'Verify the expected outcome',
                          'Fix common mistakes or missing pieces',
                          'Document follow-up actions for optimization',
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'guide-mistakes',
          type: 'section',
          content: {
            title: 'Common Mistakes and Fixes',
            blocks: [
              {
                id: 'guide-mistakes-table',
                type: 'table',
                content: {
                  rows: [
                    ['Mistake', 'Why It Happens', 'How to Fix It'],
                    ['Skipping setup', 'Users rush into execution', 'Add a pre-flight checklist before step one'],
                    ['Using unclear inputs', 'Requirements are incomplete', 'Define assumptions and required data up front'],
                    ['Not validating results', 'No review step exists', 'Add a closing QA or measurement step'],
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'guide-faq',
          type: 'faq',
          content: {
            title: 'Frequently Asked Questions',
            items: [
              {
                question: 'How long does the full process usually take?',
                answer: 'Give a practical time estimate and mention what changes the effort level.',
              },
              {
                question: 'What should someone do if they get stuck midway?',
                answer: 'Provide a troubleshooting path, fallback action, or support route.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'local-seo-page',
    name: 'Local SEO City Page',
    category: 'local-seo',
    description: 'Localized landing page template with trust signals, areas served, and FAQ.',
    useCase: 'Best for city/service pages targeting local search traffic.',
    preview: {
      sectionTitles: ['Services in [City]', 'Areas Served', 'Why Local Clients Choose Us', 'Local FAQ'],
      summary: 'Location-specific structure designed for local service intent.',
    },
    content: {
      blocks: [
        {
          id: 'local-intro',
          type: 'section',
          content: {
            title: 'Reliable Service in [City Name]',
            blocks: [
              {
                id: 'local-intro-p',
                type: 'paragraph',
                content:
                  'Use this section to introduce the local service, mention the city naturally, and explain how the offering fits local customer needs.',
              },
            ],
          },
        },
        {
          id: 'local-benefits',
          type: 'section',
          content: {
            title: 'Why Local Clients Choose This Service',
            blocks: [
              {
                id: 'local-benefits-list',
                type: 'list',
                content: {
                  title: 'Trust Signals',
                  items: [
                    'Familiar with local requirements and expectations',
                    'Fast response times in the target service area',
                    'Clear communication, scheduling, and follow-up',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'local-areas',
          type: 'section',
          content: {
            title: 'Areas Served',
            blocks: [
              {
                id: 'local-areas-subsection',
                type: 'section',
                content: {
                  title: 'Neighborhood and Coverage Notes',
                  blocks: [
                    {
                      id: 'local-areas-p',
                      type: 'paragraph',
                      content:
                        'Add neighborhoods, nearby locations, and any service radius details here so users know whether you cover their area.',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'local-table-section',
          type: 'section',
          content: {
            title: 'At-a-Glance Information',
            blocks: [
              {
                id: 'local-table',
                type: 'table',
                content: {
                  rows: [
                    ['Topic', 'Details'],
                    ['Service area', 'City center plus surrounding neighborhoods'],
                    ['Availability', 'Weekday and weekend availability as applicable'],
                    ['Typical response', 'Same day or next day depending on scope'],
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'local-faq',
          type: 'faq',
          content: {
            title: 'Local Questions We Hear Most',
            items: [
              {
                question: 'Do you serve nearby neighborhoods outside the city center?',
                answer: 'Clarify service radius, nearby zip codes, or adjacent areas covered.',
              },
              {
                question: 'How quickly can someone in this area book or get support?',
                answer: 'Explain booking windows, urgency handling, and expected response timing.',
              },
              {
                question: 'Are your prices the same across all local areas?',
                answer: 'Mention whether distance, urgency, or service type affects pricing.',
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'product-feature-page',
    name: 'Product Feature Page',
    category: 'product',
    description: 'Feature-led page with use cases, workflow, comparison, and FAQ.',
    useCase: 'Best for SaaS feature pages, tools, and product solution pages.',
    preview: {
      sectionTitles: ['Feature Overview', 'Key Capabilities', 'Use Cases', 'FAQ'],
      summary: 'Product marketing structure with educational and conversion-ready sections.',
    },
    content: {
      blocks: [
        {
          id: 'feature-overview',
          type: 'section',
          content: {
            title: 'A Product Feature Built to Remove Friction',
            blocks: [
              {
                id: 'feature-overview-p',
                type: 'paragraph',
                content:
                  'Use this section to describe the feature, its main problem-solving angle, and who benefits from it most.',
              },
            ],
          },
        },
        {
          id: 'feature-capabilities',
          type: 'section',
          content: {
            title: 'Key Capabilities',
            blocks: [
              {
                id: 'feature-capabilities-list',
                type: 'list',
                content: {
                  title: 'What the Feature Does',
                  items: [
                    'Automates a repeated or manual workflow',
                    'Provides visibility, control, or performance insight',
                    'Improves speed, quality, or consistency',
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'feature-use-cases',
          type: 'section',
          content: {
            title: 'Common Use Cases',
            blocks: [
              {
                id: 'feature-use-cases-subsection',
                type: 'section',
                content: {
                  title: 'Where This Feature Creates the Most Value',
                  blocks: [
                    {
                      id: 'feature-use-cases-p',
                      type: 'paragraph',
                      content: 'Describe the most common teams, workflows, or scenarios where this feature delivers outsized value.',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'feature-comparison',
          type: 'section',
          content: {
            title: 'Before vs After Using the Feature',
            blocks: [
              {
                id: 'feature-comparison-table',
                type: 'table',
                content: {
                  rows: [
                    ['Scenario', 'Without the Feature', 'With the Feature'],
                    ['Workflow speed', 'Manual and inconsistent', 'Standardized and faster'],
                    ['Visibility', 'Scattered information', 'Centralized view and reporting'],
                    ['Team effort', 'High coordination overhead', 'Simpler handoff and tracking'],
                  ],
                },
              },
            ],
          },
        },
        {
          id: 'feature-faq',
          type: 'faq',
          content: {
            title: 'Feature FAQ',
            items: [
              {
                question: 'Who should use this feature first?',
                answer: 'Answer based on team size, workflow maturity, or the biggest pain point the feature solves.',
              },
              {
                question: 'Does this feature require setup or onboarding?',
                answer: 'Explain setup complexity, prerequisites, and expected time to first value.',
              },
              {
                question: 'How should this feature be explained to decision makers?',
                answer: 'Frame the answer around business outcomes, speed, visibility, and cost of delay.',
              },
            ],
          },
        },
      ],
    },
  },
];

export const TEMPLATE_CATALOG = TEMPLATES.map((template) => ({
  ...template,
  preview: {
    ...template.preview,
    summary: `${template.preview.summary} Includes ${summarizeStructure(template.content).sectionCount} sections.`,
  },
}));

export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return TEMPLATE_CATALOG.find((template) => template.id === templateId);
}

export function importTemplate(templateId: string): TemplateImportResult {
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  return {
    template,
    content: cloneLayoutContentWithNewIds(template.content),
  };
}
