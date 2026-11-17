# Copy this project's code into Autism-Game-Project

You do these steps yourself. I can't connect repositories or push code from the chat.

## 1. Create the new repository from Lovable
- Desktop: Project settings -> Git -> Connect GitHub. On mobile: Chat mode -> Plus (+) -> Project -> GitHub.
- Choose the TZ-StreamPower account. Lovable creates a new private repository and keeps it in sync with this project.

## 2. Push that code into Autism-Game-Project (on your computer)
```text
git clone <new-lovable-repo-url> lovable-app
cd lovable-app
git remote add target https://github.com/TZ-StreamPower/Autism-Game-Project.git
git push target main:lovable-app
```
- Pushing to a new branch (`lovable-app`) leaves what's already in Autism-Game-Project untouched. You can merge it on GitHub afterwards.
- Do not force-push to `main` unless you want to replace that repository's history.

## 3. Updating later
- Changes made in Lovable only go to the new repository. Repeat `git pull` and then `git push target main:lovable-app` whenever you want Autism-Game-Project to catch up.
- Edits made in Autism-Game-Project never reach Lovable.

## Notes
- The game files in `public/game/` are about 49 MB, which is under GitHub's 100 MB limit per file.
- No app code changes are needed.
