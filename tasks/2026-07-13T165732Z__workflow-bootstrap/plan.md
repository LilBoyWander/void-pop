# Implementation Plan: Workflow Bootstrap

## Approach

1. Inspect repository structure, manifest, source boundaries, and current Git
   state.
2. Define a minimal client-game workflow using the same feature-level lifecycle
   as Fakeout, tailored to a frontend-only project.
3. Create root context, canonical docs, feature templates, a project skill, and
   this bootstrap evidence folder.
4. Run lint/build, validate documentation links/required files, and inspect the
   final diff without modifying production source.

## Ownership

Builder owns only new workflow and documentation files. Existing source,
configuration, generated output, dependencies, and the pre-existing modified
`node_modules/.vite/deps/_metadata.json` are excluded.

## Risks

- Over-ceremony for a small game: mitigated by one feature folder and one gate
  chain per feature.
- Documentation overstating behavior: mitigated by direct source/manifest
  inspection and explicit recording of the missing test script.
- Accidental source or generated changes: mitigated by final Git diff review.
