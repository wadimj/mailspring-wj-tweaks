# Conventions

## Source maps
- Never commit `//# sourceMappingURL=...` comments (inline source maps) in `lib/*.js`.
- Enabling `inlineSourceMap` in `tsconfig.json` for local debugging is fine. Before committing, rebuild without it or strip the comments, and keep the `tsconfig.json` change out of the commit.
