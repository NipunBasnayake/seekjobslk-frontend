import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";
import { firebaseServerDb } from "@/lib/firebaseServer";

interface ApplyRouteContext {
  params: Promise<{
    id: string;
  }>;
}

const JOB_ID_PATTERN = /^[a-zA-Z0-9_-]{6,120}$/;

export async function POST(_: Request, context: ApplyRouteContext) {
  const { id } = await context.params;

  if (!JOB_ID_PATTERN.test(id)) {
    return NextResponse.json({ ok: false, error: "Invalid job id" }, { status: 400 });
  }

  const adminDb = getFirebaseAdminDb();

  try {
    if (adminDb) {
      await adminDb
        .collection("jobs")
        .doc(id)
        .set(
          {
            applied_count: FieldValue.increment(1),
            updated_at: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (firebaseServerDb) {
      const jobRef = doc(firebaseServerDb, "jobs", id);
      await updateDoc(jobRef, {
        applied_count: increment(1),
        updated_at: serverTimestamp(),
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return NextResponse.json({ ok: false, error: "Firestore unavailable" }, { status: 503 });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to track apply action" }, { status: 500 });
  }
}
