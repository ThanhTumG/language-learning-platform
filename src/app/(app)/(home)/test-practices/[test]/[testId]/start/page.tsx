import { TestStartView } from "@/modules/test-practices/ui/views/test-start-view";

interface Props {
  params: Promise<{
    test: string;
    testId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { test, testId } = await params;

  return <TestStartView testType={test} testId={testId} />;
}
