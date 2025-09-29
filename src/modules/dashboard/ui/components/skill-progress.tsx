import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface Props {
  skill: string;
  color: string;
  Icon: LucideIcon;
  current: number;
  target: number;
}

export const SkillProgress = ({
  skill,
  Icon,
  color,
  current,
  target,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded ${color} text-white flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-medium">{skill}</span>
        </div>
        <span className="text-sm text-gray-500">
          {current} / {target}
        </span>
      </div>
      <Progress value={(current / target) * 100} className="h-2" />
    </div>
  );
};

export const SkillProgressSkeleton = () => {
  return <div className="w-full bg-neutral-100 h-10 animate-pulse" />;
};
