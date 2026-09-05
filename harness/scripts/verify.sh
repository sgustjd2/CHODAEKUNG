#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

printf '%s\n' '== CHODAE KUNG verification =='

if [ ! -f package.json ]; then
  printf '%s\n' '[warn] package.json not found. No JS project checks were run.'
  exit 0
fi

if [ -f pnpm-lock.yaml ]; then
  PM="pnpm"
elif [ -f yarn.lock ]; then
  PM="yarn"
elif [ -f bun.lockb ] || [ -f bun.lock ]; then
  PM="bun"
else
  PM="npm"
fi

printf 'package manager: %s\n' "$PM"

has_script() {
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$1'] ? 0 : 1)" >/dev/null 2>&1
}

run_script() {
  name="$1"
  if ! has_script "$name"; then
    printf '[skip] %s script not found\n' "$name"
    return 0
  fi

  printf '%s\n' "[run] $name"
  case "$PM" in
    pnpm) pnpm run "$name" ;;
    yarn) yarn "$name" ;;
    bun) bun run "$name" ;;
    npm) npm run "$name" ;;
  esac
}

status=0

for script in typecheck lint test build; do
  if ! run_script "$script"; then
    printf '[fail] %s\n' "$script"
    status=1
  fi
done

if [ "$status" -eq 0 ]; then
  printf '%s\n' 'Verification completed without detected script failures.'
else
  printf '%s\n' 'Verification detected one or more failures.'
fi

exit "$status"
