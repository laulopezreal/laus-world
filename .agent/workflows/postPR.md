---
description: Post-PR workflow - address comments and fix conflicts
---

# Post-PR Workflow

When the user says "postPR", follow these steps to address PR comments and resolve conflicts:

## 1. Fetch PR Information

```bash
# Get PR number from current branch or user input
gh pr view <PR_NUMBER> --json comments,reviews,reviewDecision,mergeable,mergeStateStatus
```

Check for:
- Review comments and suggestions
- Merge conflicts (mergeable status)
- Required changes

## 2. Fetch and Rebase

```bash
# Stash any uncommitted changes
git stash

# Fetch latest base branch (usually main or dev)
git fetch origin <BASE_BRANCH>

# Rebase current branch onto base
git rebase origin/<BASE_BRANCH>
```

If conflicts occur:
- Resolve conflicts in affected files
- `git add <resolved_files>`
- `git rebase --continue`

## 3. Address Review Comments

For each review comment:
- Read the feedback carefully
- Make the requested changes
- Add inline comments in code if helpful
- Follow coding standards and best practices

Common review fixes:
- Rename variables/functions for clarity
- Improve code organization (e.g., clsx object syntax)
- Add/update comments
- Fix linting issues
- Update tests

## 4. Test Changes Locally

```bash
# Ensure dev server is running
npm run dev

# Verify changes in browser
# Check for visual regressions
# Test affected functionality
```

Use browser_subagent to verify UI changes if applicable.

## 5. Commit and Push

```bash
# Stage all changes
git add -A

# Amend the previous commit (if appropriate) or create new commit
git commit --amend --no-edit
# OR
git commit -m "fix: address PR review comments"

# Force push with lease (safer than --force)
git push --force-with-lease
```

## 6. Verify PR Status

```bash
# Check that conflicts are resolved
gh pr view <PR_NUMBER> --json mergeable,mergeStateStatus

# Optionally add a comment summarizing changes
gh pr comment <PR_NUMBER> --body "✅ Addressed review comments:
- Fixed X
- Improved Y
- Resolved conflicts with main"
```

## Notes

- Always use `--force-with-lease` instead of `--force` to avoid overwriting others' work
- Keep commits clean - use `--amend` for small fixes to avoid cluttering history
- Test thoroughly before pushing
- Communicate with reviewers about significant changes
