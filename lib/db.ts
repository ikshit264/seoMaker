import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';

export type DbType = 'postgres' | 'mongodb';

export function getDbType(url: string): DbType {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgres';
  }
  if (url.startsWith('mongodb://') || url.startsWith('mongodb+srv://')) {
    return 'mongodb';
  }
  throw new Error('Unsupported database URL');
}

function getPrisma(url: string) {
  return new PrismaClient({ datasources: { db: { url } } });
}

export async function initCmsMetadata(url: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS _cms_metadata (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS _cms_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.end();
  } else {
    // With Prisma MongoDB, collections are created implicitly on first write.
    // However, indexes are managed by Prisma schema. We can just test connection.
    const prisma = getPrisma(url);
    await prisma.$connect();
    await prisma.$disconnect();
  }
}

export async function testConnection(url: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
  } else {
    const prisma = getPrisma(url);
    await prisma.$connect();
    await prisma.$runCommandRaw({ ping: 1 });
    await prisma.$disconnect();
  }
  await initCmsMetadata(url);
  return true;
}

export async function listSections(url: string) {
  const type = getDbType(url);
  let allTables: string[] = [];
  let cmsTables: string[] = [];

  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    allTables = res.rows.map((row) => row.table_name);

    try {
      const cmsRes = await client.query(`SELECT name FROM _cms_metadata WHERE type = 'section'`);
      cmsTables = cmsRes.rows.map((row) => row.name);
    } catch (e) { }
    await client.end();
  } else {
    const prisma = getPrisma(url);
    try {
      const collectionsRes = await prisma.$runCommandRaw({ listCollections: 1 }) as any;
      if (collectionsRes?.cursor?.firstBatch) {
        allTables = collectionsRes.cursor.firstBatch.map((col: any) => col.name);
      }
      const cmsDocs = await prisma.cmsMetadata.findMany({ where: { type: 'section' } });
      cmsTables = cmsDocs.map(doc => doc.name);
    } catch (e) {
      // Collections might be empty
    } finally {
      await prisma.$disconnect();
    }
  }

  const archived = allTables.filter(t => !cmsTables.includes(t) && !t.startsWith('_cms_') && t !== 'Page' && t !== 'CmsMetadata' && t !== 'CmsLog');
  return { cms: cmsTables, archived };
}

