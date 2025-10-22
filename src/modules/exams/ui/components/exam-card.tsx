import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getTimeRemaining } from "@/lib/utils";
import { Calendar, Clock, Flame, Target, Users } from "lucide-react";
import Link from "next/link";

interface Props {
  status: "active" | "upcoming" | "ended";
  id: string | number;
  title: string;
  description: string;
  testTitle: string;
  testDuration: number;
  startTime: string;
  endTime: string;
  numOfParticipants: number;
  testType: "toeic" | "ielts";
}

export const ExamCard = ({
  id,
  status,
  title,
  description,
  testTitle,
  testDuration,
  startTime,
  endTime,
  numOfParticipants,
  testType,
}: Props) => {
  const isActive = status === "active";
  const isEnded = status === "ended";
  return (
    <Card
      className={`${
        isActive ? "border-gray-100 shadow-lg" : ""
      } transition-all hover:shadow-md`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="gap-2">
              <div className="flex items-center gap-2">
                {title}
                {isActive && (
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {testType}
              </p>
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
          <Badge
            variant={isActive ? "default" : isEnded ? "secondary" : "outline"}
            className={
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exam Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Test</p>
              <p className="text-sm">{testTitle.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm">{testDuration} minutes</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Starts:</span>
            <span>{formatDate(startTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Ends:</span>
            <span>{formatDate(endTime)}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {numOfParticipants} participants
            </span>
          </div>
          {isActive && (
            <span className="text-sm text-orange-500">
              {getTimeRemaining(endTime)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button className="w-full" disabled={!isActive} asChild>
          <Link href={`/exams/${id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
