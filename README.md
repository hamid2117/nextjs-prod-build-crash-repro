# Next.js Deployed Issue Reproduction

This repository demonstrates a reproduction case for the Next.js deployment issue where users on an old build experience runtime errors when a new production build is deployed.

## Issue Description

When a new production build is deployed while users are still on an old build, they may experience the following error when interacting with the site:

```
TypeError: Cannot read properties of undefined (reading 'call')
```

## How to Reproduce

1. Deploy this app to Vercel (Pro plan)
2. Open the deployed site in a browser (Build A)
3. Deploy a new production version (Build B) via GitHub → Vercel CI/CD
4. While still on Build A, interact with the site (click the increment button or wait for the counter to update)
5. Observe the runtime error

## Technical Details

- Next.js: 14.2.24
- React: 18.2.0
- TypeScript: 5.4.2

The reproduction case includes:

1. A counter component with client-side state and effects
2. A browser API component that demonstrates proper SSR handling:
   - Uses `typeof window !== 'undefined'` checks
   - Implements an `isClient` state to handle SSR/client transitions
   - Accesses browser APIs (window, localStorage) safely
   - Shows how browser API usage might be related to the deployment issue

## Expected Behavior

The app should either:

- Auto-refresh to fetch the correct assets, or
- Handle the version mismatch gracefully without crashing

## Current Behavior

The app crashes on the first interaction after a new production build is deployed, while users are still on the old version.

## Notes

- This issue only occurs in production, not in preview or local environments
- The error disappears after a hard reload or when assets are properly synced
- No service workers or custom caching logic is in place
- Using default caching and headers in `next.config.js`
- The browser API component demonstrates proper SSR handling, not sure by handling that error while reproduce again or not.
