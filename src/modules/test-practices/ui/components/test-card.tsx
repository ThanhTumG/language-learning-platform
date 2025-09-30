import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  totalQuestions: number;
  type: "toeic" | "ielts";
  difficulty: "hard" | "medium" | "easy";
}

export const TestCard = ({
  id,
  name,
  description,
  totalTime,
  type,
  difficulty,
  totalQuestions,
}: Props) => {
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

  const router = useRouter();

  const handleClickCard = () => {
    router.push(`/test-practices/${type}/${id}`);
  };

  return (
    <Card
      onClick={handleClickCard}
      className="hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>{totalQuestions} questions</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{totalTime} minutes total</span>
          </div>

          <Button className="w-full mt-4">
            View Details
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TestCardSkeleton = () => {
  return (
    <Card className="bg-neutral-100 animate-pulse w-full h-[182px]"></Card>
  );
};
