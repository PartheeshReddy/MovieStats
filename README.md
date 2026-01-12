# MovieStats

MovieStats is a small web application that shows movie information and statistics using TMDb and OMDb APIs.

Note: The actual application source is located in the `SE_Project/` directory. This repository currently places the project files inside that folder. You can either keep the project nested there, or move the files to the repository root.

Quick start

1. Clone the repo:
   ```bash
   git clone https://github.com/PartheeshReddy/MovieStats.git
   cd MovieStats
   ```

2. Install dependencies (from inside SE_Project):
   ```bash
   cd SE_Project
   npm install
   npm start
   ```

Configuration and secrets

- The file `SE_Project/config.js` currently contains API keys. Those keys are exposed in the repository and should be considered compromised. Rotate any exposed API keys immediately.
- Instead of committing keys to the repo, create a `SE_Project/config.local.js` (gitignored) from the provided `SE_Project/config.example.js` and put your real keys there.

Removing large/binary files and secrets from history

- To remove the binary `SE_Project/movie stats (1).docx` from the repository and stop tracking it:
  ```bash
  git rm --cached "SE_Project/movie stats (1).docx"
  echo "*.docx" >> .gitignore
  git add .gitignore
  git commit -m "Remove binary docx and ignore .docx files"
  git push
  ```

- If you need to remove the file (and any secrets) from the repository history, use the BFG Repo-Cleaner or `git filter-repo`. Example with BFG:
  ```bash
  # install bfg and then
  bfg --delete-files "*.docx" --delete-files "SE_Project/config.js"
  git reflog expire --expire=now --all && git gc --prune=now --aggressive
  git push --force
  ```

- After removing secrets from history, rotate any keys that were committed.

Next recommended steps

- Move project files to repo root if you prefer conventional layout (or update the root README to document the nested structure).
- Create CI (GitHub Actions) to run tests and linters.
- Add a LICENSE and CONTRIBUTING.md if you plan to accept contributions.

If you want, I can: 1) generate a branch and move files to root, 2) open a PR with the file moves, 3) or help remove secrets from history (I will need confirmation before rewriting repo history).
