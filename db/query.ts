import { Database } from "@db/sqlite";

const db = new Database("db/db.sqlite");

type TitleTags = {
  title: string;
  tags: string[];
};

export const loadRecords = (page = 1, perPage = 10) =>
  db.sql<
    { title: string; tags: string; date: string; compiled: string }
  >`SELECT title, tags, date, compiled FROM records ORDER BY date DESC LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`.map((row) => ({
    title: row.title,
    tags: JSON.parse(row.tags),
    date: new Date(row.date).toLocaleDateString(),
    compiled: row.compiled,
  }));

export const countTitleTags = () => db.sql<{ count: number }>`SELECT COUNT(*) as count FROM records`.map((row) => row.count)[0];

export const loadTitleTagsByTag = (tag: string) =>
  db.sql<{ title: string; tags: string }>`SELECT title, tags FROM records rs LEFT JOIN tags ts ON rs.path = ts.path WHERE ts.tag = ${tag}`
    .map((row) => ({ title: row.title, tags: JSON.parse(row.tags) }) as TitleTags);

export const loadSingleRecord = (title: string) =>
  db.sql<
    { title: string; tags: string; date: string; compiled: string }
  >`SELECT title, tags, date, compiled FROM records WHERE title = ${title}`
    .map((row) => ({
      title: row.title,
      tags: JSON.parse(row.tags),
      date: new Date(row.date).toLocaleDateString(),
      compiled: row.compiled,
    }))[0];

export const loadTags = () => db.sql<{ tag: string }>`SELECT DISTINCT tag FROM tags`.map((row) => row.tag);
