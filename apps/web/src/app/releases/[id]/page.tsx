import { ReleaseDetailPage } from "@/features/release/release-detail-page";

export default function Page({ params }: { params: { id: string } }) {
  return <ReleaseDetailPage releaseId={params.id} />;
}
