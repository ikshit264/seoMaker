import { Client } from 'pg';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { normalizeLayoutContent } from '@/lib/editor-content';

export type DbType = 'postgres' | 'mongodb';

type CmsItemInput = Record<string, any>;

type NormalizedCmsItem = {
  id: string;
  title: string | null;
  slug: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  featured_image: string | null;
  draft_layout_json: any;
  published_layout_json: any;
  content: any;
  custom_fields: Record<string, any>;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  [key: string]: any;
};

const CMS_METADATA_TABLE = '_cms_metadata';
const CMS_LOGS_TABLE = '_cms_logs';
const DEFAULT_CONTENT = { blocks: [] };

const STANDARD_ITEM_KEYS = new Set([
  'id',
  '_id',
  'title',
  'slug',
  'seo_title',
  'seo_description',
  'seo_keywords',
  'og_title',
  'og_description',
  'og_image',
  'twitter_title',
  'twitter_description',
  'twitter_image',
  'featured_image',
  'draft_layout_json',
  'published_layout_json',
  'content',
  'custom_fields',
  'created_at',
  'updated_at',
  'createdAt',
  'updatedAt',
]);

export function getDbType(url: string): DbType {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgres';
  }
  if (url.startsWith('mongodb://') || url.startsWith('mongodb+srv://')) {
    return 'mongodb';
  }
  throw new Error('Unsupported database URL');
}

function assertDatabaseUrl(url: string) {
  if (!url?.trim()) {
    throw new Error('Database URL is required');
  }
}

function assertSectionName(name: string) {
  if (!name?.trim()) {
    throw new Error('Section name is required');
  }
}

function quoteIdentifier(identifier: string) {
  assertSectionName(identifier);
  return `"${identifier.replace(/"/g, '""')}"`;
}

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

function ensureLayoutContent(value: any) {
  if (Array.isArray(value)) {
    return normalizeLayoutContent({ blocks: value });
  }
  if (isPlainObject(value) && Array.isArray(value.blocks)) {
    return normalizeLayoutContent(value);
  }
  return DEFAULT_CONTENT;
}

function buildSlug(section: string, rawSlug?: string | null) {
  const fallback = `${section}-${Date.now()}`;
  if (!rawSlug?.trim()) {
    return fallback;
  }

  return rawSlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
}

