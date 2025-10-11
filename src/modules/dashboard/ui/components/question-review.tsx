import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  qnNumber: number;
  qnText?: string | null;
  options?:
    | {
        optionText: string;
        id?: string | null;
      }[]
    | null;
  userAnswer?: number | null;
  correctAnswer?: number | null;
}

export const QuestionReview = ({
  qnNumber,
  qnText,
  options,
  correctAnswer,
  userAnswer,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const isCheck = userAnswer
    ? correctAnswer
      ? userAnswer === correctAnswer
      : false
    : false;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70 transition-opacity cursor-pointer">
            <CardTitle className="flex items-center gap-2">
              {`Question ${qnNumber}`}
              {userAnswer && correctAnswer ? (
                isCheck ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
            </CardTitle>
            {isOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CardContent className="space-y-3">
              {qnText && (
                <div className="mb-3 p-3 bg-muted/50 rounded text-sm">
                  <p className="text-muted-foreground italic">{qnText}</p>
                </div>
              )}

              {options && (
                <div className="space-y-2">
                  {options.map((o, index) => {
                    const isCorrect = index + 1 === correctAnswer;
                    const isAnswer = index + 1 === userAnswer;

                    return (
                      <div
                        key={o.id}
                        className={`p-2 rounded text-sm ${
                          isAnswer && isCorrect
                            ? "bg-green-100 border border-green-300"
                            : isAnswer && !isCorrect
                            ? "bg-red-100 border border-red-300"
                            : isCorrect
                            ? "bg-green-50 border border-green-200"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {o.optionText}
                          {isAnswer && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs"
                            >
                              Your answer
                            </Badge>
                          )}
                          {isCorrect && !isAnswer && (
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs border-green-600 text-green-600"
                            >
                              Correct
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
