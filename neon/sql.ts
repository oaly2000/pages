import { neon } from "npm:@neondatabase/serverless";

const NEON_URI = Deno.env.get("NEON_URI");

const IS_BUILD = Deno.args.includes("build");

if (!IS_BUILD && !NEON_URI) {
  throw new Error("NEON_URI is not set");
}

// deno-lint-ignore no-explicit-any
const sql = IS_BUILD ? ((async () => {}) as any) : neon(NEON_URI!);

await sql(`
CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    path TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    compiled TEXT NOT NULL,
    md5 TEXT NOT NULL
);`);

await sql(`
CREATE TABLE IF NOT EXISTS tag_contents (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES contents (id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);`);

await sql(`CREATE UNIQUE INDEX IF NOT EXISTS contents_title_idx ON contents (title);`);
await sql(`CREATE INDEX IF NOT EXISTS tag_contents_tag_idx ON tag_contents (tag);`);

export { sql };
