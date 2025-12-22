import { ProjectDetailPage } from "@/features/project/project-detail-page";

export default function Page({ params }: { params: { id: string } }) {
  return <ProjectDetailPage projectId={params.id} />;
}
