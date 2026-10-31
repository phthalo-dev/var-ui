#!/usr/bin/env bash
# Run the CI `Verify` job (or part of it) locally in Docker, in an Ubuntu environment that matches
# GitHub Actions: same Node (.nvmrc), pnpm (packageManager), Playwright Chromium with OS deps.
# Use it to reproduce Linux-only failures (e.g. 15px classic scrollbars + `scrollbar-gutter`).
#
#   scripts/ci-docker.sh                      # install, then the exact CI command: `vp run ci`
#   scripts/ci-docker.sh --browser [filters]  # only `vp test run --project browser` in packages/react
#   scripts/ci-docker.sh --shell              # interactive shell in the container
#   scripts/ci-docker.sh -- <command...>      # any command, from the repo root
#
# Flags: --no-install (skip pnpm install), --fresh (drop the cached volumes first),
#        --repeat N (with --browser: run N times in a row).
#
# The working tree is rsynced (without node_modules/dist/.git) into a named volume; node_modules,
# dist and the pnpm store live in named volumes, so the host is never written to (except
# .vitest-linux/ with failure screenshots) and installs are cached between runs.
set -euo pipefail

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo "error: Docker is not running (or not installed). Start Docker Desktop and retry." >&2
  exit 1
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

mode=ci install=1 fresh=0 repeat=1
cmd=()
while [ $# -gt 0 ]; do
  case "$1" in
    --browser) mode=browser ;;
    --shell) mode=shell ;;
    --no-install) install=0 ;;
    --fresh) fresh=1 ;;
    --repeat) repeat="$2"; shift ;;
    --) shift; mode=cmd; cmd=("$@"); break ;;
    -h|--help) sed -n '2,14p' "$0"; exit 0 ;;
    *) cmd+=("$1") ;;  # filters for --browser
  esac
  shift
done

# Versions come from the repo, never hard-coded here.
node_version="$(tr -d 'v \n' < .nvmrc)"
pnpm_version="$(sed -n 's/.*"packageManager": "pnpm@\([^"]*\)".*/\1/p' package.json)"
pw_version="$(sed -n 's/.*[( ]playwright@\([0-9][0-9.]*\).*/\1/p' pnpm-lock.yaml | head -1)"
[ -n "$pw_version" ] || pw_version="$(sed -n 's/.*playwright@\([0-9][0-9.]*\).*/\1/p' pnpm-lock.yaml | head -1)"
[ -n "$pnpm_version" ] && [ -n "$pw_version" ] || { echo "error: could not resolve pnpm/Playwright versions" >&2; exit 1; }

image="var-ui-ci:node${node_version}-pw${pw_version}-pnpm${pnpm_version}"
work="var-ui-ci-work-node${node_version}-pw${pw_version}"
store="var-ui-ci-pnpm-store"

if [ "$fresh" = 1 ]; then docker volume rm -f "$work" "$store" >/dev/null; fi

if ! docker image inspect "$image" >/dev/null 2>&1; then
  echo "==> building $image (one-off, a few minutes)"
  docker build -q -t "$image" \
    --build-arg NODE_VERSION="$node_version" \
    --build-arg PNPM_VERSION="$pnpm_version" \
    --build-arg PLAYWRIGHT_VERSION="$pw_version" \
    docker/ci
fi

mkdir -p "$root/.vitest-linux"
tty=(); [ -t 0 ] && [ -t 1 ] && tty=(-it)
start=$SECONDS

# Script run inside the container. Args: mode install repeat then the command/filters.
inner='
set -euo pipefail
mode=$1 install=$2 repeat=$3; shift 3
echo "==> sync repo into the volume"
rsync -a --delete \
  --exclude node_modules --exclude dist --exclude dist-types --exclude .git \
  --exclude .vitest --exclude .vitest-linux --exclude .worktrees --exclude .netlify \
  --exclude .astro --exclude .turbo --exclude audit \
  /src/ /work/
cd /work
[ -d .git ] || git init -q .
pnpm config set store-dir /pnpm-store >/dev/null
if [ "$install" = 1 ]; then
  echo "==> pnpm install --frozen-lockfile (cached)"
  pnpm install --frozen-lockfile --ignore-scripts >/dev/null
fi
export PATH="/work/node_modules/.bin:$PATH"
echo "==> Node $(node -v), pnpm $(pnpm -v), Playwright $(cd packages/react && npx playwright --version), $(uname -sm)"
rc=0
case "$mode" in
  ci) vp run ci || rc=$? ;;
  browser)
    # Only the @var-ui/react browser project needs core built (CI builds everything first).
    (cd packages/core && npx vp run build >/dev/null)
    cd packages/react
    for i in $(seq 1 "$repeat"); do
      echo "==> browser tests, run $i/$repeat"
      npx vp test run --project browser "$@" || rc=$?
      [ "$rc" = 0 ] || break
    done
    rm -rf /out/attachments; cp -r .vitest/attachments /out/ 2>/dev/null || true ;;
  shell) exec bash ;;
  cmd) "$@" || rc=$? ;;
esac
exit $rc
'

rc=0
docker run --rm --init --ipc=host ${tty[@]+"${tty[@]}"} \
  -v "$root":/src:ro \
  -v "$work":/work \
  -v "$store":/pnpm-store \
  -v "$root/.vitest-linux":/out \
  -e CI=true \
  "$image" bash -c "$inner" _ "$mode" "$install" "$repeat" ${cmd[@]+"${cmd[@]}"} || rc=$?
echo "==> done in $((SECONDS - start))s (exit $rc)"
exit $rc
