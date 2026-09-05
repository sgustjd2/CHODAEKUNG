#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

printf '%s\n' '== CHODAE KUNG harness preflight =='
printf 'root: %s\n' "$ROOT"

check_file() {
  if [ -f "$1" ]; then
    printf '[ok]   %s\n' "$1"
  else
    printf '[warn] missing: %s\n' "$1"
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    printf '[ok]   %s/\n' "$1"
  else
    printf '[warn] missing: %s/\n' "$1"
  fi
}

check_file "CLAUDE.md"
check_file "prd.md"
check_dir "harness"

if [ -d "design/genspark" ]; then
  printf '[ok]   design/genspark/\n'
  count=$(find design/genspark -type f 2>/dev/null | wc -l | tr -d ' ')
  printf '       design files: %s\n' "$count"
elif [ -d "design" ]; then
  printf '[warn] design/ exists, but design/genspark/ was not found\n'
else
  printf '[warn] no design directory found yet\n'
fi

printf '%s\n' '-- project detection --'
for f in package.json pnpm-lock.yaml yarn.lock package-lock.json bun.lockb bun.lock tsconfig.json next.config.js next.config.mjs next.config.ts; do
  [ -e "$f" ] && printf '[found] %s\n' "$f"
done

if [ -f package.json ]; then
  if command -v node >/dev/null 2>&1; then
    node - <<'NODE'
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('package:', p.name || '(unnamed)');
console.log('scripts:');
for (const [k, v] of Object.entries(p.scripts || {})) console.log(`  ${k}: ${v}`);
NODE
  else
    printf '[warn] node is not installed; package scripts not listed\n'
  fi
fi

printf '%s\n' '-- harness state --'
for f in harness/state/design-source-map.md harness/state/component-registry.md harness/state/implementation-log.md; do
  if [ -f "$f" ]; then
    printf '[ok]   %s\n' "$f"
  else
    printf '[todo] create %s from harness/templates/\n' "$f"
  fi
done

printf '%s\n' 'Preflight complete.'
