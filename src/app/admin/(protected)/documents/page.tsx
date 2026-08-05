import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type VerificationSummary = {
  reference_code: string;
  status: string;
};

export default async function DocumentsListPage() {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("translation_documents")
    .select(
      "id, title, client_public_name, category, created_at, verification_records(reference_code, status)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load documents:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Documents</h1>
        <Link
          href="/admin/documents/new"
          className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
        >
          New document
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Reference code</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {documents?.map((doc) => {
              const verification = (
                Array.isArray(doc.verification_records)
                  ? doc.verification_records[0]
                  : doc.verification_records
              ) as VerificationSummary | null;

              return (
                <tr key={doc.id} className="border-t border-neutral-800">
                  <td className="px-4 py-2">{doc.title}</td>
                  <td className="px-4 py-2">{doc.client_public_name}</td>
                  <td className="px-4 py-2">{doc.category}</td>
                  <td className="px-4 py-2 font-mono">
                    {verification?.reference_code ?? "—"}
                  </td>
                  <td className="px-4 py-2">{verification?.status ?? "—"}</td>
                  <td className="px-4 py-2 text-neutral-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}

            {documents?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  No documents yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
