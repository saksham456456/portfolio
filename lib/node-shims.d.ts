declare module "node:fs/promises" {
  export function readFile(path: string, encoding: string): Promise<string>;
}

declare module "node:path" {
  export function join(...parts: string[]): string;
}

declare const process: {
  cwd(): string;
};
