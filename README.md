# Tidal Quay: Landing page · Render

A one-page landing site on **Render** (a static site), with pull request previews **public**.
Static Vite + TypeScript, no framework. The page reads a live list from the shared Supabase test
project. Row in the support matrix: REN-1098 (Linear, project Onboarding evals).

## Deployment links

| Production | Preview gate |
|---|---|
| https://tidal-quay-h3t8.onrender.com (Render static site `srv-dbd1foavcj2c739bs5kg`) | no |

## Names

Every prepared repository gets a random name of its own, never reused, for example
`amber-falcon-7k2q`. In a monorepo, each of the three apps also gets a random name (folder, package
name and page title). App names must not repeat across repositories: when `todo-monorepo-2` reused
`todo-monorepo`'s app names, the dashboard opened the old repository's apps.

## Prepare it for an eval

Render's GitHub app must see every repository in `pristine-test-org` (check:
`gh api orgs/pristine-test-org/installations --jq '.installations[].app_slug'` lists `render`),
or Render can't build the repository or its pull requests.

1. Copy (don't move) this folder to `tmp/eval-repos/<name>/`, `<name>` being the new random name.
2. Replace `template-landing` (package name) and `Template Landing` (page title) everywhere. Run `npm install` so `package-lock.json` has the new name.
3. `npm run build` passes, then `git init -b main`, commit, and push to a new repository
   `pristine-test-org/<name>` (`gh repo create`; push with the token on the URL). Then add a plain `origin`,
   `git remote add origin https://github.com/pristine-test-org/<name>.git`, with no token in it: the
   command quits without one.
4. Create a Git-connected static site named `<name>` in the workspace **My Workspace**
   (`render workspace set tea-dbcte37b9u1s73crd0r0` once):
   `render services create --type static_site --name <name> --repo https://github.com/pristine-test-org/<name> --branch main --build-command "npm ci && npm run build" --publish-directory dist --previews automatic --confirm --output json`.
   `--previews automatic` gives every pull request its own preview site; without it a PR gets none.
5. Creating the site starts its first deploy from `main`. Wait for it with
   `render deploys list <service-id> --output json` until the newest is `live`.
6. Prove it builds on push: push a commit to `main` and check a new deploy starts on its own.
7. The production URL is the service's `serviceDetails.url` (`https://<name>.onrender.com`, or with
   a suffix when the name is taken). It answers 200 and the "Live from the shared list" strip shows rows.
8. Write the production URL into **Deployment links** above, delete the template
   notice at the top, and push that to `main`.

A pull request's preview is its own static site, `https://<name>-pr-<n>.onrender.com`, public like
production. Render reports it on GitHub only as a deployment: environment `<branch> - <name> PR #<n>`, created as the account that installed Render's GitHub app (abdulwahabone), status `success` with that URL. No comment, check run or commit status (seen 2026-10-22). The preview site is removed when the PR closes.

## Supabase

Every page reads the latest five rows of the `todos` table in the shared test project
(`https://hszqtfynyogshhltamep.supabase.co`), the same one the todo monorepos use. The URL and publishable key are
defaults in `src/supabase.ts`, so a host needs no environment variables.

**When a new deployment or preview URL comes up**, check Supabase lets it in:

- **Data (CORS):** nothing to add. Supabase's Data API answers any origin; on 2026-10-19 a
  request from a made-up preview origin came back allowed. Open the deployment and check the
  "Live from the shared list" strip shows rows, not "Couldn't reach the list".
- **Auth URLs:** the only per-URL setting Supabase has is Auth → URL Configuration (Site URL and
  Redirect URLs). It matters only for an app that signs people in through Supabase Auth with a
  redirect. These pages don't, so skip it. If an app ever does, add its preview URL pattern to
  Redirect URLs with the Supabase CLI (`supabase link --project-ref hszqtfynyogshhltamep`, then
  `supabase config push`). Careful: `config push` writes the shared project's whole auth config.

## Run the eval

A repo eval, not `npm run eval`: the steps are in `REPO-EVAL.md` beside the templates. In short:
open the repo's app on impeccable.reviews, wait for the scan (Rescan if apps are missing), click
Setup, run the command it gives in `tmp/eval-repos/<name>/`, and wait for Impeccable's review on
the test PR.