export async function createSection(url: string, name: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        slug TEXT UNIQUE,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        og_title TEXT,
        og_description TEXT,
        og_image TEXT,
        twitter_title TEXT,
        twitter_description TEXT,
        twitter_image TEXT,
        featured_image TEXT,
        content JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      INSERT INTO _cms_metadata (type, name) VALUES ('section', $1) ON CONFLICT (name) DO NOTHING;
    `, [name]);
    await client.end();
  } else {
    const prisma = getPrisma(url);
    try {
      // Use Prisma upsert
      await prisma.cmsMetadata.upsert({
        where: { name },
        update: {},
        create: {
          name,
          type: 'section'
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function listItems(url: string, section: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    let res;
    try {
      res = await client.query(`SELECT * FROM "${section}" ORDER BY created_at DESC`);
    } catch (e) {
      res = await client.query(`SELECT * FROM "${section}"`);
    }
    await client.end();
    return res.rows;
  } else {
    const prisma = getPrisma(url);
    try {
      // Query the section-specific collection directly using raw command
      const itemsRes = await prisma.$runCommandRaw({
        find: section,
        sort: { createdAt: -1 }
      }) as any;
      return itemsRes?.cursor?.firstBatch || [];
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function getItem(url: string, section: string, id: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(`SELECT * FROM "${section}" WHERE id = $1`, [id]);
    await client.end();
    return res.rows[0];
  } else {
    const prisma = getPrisma(url);
    try {
      // Query the section-specific collection directly using raw command
      const itemRes = await prisma.$runCommandRaw({
        find: section,
        filter: { _id: { $oid: id } },
        limit: 1
      }) as any;
      const items = itemRes?.cursor?.firstBatch || [];
      return items[0] || null;
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function createItem(url: string, section: string, data: any) {
  const type = getDbType(url);
  const now = new Date();

  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const keys = Object.keys(data);
    const values = Object.values(data);

    // Add created_at and updated_at if not present in data
    if (!keys.includes('created_at')) {
      keys.push('created_at');
      values.push(now);
    }
    if (!keys.includes('updated_at')) {
      keys.push('updated_at');
      values.push(now);
    }

    const placeholders = values.map((_, i) => '$' + (i + 1)).join(', ');
    const query = `INSERT INTO "${section}" (${keys.map(k => '"' + k + '"').join(', ')}) VALUES (${placeholders}) RETURNING *`;

    // For JSONB content
    const formattedValues = values.map(v => typeof v === 'object' && !(v instanceof Date) ? JSON.stringify(v) : v);

    const res = await client.query(query, formattedValues);

    // Log action
    await client.query(`INSERT INTO _cms_logs (action, details) VALUES ($1, $2)`, [
      'CREATE_ITEM',
      JSON.stringify({ section, id: res.rows[0].id })
    ]);

    await client.end();
    return res.rows[0];
  } else {
    const prisma = getPrisma(url);
    try {
      // Prepare document to insert into section-specific collection
      const document = {
        title: data.title || 'Untitled',
        slug: data.slug || `${section}-${Date.now()}`,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        seo_keywords: data.seo_keywords || null,
        og_title: data.og_title || null,
        og_description: data.og_description || null,
        og_image: data.og_image || null,
        twitter_title: data.twitter_title || null,
        twitter_description: data.twitter_description || null,
        twitter_image: data.twitter_image || null,
        featured_image: data.featured_image || null,
        draft_layout_json: data.content || data.draft_layout_json || {},
        published_layout_json: data.published_layout_json || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        ...data // Include any additional custom fields
      };

      // Insert into section-specific collection using raw command
      const insertRes = await prisma.$runCommandRaw({
        insert: section,
        documents: [document]
      }) as any;

      const insertedId = insertRes?.insertedIds?.[0];
      
      // Log action
      await prisma.cmsLog.create({
        data: {
          action: 'CREATE_ITEM',
          details: { section, id: insertedId }
        }
      });
      
      return { ...document, id: insertedId };
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function updateItem(url: string, section: string, id: string, data: any) {
  const type = getDbType(url);
  const now = new Date();
  
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const keys = Object.keys(data);
    const values = Object.values(data);
    
    keys.push('updated_at');
    values.push(now);

    const setClause = keys.map((k, i) => `"${k}" = $${ i + 1}`).join(', ');
    const query = `UPDATE "${section}" SET ${ setClause } WHERE id = $${ keys.length + 1 } RETURNING * `;
    
    const formattedValues = values.map(v => typeof v === 'object' && !(v instanceof Date) ? JSON.stringify(v) : v);
    formattedValues.push(id);

    let res;
    try {
      res = await client.query(query, formattedValues);
    } catch (e) {
      // Fallback for external tables without updated_at
      keys.pop();
      values.pop();
      formattedValues.splice(formattedValues.length - 2, 1);
      const fallbackSetClause = keys.map((k, i) => `"${k}" = $${ i + 1 } `).join(', ');
      const fallbackQuery = `UPDATE "${section}" SET ${ fallbackSetClause } WHERE id = $${ keys.length + 1 } RETURNING * `;
      res = await client.query(fallbackQuery, formattedValues);
    }
    
    // Log action
    await client.query(`INSERT INTO _cms_logs(action, details) VALUES($1, $2)`, [
      'UPDATE_ITEM', 
      JSON.stringify({ section, id })
    ]);
    
    await client.end();
    return res.rows[0];
  } else {
    const prisma = getPrisma(url);
    try {
      // Build update document with all provided fields
      const updateDoc: any = {
        updatedAt: new Date(),
        updated_at: new Date()
      };
      
      // Map standard fields
      if (data.title !== undefined) updateDoc.title = data.title;
      if (data.slug !== undefined) updateDoc.slug = data.slug;
      if (data.content !== undefined || data.draft_layout_json !== undefined) {
        updateDoc.draft_layout_json = data.content || data.draft_layout_json;
      }
      if (data.published_layout_json !== undefined) {
        updateDoc.published_layout_json = data.published_layout_json;
      }
      
      // Metadata fields
      const metaFields = [
        'seo_title', 'seo_description', 'seo_keywords',
        'og_title', 'og_description', 'og_image',
        'twitter_title', 'twitter_description', 'twitter_image',
        'featured_image'
      ];
      metaFields.forEach(field => {
        if (data[field] !== undefined) updateDoc[field] = data[field];
      });
      
      // Include any additional custom fields from data
      Object.keys(data).forEach(key => {
        if (!(key in updateDoc) && !['id', '_id', 'createdAt', 'updatedAt'].includes(key)) {
          updateDoc[key] = data[key];
        }
      });

      // Update in section-specific collection using raw command
      const updateRes = await prisma.$runCommandRaw({
        update: section,
        updates: [{
          q: { _id: { $oid: id } },
          u: { $set: updateDoc }
        }]
      }) as any;

      // Fetch the updated document
      const findRes = await prisma.$runCommandRaw({
        find: section,
        filter: { _id: { $oid: id } },
        limit: 1
      }) as any;
      
      const updatedItem = findRes?.cursor?.firstBatch?.[0];
      
      // Log action
      await prisma.cmsLog.create({
        data: {
          action: 'UPDATE_ITEM',
          details: { section, id }
        }
      });
      
      return updatedItem;
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function deleteItem(url: string, section: string, id: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    await client.query(`DELETE FROM "${section}" WHERE id = $1`, [id]);
    
    // Log action
    await client.query(`INSERT INTO _cms_logs(action, details) VALUES($1, $2)`, [
      'DELETE_ITEM', 
      JSON.stringify({ section, id })
    ]);
    
    await client.end();
  } else {
    const prisma = getPrisma(url);
    try {
      // Delete from section-specific collection using raw command
      await prisma.$runCommandRaw({
        delete: section,
        deletes: [{ q: { _id: { $oid: id } }, limit: 1 }]
      });
      
      // Log action
      await prisma.cmsLog.create({
        data: {
          action: 'DELETE_ITEM',
          details: { section, id }
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function verifyPasskey(url: string, passkey: string): Promise<boolean> {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(`SELECT name FROM _cms_metadata WHERE type = 'passkey'`);
    await client.end();
    
    if (res.rows.length === 0) {
      // If no passkey exists, the first one provided becomes the passkey
      const setClient = new Client({ connectionString: url });
      await setClient.connect();
      await setClient.query(`INSERT INTO _cms_metadata(type, name) VALUES('passkey', $1)`, [passkey]);
      await setClient.end();
      return true;
    }
    
    return res.rows[0].name === passkey;
  } else {
    const prisma = getPrisma(url);
    try {
      const doc = await prisma.cmsMetadata.findFirst({
        where: { type: 'passkey' }
      });
      
      if (!doc) {
        await prisma.cmsMetadata.create({
          data: { type: 'passkey', name: passkey }
        });
        return true;
      }
      return doc.name === passkey;
    } finally {
      await prisma.$disconnect();
    }
  }
}
export async function getTableStatus(url: string, table: string) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query(`SELECT COUNT(*) FROM "${table}"`);
    await client.end();
    return { count: parseInt(res.rows[0].count, 10) };
  } else {
    const prisma = getPrisma(url);
    try {
      // Use raw command to count records in an arbitrary collection
      const countRes = await prisma.$runCommandRaw({
        count: table
      }) as any;
      return { count: countRes.n || 0 };
    } finally {
      await prisma.$disconnect();
    }
  }
}

export async function migrateToCms(url: string, table: string, wipe: boolean) {
  const type = getDbType(url);
  if (type === 'postgres') {
    const client = new Client({ connectionString: url });
    await client.connect();
    if (wipe) {
      await client.query(`TRUNCATE TABLE "${table}" CASCADE`);
    }
    await client.query(`
      INSERT INTO _cms_metadata (type, name) 
      VALUES ('section', $1) 
      ON CONFLICT (name) DO UPDATE SET type = 'section'
    `, [table]);
    await client.end();
  } else {
    const prisma = getPrisma(url);
    try {
      if (wipe) {
        await prisma.$runCommandRaw({
          delete: table,
          deletes: [{ q: {}, limit: 0 }]
        });
      }
      await prisma.cmsMetadata.upsert({
        where: { name: table },
        update: { type: 'section' },
        create: { name: table, type: 'section' }
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
