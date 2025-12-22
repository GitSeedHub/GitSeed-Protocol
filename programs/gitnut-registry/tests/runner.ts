/**
 * GitNut Registry tests runner.
 *
 * This file is referenced by Anchor.toml scripts.test:
 *   pnpm -s ts-node ./programs/gitnut-registry/tests/runner.ts
 *
 * It loads mocha programmatically to keep the repository flexible.
 */
import "dotenv/config";
import path from "path";
import Mocha from "mocha";

const mocha = new Mocha({
  ui: "bdd",
  color: true,
  timeout: 180_000,
});

const specs = [
  "anchor.spec.ts",
  "registry.spec.ts",
  "policy.spec.ts",
  "access-control.spec.ts",
];

for (const s of specs) {
  mocha.addFile(path.join(__dirname, s));
}

mocha.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});