function prepareCmsItem(section: string, input: CmsItemInput, existing?: Record<string, any>) {
  const customFieldsSource = {
    ...(isPlainObject(existing?.custom_fields) ? existing.custom_fields : {}),
    ...(isPlainObject(input.custom_fields) ? input.custom_fields : {}),
  };

  for (const [key, value] of Object.entries(input)) {
    if (!STANDARD_ITEM_KEYS.has(key)) {
      customFieldsSource[key] = value;
    }
  }

  const draftLayout = ensureLayoutContent(input.draft_layout_json ?? input.content ?? existing?.draft_layout_json ?? existing?.content ?? DEFAULT_CONTENT);
  const publishedLayout = input.published_layout_json != null
    ? ensureLayoutContent(input.published_layout_json)
    : existing?.published_layout_json != null
      ? ensureLayoutContent(existing.published_layout_json)
      : null;
  const createdAt = input.created_at ?? input.createdAt ?? existing?.created_at ?? existing?.createdAt ?? new Date();
  const updatedAt = input.updated_at ?? input.updatedAt ?? new Date();

  return {
    title: input.title ?? existing?.title ?? null,
    slug: buildSlug(section, input.slug ?? existing?.slug ?? null),
    seo_title: input.seo_title ?? existing?.seo_title ?? null,
    seo_description: input.seo_description ?? existing?.seo_description ?? null,
    seo_keywords: input.seo_keywords ?? existing?.seo_keywords ?? null,
    og_title: input.og_title ?? existing?.og_title ?? null,
    og_description: input.og_description ?? existing?.og_description ?? null,
    og_image: input.og_image ?? existing?.og_image ?? null,
    twitter_title: input.twitter_title ?? existing?.twitter_title ?? null,
    twitter_description: input.twitter_description ?? existing?.twitter_description ?? null,
    twitter_image: input.twitter_image ?? existing?.twitter_image ?? null,
    featured_image: input.featured_image ?? existing?.featured_image ?? null,
    draft_layout_json: draftLayout,
    published_layout_json: publishedLayout,
    content: draftLayout,
    custom_fields: customFieldsSource,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function normalizeCmsItem(record: Record<string, any> | null | undefined): NormalizedCmsItem | null {
  if (!record) {
    return null;
  }

  const id =
    typeof record.id === 'string'
      ? record.id
      : typeof record._id === 'string'
        ? record._id
        : record._id instanceof ObjectId
          ? record._id.toHexString()
          : String(record.id ?? record._id ?? '');

  const createdAt = record.created_at ?? record.createdAt ?? null;
  const updatedAt = record.updated_at ?? record.updatedAt ?? null;
  const draftLayout = record.draft_layout_json ?? record.content ?? DEFAULT_CONTENT;
  const customFields = isPlainObject(record.custom_fields) ? record.custom_fields : {};

  return {
    ...record,
    id,
    title: record.title ?? null,
    slug: record.slug ?? null,
    seo_title: record.seo_title ?? null,
    seo_description: record.seo_description ?? null,
    seo_keywords: record.seo_keywords ?? null,
    og_title: record.og_title ?? null,
    og_description: record.og_description ?? null,
    og_image: record.og_image ?? null,
    twitter_title: record.twitter_title ?? null,
    twitter_description: record.twitter_description ?? null,
    twitter_image: record.twitter_image ?? null,
    featured_image: record.featured_image ?? null,
    draft_layout_json: ensureLayoutContent(draftLayout),
    published_layout_json: record.published_layout_json != null ? ensureLayoutContent(record.published_layout_json) : null,
    content: ensureLayoutContent(draftLayout),
    custom_fields: customFields,
    created_at: createdAt,
    updated_at: updatedAt,
    createdAt,
    updatedAt,
  };
}

async function withPostgres<T>(url: string, handler: (client: Client) => Promise<T>) {
  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    return await handler(client);
  } finally {
    await client.end();
  }
}

async function withMongo<T>(url: string, handler: (db: Db, client: MongoClient) => Promise<T>) {
  const client = new MongoClient(url);
  await client.connect();

  try {
    return await handler(client.db(), client);
  } finally {
    await client.close();
  }
}

async function ensurePostgresMetadata(client: Client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${quoteIdentifier(CMS_METADATA_TABLE)} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type TEXT NOT NULL,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${quoteIdentifier(CMS_LOGS_TABLE)} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action TEXT NOT NULL,
      details JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_cms_metadata_type_name
    ON ${quoteIdentifier(CMS_METADATA_TABLE)} (type, name);
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_cms_logs_created_at
    ON ${quoteIdentifier(CMS_LOGS_TABLE)} (created_at DESC);
  `);
}

async function ensureMongoMetadata(db: Db) {
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((item) => item.name));

  if (!existing.has(CMS_METADATA_TABLE)) {
    await db.createCollection(CMS_METADATA_TABLE);
  }
  if (!existing.has(CMS_LOGS_TABLE)) {
    await db.createCollection(CMS_LOGS_TABLE);
  }

  await db.collection(CMS_METADATA_TABLE).createIndex({ type: 1, name: 1 }, { unique: true, name: 'cms_metadata_type_name_unique' });
  await db.collection(CMS_LOGS_TABLE).createIndex({ created_at: -1 }, { name: 'cms_logs_created_at_idx' });
}

async function getPostgresColumns(client: Client, table: string) {
  const result = await client.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
    `,
    [table]
  );

  return new Set(result.rows.map((row) => row.column_name as string));
}

async function ensurePostgresSectionSchema(client: Client, section: string) {
  const sectionTable = quoteIdentifier(section);

  await client.query(`
    CREATE TABLE IF NOT EXISTS ${sectionTable} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    );
  `);

  const alterations = [
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS title TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS slug TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS seo_title TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS seo_description TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS seo_keywords TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS og_title TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS og_description TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS og_image TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS twitter_title TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS twitter_description TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS twitter_image TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS featured_image TEXT`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS draft_layout_json JSONB`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS published_layout_json JSONB`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS content JSONB`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    `ALTER TABLE ${sectionTable} ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  ];

  for (const statement of alterations) {
    await client.query(statement);
  }

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ${quoteIdentifier(`idx_${section}_slug_unique`)}
    ON ${sectionTable} (slug)
    WHERE slug IS NOT NULL;
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS ${quoteIdentifier(`idx_${section}_created_at`)}
    ON ${sectionTable} (created_at DESC);
  `);
}

