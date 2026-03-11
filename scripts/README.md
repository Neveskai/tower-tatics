# Scripts

## Seed tower catalog (Firestore)

Populates the `catalog_towers` Firestore collection so the app can load tower config from Firestore.

**Run:**

```bash
yarn seed:catalog
```

**Requirements:**

- Node with `tsx` (installed via project devDependencies).
- Firebase project: set one of `GOOGLE_CLOUD_PROJECT`, `GCLOUD_PROJECT`, or `FIREBASE_PROJECT_ID` to your project ID.
- Credentials:
  - **Option A:** Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of a service account key JSON file.
  - **Option B:** Use Application Default Credentials (e.g. `gcloud auth application-default login`).

After running, the app will read tower config from Firestore. If the collection is empty, the app will throw instead of using a fallback.
