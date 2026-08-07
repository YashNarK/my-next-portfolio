// One-off content script: uploads screenshots captured from each project's live
// demo into Firebase Storage and points the matching Firestore project doc at
// them (`image` = hero shot, `gallery` = the rest).
//
//   node --env-file=.env.local scripts/seed-project-shots.mjs
//
// Re-running is safe: object paths are deterministic, so uploads overwrite and
// `gallery` is replaced rather than appended.

import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const SHOT_DIR =
  "C:/Users/NARENDRAN AI/AppData/Local/Temp/claude-chrome-screenshots-06w2Pr";

// slug -> ordered shots. First entry becomes the hero (`image`) and the card art
// on the projects listing; the rest become the detail-page gallery.
const SHOTS = {
  "agri-ai-agent": [
    [
      "screenshot-1786077738940-0.jpg",
      "Overview — 17 crops, 11 regions, 187 price series, and the four macro drivers the price model consumes as features",
    ],
    [
      "screenshot-1786077738940-1.jpg",
      "Price explorer — 139 monthly observations of price and traded volume for each crop × region pair",
    ],
    [
      "screenshot-1786077786016-2.jpg",
      "Forecasts — the deployed model scored on demand, every run logged with the exact feature row behind it",
    ],
    [
      "screenshot-1786077884056-8.jpg",
      "Hybrid search over the agronomic knowledge base — vector and full-text retrievers fused, scored per hit",
    ],
    [
      "screenshot-1786077814225-5.jpg",
      "LangGraph chat agent — every figure it quotes comes from an inline tool call against the same database the dashboard reads",
    ],
  ],
  "agri-ai-api": [
    [
      "screenshot-1786077911898-9.jpg",
      "REST surface — crop and region catalogs, historical prices, ML predictions with confidence intervals, and hybrid search",
    ],
    [
      "screenshot-1786077911900-10.jpg",
      "The same capabilities exposed as MCP tools over JSON-RPC, so AI clients can call the platform directly",
    ],
  ],
  simpledex: [
    [
      "screenshot-1786078047044-13.jpg",
      "Swap, add liquidity, and redeem LP tokens against the deployed Sepolia contracts",
    ],
    [
      "screenshot-1786078069134-14.jpg",
      "Wallet balances and pool reserves read straight from chain via the Web3 provider",
    ],
  ],
  pymodulegen: [
    [
      "screenshot-1786078114122-17.jpg",
      "Published to PyPI under the MIT license — pip install pymodulegen",
    ],
    [
      "screenshot-1786078114125-18.jpg",
      "Solves parent-package imports by generating __init__.py files and wiring the project root into sys.path",
    ],
  ],
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

const db = getFirestore(app);
const bucket = getStorage(app).bucket();

/** Uploads one JPEG and returns a tokenized download URL matching the format
 *  the client SDK's getDownloadURL() produces, so existing readers work. */
async function upload(localName, objectPath) {
  const token = randomUUID();
  const file = bucket.file(objectPath);
  await file.save(await readFile(`${SHOT_DIR}/${localName}`), {
    resumable: false,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

const snapshot = await db.collection("projects").get();

for (const doc of snapshot.docs) {
  const title = doc.data().title;
  const shots = SHOTS[slugify(title)];
  if (!shots) {
    console.log(`skip  ${title} (no shots captured)`);
    continue;
  }

  const uploaded = [];
  for (const [i, [localName, caption]] of shots.entries()) {
    const url = await upload(localName, `images/${title}/shots/${i}.jpg`);
    uploaded.push({ url, caption });
  }

  // The hero also stays in `gallery` so it keeps its caption; the detail page
  // collapses the duplicate URL back into a single slide.
  await doc.ref.update({ image: uploaded[0].url, gallery: uploaded });
  console.log(`ok    ${title} — ${uploaded.length} shots`);
}

console.log("done");
