# Toolchain image that mirrors the GitHub Actions `Verify` job (ubuntu-latest): Node from .nvmrc,
# pnpm from package.json `packageManager`, and Playwright's Chromium with OS deps. It holds NO repo
# and NO node_modules, so it rarely rebuilds. Use it through `scripts/ci-docker.sh`, which passes
# the build args below from the repo files.
FROM ubuntu:24.04

ARG NODE_VERSION=24
ARG PNPM_VERSION
ARG PLAYWRIGHT_VERSION

ENV DEBIAN_FRONTEND=noninteractive \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    CI=true

RUN apt-get update \
 && apt-get install -y --no-install-recommends git curl ca-certificates xz-utils rsync \
 && rm -rf /var/lib/apt/lists/*

# Node: latest release of the major in .nvmrc (what setup-vp resolves), official tarball.
RUN set -eux; \
    case "$(dpkg --print-architecture)" in amd64) a=x64 ;; arm64) a=arm64 ;; *) exit 1 ;; esac; \
    base="https://nodejs.org/dist/latest-v${NODE_VERSION}.x"; \
    file="$(curl -fsSL "$base/SHASUMS256.txt" | grep -o "node-v[0-9.]*-linux-$a\.tar\.xz" | head -1)"; \
    curl -fsSL "$base/$file" | tar -xJ -C /usr/local --strip-components=1; \
    npm i -g corepack@latest; \
    corepack enable; \
    corepack prepare "pnpm@${PNPM_VERSION}" --activate; \
    node -v; pnpm -v

# Same command as the workflow's "Install Chromium (with system deps)" step.
RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install --with-deps chromium \
 && chmod -R a+rX /ms-playwright \
 && rm -rf /var/lib/apt/lists/*

# Non-root like the runner. /work (repo copy + node_modules) and /pnpm-store are mounted from
# named volumes, which inherit this ownership on first use.
RUN mkdir -p /work /pnpm-store /out \
 && chown -R ubuntu:ubuntu /work /pnpm-store /out /home/ubuntu
USER ubuntu
ENV HOME=/home/ubuntu \
    COREPACK_HOME=/home/ubuntu/.cache/corepack
RUN corepack prepare "pnpm@${PNPM_VERSION}" --activate
WORKDIR /work
