"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Headphones,
  Package,
  Play,
} from "lucide-react";
import Link from "next/link";

interface Props {
  testId: string;
  testType: string;
}
export const TestView = ({ testType, testId }: Props) => {
  const trpc = useTRPC();
  const isToeic = testType === "toeic";
  const { data } = useQuery({
    ...trpc.toeic.getOne.queryOptions({ testId }),
    enabled: isToeic,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild>
        <Link href={`/test-practices/${testType}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Test Practices
        </Link>
      </Button>
      {/* Test Overview Card */}
      <Card className="my-8">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Badge
                  className={getDifficultyColor(data?.difficulty ?? "medium")}
                >
                  {data?.difficulty ?? "medium"}
                </Badge>
              </div>
              <CardTitle className="text-3xl">{data?.title}</CardTitle>
              <CardDescription>{data?.description}</CardDescription>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Parts</span>
              <span className="text-2xl mt-1">{data?.parts.length ?? 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="text-2xl mt-1">{data?.totalQuestions ?? 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-2xl mt-1">{data?.duration ?? 0}m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Difficulty</span>
              <span className="text-2xl mt-1 capitalize">
                {data?.difficulty ?? "medium"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button size="lg">
            <Link
              className="w-full md:w-auto flex items-center gap-2"
              href={`/test-practices/${testType}/${testId}/start`}
            >
              <Play className="h-5 w-5" />
              Start Practice Test
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Test Sections */}
      <div className="space-y-4">
        <div>
          <h2 className="mb-4">Test Sections</h2>
        </div>

        {data?.parts?.map((part, index) => (
          <TestSection
            key={part.id}
            index={index + 1}
            name={`Part ${index + 1}`}
            sectionType={part.sectionType}
            description={part.description ?? ""}
            questionCount={part.questionCount}
          />
        ))}
      </div>

      {/* Instructions */}
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Before You Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Make sure you have a stable internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Find a quiet place where you won&apos;t be disturbed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Prepare headphones for the listening section</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Set aside the full duration to complete the test in one sitting
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

interface TestSectionProps {
  index: number;
  name: string;
  description: string;
  questionCount: number;
  sectionType: "listening" | "reading";
}

export const TestSection = ({
  index,
  name,
  description,
  questionCount,
  sectionType,
}: TestSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-primary-foreground">
                {index}
              </div>
              <CardTitle className="text-xl">{name}</CardTitle>
            </div>
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            {sectionType === "listening" ? (
              <Headphones className="h-4 w-4 text-muted-foreground" />
            ) : (
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm capitalize">{sectionType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Questions:</span>{" "}
              {questionCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
