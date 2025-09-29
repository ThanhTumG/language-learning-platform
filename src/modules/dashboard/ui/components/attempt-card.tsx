import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";

interface Props {
  name: string;
  date: string;
  score: number;
  type: "toeic" | "ielts";
}

export const AttemptCard = ({ name, date, score, type }: Props) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="h-5 w-5" />
            {date}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge variant="secondary" className="text-lg font-semibold">
          {score}
        </Badge>
        <p className="text-xs text-gray-500 mt-1">
          {type === "ielts" ? "Overall Band" : "Total Score"}
        </p>
      </div>
    </div>
  );
};

export const AttemptCardSkeleton = () => {
  return (
    <div className="w-full h-[88px] bg-neutral-100 border rounded-lg animate-pulse"></div>
  );
};