async function ensureMongoSectionSchema(db: Db, section: string) {
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map((item) => item.name));

  if (!existing.has(section)) {
    await db.createCollection(section);
  }

  const collection = db.collection(section);
  await collection.createIndex({ slug: 1 }, { unique: true, sparse: true, name: `${section}_slug_unique` });
  await collection.createIndex({ created_at: -1 }, { name: `${section}_created_at_idx` });
}

async function logPostgresAction(client: Client, action: string, details: Record<string, any>) {
  await client.query(
    `INSERT INTO ${quoteIdentifier(CMS_LOGS_TABLE)} (action, details) VALUES ($1, $2::jsonb)`,
    [action, JSON.stringify(details)]
  );
}

async function logMongoAction(db: Db, action: string, details: Record<string, any>) {
  await db.collection(CMS_LOGS_TABLE).insertOne({
    action,
    details,
    created_at: new Date(),
  });
}

function buildMongoIdentifierFilter(identifier: string) {
  if (ObjectId.isValid(identifier)) {
    return { $or: [{ _id: new ObjectId(identifier) }, { slug: identifier }] };
  }

  return { slug: identifier };
}

function buildPostgresIdentifierWhere(columns: Set<string>, identifier: string) {
  if (columns.has('slug')) {
    return {
      clause: `WHERE id::text = $1 OR slug = $1`,
      values: [identifier],
    };
  }

  return {
    clause: `WHERE id::text = $1`,
    values: [identifier],
  };
}

function mapPostgresWritableColumns(columns: Set<string>, item: ReturnType<typeof prepareCmsItem>) {
  const mapped = new Map<string, any>();

  for (const [key, value] of Object.entries(item)) {
    if (columns.has(key)) {
      mapped.set(key, key.endsWith('_json') || key === 'content' || key === 'custom_fields' ? JSON.stringify(value) : value);
    }
  }

  if (columns.has('updated_at')) {
    mapped.set('updated_at', item.updated_at);
  }

  if (!mapped.has('content') && columns.has('content')) {
    mapped.set('content', JSON.stringify(item.content));
  }

  if (!mapped.has('draft_layout_json') && columns.has('draft_layout_json')) {
    mapped.set('draft_layout_json', JSON.stringify(item.draft_layout_json));
  }

  return mapped;
}

export async function initCmsMetadata(url: string) {
  assertDatabaseUrl(url);
  const type = getDbType(url);

  if (type === 'postgres') {
    await withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
    });
    return;
  }

  await withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
  });
}

export async function testConnection(url: string) {
  assertDatabaseUrl(url);
  const type = getDbType(url);

  if (type === 'postgres') {
    await withPostgres(url, async (client) => {
      await client.query('SELECT 1');
    });
  } else {
    await withMongo(url, async (db) => {
      await db.command({ ping: 1 });
    });
  }

  await initCmsMetadata(url);
  return true;
}

export async function listSections(url: string) {
  assertDatabaseUrl(url);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);

      const allTablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      `);
      const cmsTablesResult = await client.query(
        `SELECT name FROM ${quoteIdentifier(CMS_METADATA_TABLE)} WHERE type = 'section' ORDER BY name ASC`
      );

      const allTables = allTablesResult.rows.map((row) => row.table_name as string);
      const cms = cmsTablesResult.rows.map((row) => row.name as string);
      const archived = allTables.filter(
        (table) => !cms.includes(table) && table !== CMS_METADATA_TABLE && table !== CMS_LOGS_TABLE
      );

      return { cms, archived };
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);

    const allCollections = (await db.listCollections({}, { nameOnly: true }).toArray()).map((item) => item.name);
    const cmsDocs = await db.collection(CMS_METADATA_TABLE).find({ type: 'section' }).sort({ name: 1 }).toArray();
    const cms = cmsDocs.map((doc) => doc.name as string);
    const archived = allCollections.filter(
      (name) => !cms.includes(name) && name !== CMS_METADATA_TABLE && name !== CMS_LOGS_TABLE
    );

    return { cms, archived };
  });
}

export async function createSection(url: string, name: string) {
  assertDatabaseUrl(url);
  assertSectionName(name);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
      await ensurePostgresSectionSchema(client, name);
      await client.query(
        `INSERT INTO ${quoteIdentifier(CMS_METADATA_TABLE)} (type, name) VALUES ('section', $1) ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    await ensureMongoSectionSchema(db, name);
    await db.collection(CMS_METADATA_TABLE).updateOne(
      { type: 'section', name },
      {
        $setOnInsert: {
          type: 'section',
          name,
          created_at: new Date(),
        },
      },
      { upsert: true }
    );
  });
}

