import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToeicAttemptsQuestionItemOutput } from "@/modules/toeic-attempts/type";

interface Props {
  questionItem: ToeicAttemptsQuestionItemOutput;
  updateAnswer: (questionId: number, answer: number) => void;
  answers: {
    [key: number]: number;
  };
}

export const QuestionItemCard = ({
  questionItem,
  updateAnswer,
  answers,
}: Props) => {
  return (
    <Card>
      <CardContent className="space-y-6">
        {questionItem.questionContent && (
          <div className="max-w-[600px]">
            <RichText data={questionItem.questionContent} />
          </div>
        )}
        <div className="space-y-6">
          {questionItem.questions?.map((question) => {
            const qnNumber = question.questionNumber;
            return (
              <div key={qnNumber} className="border-l-4 border-blue-500 pl-4">
                <Label className="font-medium">Question {qnNumber}</Label>
                <p className="text-gray-700 mb-4">{question.questionText}</p>
                <RadioGroup
                  value={
                    answers[question.questionNumber]
                      ? `${qnNumber}-${answers[question.questionNumber]}`
                      : ""
                  }
                  onValueChange={(value) => {
                    updateAnswer(
                      question.questionNumber,
                      parseInt(value.split("-")[1])
                    );
                  }}
                >
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-3"
                    >
                      <RadioGroupItem
                        value={`${qnNumber}-${index + 1}`}
                        id={`${qnNumber}-${index + 1}`}
                      />
                      <Label htmlFor={`${qnNumber}-${index + 1}`}>
                        {option.optionText}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
