import { TestStartView } from "@/modules/test-practices/ui/views/test-start-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    examId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { examId } = await params;

  const { user } = await caller.auth.session();
  if (!user) {
    redirect("/sign-in");
  }

  const { id } = await caller.exams.getOne({ examId });

  return <TestStartView testId={id.toString()} />;
}
