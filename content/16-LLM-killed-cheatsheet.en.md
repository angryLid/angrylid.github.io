---
title: LLM Killed Cheatsheet
slug: 16-LLM-killed-cheatsheet.en.md
created-time: 2026-01-29
---

# LLM Killed Cheatsheet

Every time I didn't know what to do with Git, I had to search Google for solutions. It was annoying because I couldn't quickly find the answer that exactly matched my needs. Therefore, I maintained a few cheatsheets before LLMs became prevalent. I don't need them anymore, but I'd like to summarize them here, as they're a part of my memory.

## Git

### Git Workflow & Areas Management

```bash
# ===== Workspace, Staging Area, and Commit Management =====

# Interactive rebase to squash commits and modify commit messages
git rebase -i HEAD~12

# Merge development branch and squash all commits into one
git merge --squash dev
git commit

# Undo 12 commits but keep changes in the staging area (soft reset)
git reset --soft HEAD~12

# Remove all files from the staging area (unstage)
git restore --staged .

# Sync staging area with the last commit (equivalent to the above)
git reset 

# Remove all untracked files and directories from the workspace
git clean -df

# Remove files or directories from git tracking without deleting them locally
git rm --cached [-r] [filename]

# Update the author of the last commit to the current user
git commit --amend --reset-author --no-edit

# Roll back to a specific point using history logs
git reflog
git reset --hard "HEAD@{1}"
```

### Remote Synchronization

```bash
# ===== Remote Sync =====

# Initialize git and pull from remote into an existing non-empty folder
git init
git remote add origin https://github.com/Wachira11ke/Delftscopetech.git
git pull origin main --allow-unrelated-histories

# Clone a specific branch
git clone -b feat <remote_url>

# Delete a remote branch
git push -d origin <branch-name>

# Create a local branch tracking a remote branch that doesn't exist locally yet
git switch -c feat-1 origin/feat-1
```

### Configuration

```bash
# ===== Configuration =====

# Set VS Code as the default git editor
git config --global core.editor "code --wait"

# Enable or disable GPG signing for commits
git config commit.gpgsign [true/false]

# Disable automatic line ending conversion (LF/CRLF) on Windows
git config --global core.autocrlf false

# Automatically push relevant tags when pushing branches
git config --global push.followTags true

# Assign a global .gitignore file path
git config --global core.excludesfile "%USERPROFILE%\.gitignore"

# .gitconfig setup for conditional includes
# Located under the user home folder
[includeIf "gitdir:~/projects/work/"]
    path = ~/projects/work/.gitconfig
    
# Specific configuration under the workspace folder
[user]
    name = Your Work Name
    email = your.work.email@example.com
```

## Proxy
### Go 

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```

### PowerShell
```powershell
# Set HTTP proxy
$env:http_proxy = "http://127.0.0.1:7890"

# Set HTTPS proxy
$env:https_proxy = "http://127.0.0.1:7890"
```

### CMD
```batch
set http_proxy=http://127.0.0.1:7890
set https_proxy=http://127.0.0.1:7890
```

## MySQL

```sql
/* Rename a column */
ALTER TABLE <table_name> RENAME COLUMN <old_column_name> TO <new_column_name>;

/* Remove or drop a column */
ALTER TABLE <table_name> DROP COLUMN <column_name>;

/* Add a UNIQUE constraint to columns */
ALTER TABLE <table_name> ADD CONSTRAINT <constraint_name> UNIQUE (column1, column2, ... column_n);
ALTER TABLE <table_name> ADD UNIQUE (column_name);

/* Drop a table */
DROP TABLE <table_name>;

/* Example: Create a new table */
CREATE TABLE table1_seq
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
);
```

## Vim

| Action Description | VIM Command |
| :--- | :--- |
| **Save with sudo**: Write the current file using root privileges (useful when you forget to open with sudo). | `:w !sudo tee %` |
| **Delete line**: Deletes the entire current line where the cursor is positioned. | `dd` |
| **Go to end of file**: Moves the cursor to the very last line of the document. | `G` |
| **Go to end of line**: Moves the cursor to the last character of the current line. | `$` |
| **Append at end of line**: Moves the cursor to the end of the line and switches to Insert mode. | `A` |
| **Append after cursor**: Starts Insert mode immediately after the current cursor position. | `a` |

## RegExp

```javascript

const natureNumber = /^(?:0|[1-9][0-9]{0,8})$/

number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

```
