# Sarira Infotech — Healthcare Client Requirement Form

React/Vite client project discovery questionnaire for clinics and multi-doctor healthcare consultation portals. **11 sections and 84 questions**, review screen, local JSON draft, Vercel serverless submission API with a private Blob store, and admin-only Excel export.

## Development

Node.js 20+:

```bash
npm install
npm run dev
```

The form renders locally, but **submitting requires the deployed API and a linked private Blob store**.

## Deployment on Vercel

1. Import `aakash1947/healthcare-client-intake` into Vercel (root directory `.`, framework Vite, build command `npm run build`, output `dist`).
2. In Storage, create a **private Vercel Blob store** and connect it to this project so `BLOB_READ_WRITE_TOKEN` is supplied. Never create a public store for these submissions.
3. In Project Settings → Environment Variables, configure `INTAKE_ADMIN_KEY` to a long secret (32+ random bytes) for Production. Never expose it with a `VITE_` prefix.
4. Redeploy after connecting storage and setting the secret.
5. Test a non-sensitive fictional record through the form. Check that the submitted reference appears and private storage receives the object.
6. To download all client submissions as Excel, make an authenticated GET request to `/api/export` with `Authorization: Bearer YOUR_INTAKE_ADMIN_KEY`. **Do not enter this secret in a public browser URL or distribute it to clients.**
7. Confirm data retention, privacy notice, authorized staff access, deletion process, monitoring, backups, and bot protection before opening intake to real client data.

The backend will deliberately return **503** until a private Blob store is configured. Never treat a website that loads as proof that submissions are safely stored.

## Privacy and limitations

This is a **clinic business-project requirements form**, **not a patient medical form**. Do not submit patient records, medical histories, Aadhaar, doctor identity documents, passwords, payment credentials or sensitive clinical information. Doctor credentials are requested only as textual planning information here; confidential supporting documents require a separate approved secure transfer.

Administrative Excel export is protected with a secret bearer key. A high-volume production system should replace this simple export method with an authenticated admin application and database, plus audit logs, CAPTCHA/bot defenses, deletion and retention workflows, and a legal/privacy review. Environment variables, repository and deployment settings must not expose private client records.
