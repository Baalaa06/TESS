# Deploying the exported web build

You have already exported the app static output to `dist` (run `npx expo export`). Use one of the options below to deploy.

Vercel (from repo)
1. Push your repo to GitHub/GitLab/Bitbucket.
2. Go to https://vercel.com/new and import the repo.
3. Set the **Build Command** to: `npx expo export`
4. Set the **Output Directory** to: `dist`
5. Add any environment variables (Firebase config) under Project Settings.

Vercel (from local folder)
```bash
npm i -g vercel
vercel login
vercel --prod dist
```

Netlify (from repo)
1. Push the repo.
2. In Netlify, select "New site from Git" and choose the repo.
3. Set **Build command**: `npx expo export`
4. Set **Publish directory**: `dist`
5. Add environment variables in Site settings.

Netlify (local folder)
```bash
npm i -g netlify-cli
netlify login
netlify deploy --dir=dist --prod
```

Important notes
- Firebase: add your production domain to Firebase Console → Authentication → Authorized domains.
- Environment variables: add Firebase config values in the host's environment settings before building (FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.).
- If routes display 404s, the SPA redirect is configured in `netlify.toml` and `vercel.json` above.

Troubleshooting
- If the host uses a build step, ensure `npx expo export` runs successfully on the host (same Node version and project deps).
- If `expo export` fails on the host, try running it locally and deploy the produced `dist` directory directly.
