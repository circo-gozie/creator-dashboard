"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Title from "./title";

export const description = "Views Distribution";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 260, mobile: 160 },
  { month: "August", desktop: 280, mobile: 175 },
  { month: "September", desktop: 230, mobile: 150 },
  { month: "October", desktop: 310, mobile: 220 },
  { month: "November", desktop: 340, mobile: 250 },
  { month: "December", desktop: 390, mobile: 270 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function VideoDistributionChart() {
  return (
    <Card className="border-0 bg-transparent rounded-md">
      <CardHeader>
        <Title title={description} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--chart-1)" radius={4} />

            <Bar
              dataKey="mobile"
              fill="var(--chart-2)"
              radius={4}
              className="a one"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
