// One-off content script: adds the "Perform Predictive Data Analysis in BigQuery"
// Google Cloud skill badge to the `credentials` collection, mirroring the shape
// of the existing Credly-issued badges.
//
//   node --env-file=.env.local scripts/add-bigquery-credential.mjs
//
// Re-running is safe: the doc is matched by `credentialID`, so a second run
// updates in place instead of creating a duplicate, and the Storage object path
// is deterministic so the upload overwrites.

import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Field values come from Credly's Open Badges API for this assertion:
// https://www.credly.com/api/v1/obi/v2/badge_assertions/ced5247d-6182-4b85-967d-b8b959cfd73f
const CREDENTIAL = {
  title: "Perform Predictive Data Analysis in BigQuery Skill Badge",
  description:
    "Skill Badge (Intermediate). Demonstrates skills in creating BigQuery " +
    "datasets by importing CSV and JSON source files, applying sophisticated " +
    "SQL analytical concepts over event-level data, and using BigQuery ML to " +
    "train and evaluate an expected-goals prediction model — covering the full " +
    "path from raw ingestion to a predictive model served inside the warehouse.",
  link: "https://www.credly.com/badges/ced5247d-6182-4b85-967d-b8b959cfd73f",
  issuedDate: "2026-08-17T07:55:22.000Z",
  issuedBy: "Google Cloud",
  credentialID: "ced5247d-6182-4b85-967d-b8b959cfd73f",
  order: 2,
};

const BADGE_IMAGE =
  "https://images.credly.com/images/d41246ef-1f8e-4b3a-b93d-034e7c66e309/image.png";

// Azure Fundamentals currently holds order 2; it moves down to make room.
const DEMOTE = {
  title: "Microsoft Certified: Azure Fundamentals",
  order: 3,
};

// The GKE badge was stored under a shortened name; align it with the official
// Credly badge class title. Matched by credentialID so the lookup survives the
// rename on a re-run. The `image` URL is absolute, so the Storage object path
// (which embeds the old title) keeps resolving and is left as-is.
const RENAME = {
  credentialID: "6629b2bb-3061-4dfa-81a5-0f14db69d9b0",
  title: "Deploy Kubernetes Applications on Google Cloud Skill Badge",
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

/** Mirrors the object path and tokenized URL format the admin UI produces, so
 *  the credentials page reads this image exactly like every other one. */
async function uploadBadgeImage() {
  const res = await fetch(BADGE_IMAGE);
  if (!res.ok) throw new Error(`badge image fetch failed: ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());

  const objectPath = `images/credentials/${CREDENTIAL.title}/cred-image`;
  const token = randomUUID();
  await bucket.file(objectPath).save(body, {
    resumable: false,
    metadata: {
      contentType: "image/png",
      cacheControl: "public, max-age=31536000",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

const image = await uploadBadgeImage();
console.log(`image  uploaded -> ${image.slice(0, 90)}...`);

const existing = await db
  .collection("credentials")
  .where("credentialID", "==", CREDENTIAL.credentialID)
  .get();

if (existing.empty) {
  const ref = await db.collection("credentials").add({ ...CREDENTIAL, image });
  console.log(`cred   added ${ref.id} — ${CREDENTIAL.title}`);
} else {
  await existing.docs[0].ref.update({ ...CREDENTIAL, image });
  console.log(`cred   updated ${existing.docs[0].id} — ${CREDENTIAL.title}`);
}

const demote = await db
  .collection("credentials")
  .where("title", "==", DEMOTE.title)
  .get();

if (demote.empty) {
  console.log(`warn   "${DEMOTE.title}" not found; order left untouched`);
} else {
  await demote.docs[0].ref.update({ order: DEMOTE.order });
  console.log(`order  ${DEMOTE.title} -> ${DEMOTE.order}`);
}

const rename = await db
  .collection("credentials")
  .where("credentialID", "==", RENAME.credentialID)
  .get();

if (rename.empty) {
  console.log(`warn   ${RENAME.credentialID} not found; title left untouched`);
} else {
  await rename.docs[0].ref.update({ title: RENAME.title });
  console.log(`title  -> ${RENAME.title}`);
}

console.log("done");
