"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { name: "Tháng 1", users: 30, attempts: 200 },
  { name: "Tháng 2", users: 45, attempts: 250 },
  { name: "Tháng 3", users: 50, attempts: 270 },
];

const Statistics = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-100">
      <h1 className="text-2xl font-semibold">Thống kê hệ thốngg</h1>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-2">
            Số lượng người dùng và bài thi theo tháng
          </h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={sampleData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" name="Người dùng" />
                <Bar dataKey="attempts" fill="#82ca9d" name="Lượt thi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
