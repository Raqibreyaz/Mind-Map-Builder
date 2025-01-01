import { BarVariant } from "@/features/workflow/components/BarVariant";
import { LineVariant } from "@/features/workflow/components/LineVariant";
import { PieVariant } from "@/features/workflow/components/PieVariant";
import { memo, useCallback, useState } from "react";
import { Node } from "@xyflow/react";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ChartSection = memo(({ nodes }: { nodes: Node[] }) => {
  const [chartType, setChartType] = useState<string>("bar");

  const data = nodes.map((node) => ({
    name: node.data.name as string,
    execution_time: node.data.execution_time as number,
    label: node.data.label as string,
  }));
  console.log(data);
  const RenderChart = useCallback(
    ({ chartType }: { chartType: string }) => {
      switch (chartType) {
        case "bar":
          return <BarVariant data={data} />;
        case "pie":
          return <PieVariant data={data} />;
        case "line":
          return <LineVariant data={data} />;
      }
    },
    [data]
  );

  return (
    <div
      className={`relative mt-6 rounded-md w-full ${
        data.length > 0 ? "h-60" : ""
      }`}
    >
      <div className="mb-2 ml-2">
        <p className="text-green-400">
          *{
            {
              bar: "Execution Time for each node",
              pie: "Distribution of Execution time by Node type",
              line: "",
            }[chartType]
          }
        </p>
      </div>
      <div className="ml-2 mr-auto w-28 z-10">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger>
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent className="w-30">
            {[
              { name: "bar", icon: <BarChartIcon className="size-4" /> },
              { name: "pie", icon: <PieChartIcon className="size-4" /> },
              { name: "line", icon: <LineChartIcon className="size-4" /> },
            ].map(({ name, icon }) => (
              <SelectItem value={name}>
                <div className="flex gap-x-5">
                  <p className="capitalize">{name}</p>
                  <p>{icon}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <RenderChart chartType={chartType} />
    </div>
  );
});