export async function listItems(url: string, section: string): Promise<any[]> {
  assertDatabaseUrl(url);
  assertSectionName(section);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      const columns = await getPostgresColumns(client, section);
      const orderClause = columns.has('created_at')
        ? 'ORDER BY created_at DESC'
        : columns.has('updated_at')
          ? 'ORDER BY updated_at DESC'
          : '';

      const result = await client.query(`SELECT * FROM ${quoteIdentifier(section)} ${orderClause}`);
      return result.rows.map((row) => normalizeCmsItem(row)).filter(Boolean);
    });
  }

  return withMongo(url, async (db) => {
    const docs = await db.collection(section).find({}).sort({ created_at: -1, _id: -1 }).toArray();
    return docs.map((doc) => normalizeCmsItem(doc)).filter(Boolean);
  });
}

export async function getItem(url: string, section: string, identifier: string): Promise<any | null> {
  assertDatabaseUrl(url);
  assertSectionName(section);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      const columns = await getPostgresColumns(client, section);
      const where = buildPostgresIdentifierWhere(columns, identifier);
      const result = await client.query(
        `SELECT * FROM ${quoteIdentifier(section)} ${where.clause} LIMIT 1`,
        where.values
      );
      return normalizeCmsItem(result.rows[0]);
    });
  }

  return withMongo(url, async (db) => {
    const doc = await db.collection(section).findOne(buildMongoIdentifierFilter(identifier));
    return normalizeCmsItem(doc);
  });
}

