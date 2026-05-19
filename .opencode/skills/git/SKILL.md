---
name: git
description: |
  Comprehensive Git and GitHub operations including authentication (PAT/SSH),
  branching strategies, pull requests, issues, CI/CD with GitHub Actions,
  release/tag management, and security best practices.
  Use when the user asks to push, pull, clone, create branches, make PRs,
  manage issues, set up CI, tag releases, or any other Git/GitHub operation.
  Use ONLY for Git/GitHub operations, not for general file management.
---

# Git and GitHub Workflows

## Authentication

### HTTPS with Personal Access Token (PAT)
```bash
# Set remote URL (clean, without token)
git remote set-url origin https://github.com/<user>/<repo>.git

# Push — git will prompt for credentials
# Username: your GitHub username
# Password: the PAT (not your GitHub password!)
git push -u origin <branch>

# To avoid embedding the token in command history:
# Set remote URL with token temporarily, push, then restore
git remote set-url origin https://<user>:<PAT>@github.com/<user>/<repo>.git
git push -u origin <branch>
git remote set-url origin https://github.com/<user>/<repo>.git
```

### SSH
```bash
# Generate key (if needed)
ssh-keygen -t ed25519 -C "your@email.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub: Settings → SSH and GPG keys → New SSH key
# Then switch remote
git remote set-url origin git@github.com:<user>/<repo>.git
git push -u origin <branch>
```

## Repository Setup

### New repository
```bash
git init
git add -A
git commit -m "initial commit"
git branch -M main
git remote add origin <url>
git push -u origin main
```

### Clone existing
```bash
git clone <url>
cd <repo>
git remote -v          # verify remotes
```

### Remote management
```bash
git remote add <name> <url>
git remote set-url <name> <url>
git remote remove <name>
git remote -v          # list all remotes
```

## Daily Workflow

### Before starting work
```bash
git pull                # or git pull origin <branch>
git status              # check state
```

### Staging and committing
```bash
git add <file>          # stage specific file
git add -A              # stage all changes
git add -p              # interactive staging
git reset HEAD <file>   # unstage

# Follow conventional commits (use git-commit skill)
git commit -m "feat(scope): description"
git commit -m "fix(scope): description"
```

### Publishing
```bash
git push                # push current branch
git push -u origin <branch>  # first push with upstream
git push --tags         # push tags
```

### Pulling and updating
```bash
git pull                # fetch + merge
git pull --rebase       # fetch + rebase (cleaner history)
git fetch               # fetch without merging
```

## Branch Management

### Create and switch
```bash
git branch <name>                 # create branch
git checkout -b <name>            # create and switch
git switch -c <name>              # create and switch (modern)
```

### List and delete
```bash
git branch                        # local branches
git branch -r                     # remote branches
git branch -a                     # all branches
git branch -d <name>              # delete (safe, checks merge)
git branch -D <name>              # force delete
git push origin --delete <name>   # delete remote branch
```

### Merge and rebase
```bash
git checkout main && git pull     # update target
git checkout feature              # switch to feature
git merge main                    # merge main into feature (resolve conflicts)

git rebase main                   # rebase feature on main (cleaner)
# After rebase, force push (only if working alone on the branch!)
git push --force-with-lease
```

## Pull Requests (GitHub)

### Creating a PR
```bash
# Push the feature branch first
git push -u origin feature-branch

# Create PR via gh CLI
gh pr create --title "Title" --body "Description" --base main
```

### Review and merge PR
```bash
gh pr list                  # list open PRs
gh pr view <number>         # view PR details
gh pr checkout <number>     # checkout PR locally
gh pr merge <number>        # merge PR
```

### PR best practices
- Keep PRs small and focused on a single concern
- Write descriptive title and body explaining what and why
- Reference issues: `Closes #123`
- Ensure CI passes before requesting review
- Rebase on main before merging to keep history clean

## Issues (GitHub)

```bash
gh issue list                  # list open issues
gh issue create --title "..." --body "..."
gh issue view <number>
gh issue close <number>
gh issue reopen <number>
```

## Tags and Releases

```bash
git tag <version>              # lightweight tag
git tag -a <version> -m "..."  # annotated tag
git tag                        # list tags
git push origin <version>      # push specific tag
git push --tags                # push all tags

# Delete tag
git tag -d <version>
git push origin --delete <version>

# Create GitHub Release (requires gh CLI)
gh release create <version> --title "v<version>" --notes "Release notes"
```

## GitHub Actions / CI

### Common workflows
```bash
# Check Actions status
gh run list
gh run view <run-id>
gh run watch <run-id>        # watch in real-time
```

### CI best practices
- Cache dependencies between runs
- Run lint, typecheck, and tests
- Use matrix builds for multiple Node/Python versions
- Fail fast on errors
- Use secrets for tokens and keys

## Stash

```bash
git stash                    # save working directory changes
git stash save "message"     # with descriptive message
git stash list               # list stashes
git stash pop                # apply and remove latest stash
git stash apply              # apply without removing
git stash drop               # remove latest stash
git stash clear              # remove all stashes
```

## Cherry-pick and Revert

```bash
git cherry-pick <commit>     # apply specific commit to current branch

git revert <commit>          # undo a commit with a new commit (safe for shared branches)
git reset --soft <commit>    # undo commits but keep changes staged
git reset --hard <commit>    # undo commits and discard changes (DESTRUCTIVE)
```

## Security Best Practices

- **Never commit secrets**: .env, credentials.json, private keys, .npmrc with tokens
- **Never push to main/master** without PR review
- **Never force push to shared branches**
- Use `--force-with-lease` instead of `--force` (safer — refuses if remote has new commits)
- Keep PATs out of command history; use credential helpers when possible
- For `.gitignore`: add `node_modules/`, `.env`, `dist/`, `build/`, `*.log`, `.DS_Store`
- Use `git secrets` or `git hooks` to prevent accidental secret commits
- Verify diff before committing: `git diff --staged`

## Troubleshooting

### Push rejected
```bash
git pull --rebase            # incorporate remote changes first
git push                     # try again
```

### Merge conflicts
```bash
# Resolve manually, then:
git add <resolved-files>
git commit                   # or git rebase --continue
```

### Undo last commit (local only, not pushed)
```bash
git reset --soft HEAD~1      # undo commit, keep changes staged
git reset HEAD~1             # undo commit, unstage changes
git reset --hard HEAD~1      # undo commit and discard changes
```

### Authentication issues
```bash
# Check remote URL
git remote -v

# Update if wrong
git remote set-url origin <correct-url>

# Check stored credentials (Windows)
cmdkey /list                 # list stored credentials
cmdkey /delete:git:https://github.com   # clear GitHub credentials
```
