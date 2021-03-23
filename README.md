# Mania Beginner's Showdown 3

Built with [Svelte](svelte.dev/) on the frontend and leverages [Directus](directus.io/) for the backend.

# Installation and setup

Install dependencies with `yarn install` (npm should also work though your mileage may vary because this uses a `yarn.lock`).

## Directus

In order to support osu! OAuth on Directus, I tried [forking directus](https://github.com/Paturages/directus/tree/pat/osu-oauth-workaround)
but didn't get a workable package that way unfortunately, so there's an atrocious hotfix that patches `node_modules/directus`
endpoints directly in `atrocities`. You shouldn't need to run the patch as it's in the `postinstall` hook, but still fyi.

`cp .env.example .env` and configure it, namely the postgres database and the [osu! v2 OAuth credentials](https://osu.ppy.sh/home/account/edit#oauth).
For the OAuth redirect, use something like `http://localhost:8055/auth/oauth/osu/callback` (you can probably figure out what `http://localhost:8055` should be
if it's different for you). You can launch the thing with `yarn directus` (or `npm run directus`) after that's done.

## Frontend

Keep in mind you'll need to run Directus before launching the backend to actually fetch things.
`yarn dev` starts the frontend dev environment. `yarn build` builds the frontend package into `public/build`.
