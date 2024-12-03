import { sql } from "./sql.ts";

type Content = {
  title: string;
  tags: string[];
  date: Date;
  compiled: string;
};

export const loadRecords = async (page = 1, perPage = 10) => {
  return await sql(`SELECT title, tags, date, compiled FROM contents LIMIT $1 OFFSET $2;`, [perPage, (page - 1) * perPage]) as Content[];
};

export const count = async () => {
  return (await sql("SELECT COUNT(*) FROM contents;"))[0].count;
};

export const loadSingleRecord = async (title: string) => {
  return (await sql("SELECT title, tags, date, compiled FROM contents WHERE title = $1;", [title]))[0] as Content;
};

export const loadRecordsByTag = async (tag: string) => {
  return (await sql("SELECT title FROM contents WHERE $1 = ANY(tags);", [tag])).map(({ title }: { title: string }) => title) as string[];
};

export const loadTags = async () => {
  return (await sql("SELECT DISTINCT tag FROM tag_contents;")).map(({ tag }: { tag: string }) => tag) as string[];
};
