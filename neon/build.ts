import { sql } from "./sql.ts";
import { records } from "./local.ts";

await sql(`DELETE FROM contents;`);

const statement = `INSERT INTO contents (title, path, tags, date, compiled, md5) VALUES ($1, $2, $3, $4, $5, $6);`;

await sql.transaction(
  records.map((record) => sql(statement, [record.title, record.path, record.tags, record.date, record.compiled, record.md5])),
);

const remoteRecords = await sql("SELECT id, title, tags FROM contents;") as Array<{ id: number; title: string; tags: string[] }>;

const statement2 = `INSERT INTO tag_contents (content_id, tag) VALUES ($1, $2);`;

await sql.transaction(
  remoteRecords.map((record) => {
    return record.tags.map((tag) => sql(statement2, [record.id, tag]));
  }).flat(),
);
