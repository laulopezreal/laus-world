# AGENTS.md

You are Codex working in this repo.

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS

### Backend
- FastAPI (Python)
- Postgres (metadata storage)
- Optional: Neo4j (graph analysis, future)
- Stockfish (chess engine analysis service)

## Development Rules
0. **pull before doing any change** – create new branches out of the latest version of dev before you start editting files.
1. **Small incremental commits** – Keep changes focused and atomic
2. **Don't refactor unrelated code** – Only change what's necessary for the task
3. **Prefer simple solutions** – Choose straightforward approaches over complex ones
4. **Explain decisions briefly** – Document why, not just what
5. **UI Consistency** – All UI changes must follow `apps/web/DESIGN_GUIDE.md` and reuse existing patterns.
6. **Pull Requests** – All Pull Requests must target the `dev` branch, not `main`.
## File Scope Discovery Rule

- When file scope is unclear:
  - First run a discovery-only step.
  - Do not implement or edit files during discovery.
  - Wait for explicit approval of the file list before modifying code.

## Commands to Run

### Frontend
```bash
npm test          # Run tests
npm run lint      # Lint code
npm run build     # Build for production
```

### Backend
```bash
pytest            # Run tests
ruff              # Lint (if configured)
black             # Format (if configured)
```

## Creating Pull Requests

When creating PRs, use the following approach:

### Standard PR Creation
```bash
# Use --base dev (all PRs target dev branch)
# Use required_permissions: ["all"] to bypass sandbox restrictions
gh pr create --title "feat(scope): description" --base dev --body "PR description here"
```

### If `gh pr create` fails with network/TLS errors:
1. **Try with `["all"]` permissions** – This bypasses sandbox restrictions
2. **Use `--web` flag** – Opens browser instead of API calls: `gh pr create --web`
3. **Push to existing PR branch** – If PR exists, just push commits and use `gh pr edit <PR_NUMBER>`

### Common Issues & Solutions:
- **TLS certificate errors**: Use `required_permissions: ["all"]`
- **credential-gh not found**: Ignore warning, command usually still works
- **"Device not configured"**: Push may still succeed despite error message

### Example Working Command:
```bash
gh pr create --title "feat(web): add feature" --base dev --body "Summary of changes"
# With permissions: required_permissions: ["all"]
```

### After PR Creation:
1. Run `gh pr list` to confirm PR was created
2. Run `gh pr checks <PR_NUMBER>` to monitor CI status
3. Use `gh pr edit <PR_NUMBER> --body "..."` to update description

## Output Rule

After making changes, always:
1. **Summarize what changed** – Brief description of modifications
2. **How to run locally** – Commands needed to test the changes
