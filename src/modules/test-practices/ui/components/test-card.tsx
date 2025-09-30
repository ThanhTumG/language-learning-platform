import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Play } from "lucide-react";

interface Props {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  type: "toeic" | "ielts";
}

export const TestCard = ({ id, name, description, totalTime, type }: Props) => {
  const handleStart = () => {
    console.log(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="text-lg mb-2">
              <Clock className="mr-1 h-4 w-4" />
              {totalTime} minutes total
            </Badge>
            <p className="text-gray-600">
              {type === "toeic"
                ? "Listening → Reading"
                : "Listening → Reading → Writing → Speaking"}
            </p>
          </div>
          <Button onClick={handleStart} size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start Full Test
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
