import { TestStartView } from "@/modules/test-practices/ui/views/test-start-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    test: string;
    testId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { test, testId } = await params;

  const { user } = await caller.auth.session();
  if (!user) {
    redirect("/sign-in");
  }

  return <TestStartView testType={test} testId={testId} />;
}
