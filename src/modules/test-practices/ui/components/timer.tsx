import { formatTime } from "@/lib/utils";
import React from "react";

const Timer = ({ timer }: { timer: number }) => {
  return (
    <div className="text-2xl font-bold text-red-600">{formatTime(timer)}</div>
  );
};

export default React.memo(Timer);
