# E‑Commerce Tablet Store

A premium MENA‑focused tablet e‑commerce website.

## Overview

This project implements a bilingual (English / Arabic) online store with a clean, minimalist UI inspired by high‑end electronics retailers. It includes product listings, language switching, shopping cart, and checkout flow.

## Documentation

- [Requirements](.kiro/specs/premium-mena-tablet-store/requirements.md)
- [Design](.kiro/specs/premium-mena-tablet-store/design.md)
- [Task List](.kiro/specs/premium-mena-tablet-store/tasks.md)


### Master Prompt (Open Code Free Models – Zen Plan)
```
Input files:

@modelName/tasks.md
@requirements.md
@design.md
Instructions
Treat the modelName directory as the working root.
Read and understand the tasks defined in modelName/tasks.md.
Execute all work inside the modelName folder. Do not create or modify files outside this directory unless explicitly required.
Implement tasks sequentially, one task at a time.
Skip all test-related tasks.
For every implementation task, spawn a dedicated subagent responsible only for that task.
Wait for the subagent to complete before moving to the next task.
Follow the requirements in requirements.md and the architecture and conventions in design.md.
After each task, update the relevant files and maintain consistency within the codebase.
Continue until all non-test tasks are completed.
Do not batch multiple tasks together.
Constraints
All new files, code changes, and refactors must remain within the modelName folder.
Do not modify files outside modelName unless a task explicitly requires it.
Preserve the existing project structure and coding conventions.
```