export async function createItem(url: string, section: string, data: CmsItemInput): Promise<any> {
  assertDatabaseUrl(url);
  assertSectionName(section);
  const type = getDbType(url);
  const item = prepareCmsItem(section, data);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
      await ensurePostgresSectionSchema(client, section);

      const columns = await getPostgresColumns(client, section);
      const valuesMap = mapPostgresWritableColumns(columns, item);
      const columnNames = Array.from(valuesMap.keys());
      const values = Array.from(valuesMap.values());
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

      const result = await client.query(
        `INSERT INTO ${quoteIdentifier(section)} (${columnNames.map(quoteIdentifier).join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );

      const normalized = normalizeCmsItem(result.rows[0]);
      await logPostgresAction(client, 'CREATE_ITEM', { section, id: normalized?.id ?? null, slug: normalized?.slug ?? null });
      return normalized;
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    await ensureMongoSectionSchema(db, section);

    const result = await db.collection(section).insertOne({
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    });

    const inserted = await db.collection(section).findOne({ _id: result.insertedId });
    const normalized = normalizeCmsItem(inserted);
    await logMongoAction(db, 'CREATE_ITEM', { section, id: normalized?.id ?? null, slug: normalized?.slug ?? null });
    return normalized;
  });
}

export async function updateItem(url: string, section: string, id: string, data: CmsItemInput): Promise<any> {
  assertDatabaseUrl(url);
  assertSectionName(section);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
      await ensurePostgresSectionSchema(client, section);

      const current = await getItem(url, section, id);
      if (!current) {
        throw new Error('Item not found');
      }

      const columns = await getPostgresColumns(client, section);
      const prepared = prepareCmsItem(section, data, current);
      const valuesMap = mapPostgresWritableColumns(columns, prepared);
      const assignments = Array.from(valuesMap.keys()).map((column, index) => `${quoteIdentifier(column)} = $${index + 1}`);
      const values = Array.from(valuesMap.values());
      values.push(id);

      const result = await client.query(
        `UPDATE ${quoteIdentifier(section)} SET ${assignments.join(', ')} WHERE id::text = $${values.length} RETURNING *`,
        values
      );

      const normalized = normalizeCmsItem(result.rows[0]);
      await logPostgresAction(client, 'UPDATE_ITEM', { section, id: normalized?.id ?? id, slug: normalized?.slug ?? null });
      return normalized;
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    await ensureMongoSectionSchema(db, section);

    const collection = db.collection(section);
    const current = await collection.findOne(buildMongoIdentifierFilter(id));
    if (!current) {
      throw new Error('Item not found');
    }

    const prepared = prepareCmsItem(section, data, normalizeCmsItem(current) ?? current);
    await collection.updateOne(
      { _id: current._id },
      {
        $set: {
          ...prepared,
          updated_at: new Date(),
        },
      }
    );

    const updated = await collection.findOne({ _id: current._id });
    const normalized = normalizeCmsItem(updated);
    await logMongoAction(db, 'UPDATE_ITEM', { section, id: normalized?.id ?? id, slug: normalized?.slug ?? null });
    return normalized;
  });
}

export async function deleteItem(url: string, section: string, id: string) {
  assertDatabaseUrl(url);
  assertSectionName(section);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
      await client.query(`DELETE FROM ${quoteIdentifier(section)} WHERE id::text = $1 OR slug = $1`, [id]);
      await logPostgresAction(client, 'DELETE_ITEM', { section, id });
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    await db.collection(section).deleteOne(buildMongoIdentifierFilter(id));
    await logMongoAction(db, 'DELETE_ITEM', { section, id });
  });
}

export async function verifyPasskey(url: string, passkey: string): Promise<boolean> {
  assertDatabaseUrl(url);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);

      const result = await client.query(
        `SELECT name FROM ${quoteIdentifier(CMS_METADATA_TABLE)} WHERE type = 'passkey' ORDER BY created_at ASC LIMIT 1`
      );

      if (result.rows.length === 0) {
        await client.query(
          `INSERT INTO ${quoteIdentifier(CMS_METADATA_TABLE)} (type, name) VALUES ('passkey', $1)`,
          [passkey]
        );
        return true;
      }

      return result.rows[0].name === passkey;
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    const metadata = db.collection(CMS_METADATA_TABLE);
    const current = await metadata.findOne({ type: 'passkey' });

    if (!current) {
      await metadata.insertOne({
        type: 'passkey',
        name: passkey,
        created_at: new Date(),
      });
      return true;
    }

    return current.name === passkey;
  });
}

export async function getTableStatus(url: string, table: string) {
  assertDatabaseUrl(url);
  assertSectionName(table);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      const result = await client.query(`SELECT COUNT(*)::int AS count FROM ${quoteIdentifier(table)}`);
      return { count: result.rows[0]?.count ?? 0 };
    });
  }

  return withMongo(url, async (db) => {
    const count = await db.collection(table).countDocuments();
    return { count };
  });
}

export async function migrateToCms(url: string, table: string, wipe: boolean) {
  assertDatabaseUrl(url);
  assertSectionName(table);
  const type = getDbType(url);

  if (type === 'postgres') {
    return withPostgres(url, async (client) => {
      await ensurePostgresMetadata(client);
      if (wipe) {
        await client.query(`TRUNCATE TABLE ${quoteIdentifier(table)} RESTART IDENTITY CASCADE`);
      }
      await ensurePostgresSectionSchema(client, table);
      await client.query(
        `INSERT INTO ${quoteIdentifier(CMS_METADATA_TABLE)} (type, name)
         VALUES ('section', $1)
         ON CONFLICT (name) DO UPDATE SET type = EXCLUDED.type`,
        [table]
      );
    });
  }

  return withMongo(url, async (db) => {
    await ensureMongoMetadata(db);
    await ensureMongoSectionSchema(db, table);
    if (wipe) {
      await db.collection(table).deleteMany({});
    }
    await db.collection(CMS_METADATA_TABLE).updateOne(
      { name: table },
      {
        $set: { type: 'section', name: table },
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true }
    );
  });
}


