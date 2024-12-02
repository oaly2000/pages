import { walk } from "@std/fs";
import { extractYaml } from "@std/front-matter";
import { render } from "@deno/gfm";
import { crypto } from "jsr:@std/crypto";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-csharp.js";
import "npm:prismjs@1.29.0/components/prism-fsharp.js";
import "npm:prismjs@1.29.0/components/prism-powershell.js";

type Attrs = { title: string; tags?: string[]; date: string; "disable-math"?: boolean };

const md5 = async (s: string): Promise<string> => {
  const buf = new TextEncoder().encode(s);
  const buf_1 = await crypto.subtle.digest("MD5", buf);
  return Array.from(new Uint8Array(buf_1)).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const files = walk("contents", { exts: [".md"] });

export const records = (await Promise.all(
  await Array.fromAsync(files).then((files) => {
    return files.map(async (file) => {
      const tags = file.path.split("/").slice(1, -1);
      const { attrs, body } = extractYaml(await Deno.readTextFile(file.path)) as { attrs: Attrs; body: string };

      if (attrs.tags) tags.push(...attrs.tags);

      const record = {
        title: attrs.title,
        path: file.path,
        tags,
        date: new Date(attrs.date),
        compiled: render(body, { allowMath: !attrs["disable-math"] }),
        md5: await md5(body),
      };

      return record;
    });
  }),
)).sort((a, b) => b.date.getTime() - a.date.getTime());
