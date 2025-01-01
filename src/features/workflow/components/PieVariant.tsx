import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#ef4444"];

export const PieVariant = ({
  data,
}: {
  data: { label: string; name: string; execution_time: number }[];
}) => {
  let pieData:
    | Record<string, number>
    | { label: string; execution_time: number }[] = {};

  // storing keys as node type and execution time as number
  data.forEach((node) => {
    (pieData as Record<string, number>)[node.label] =
      ((pieData as Record<string, number>)[node.label] ?? 0) +
      node.execution_time;
  });

  // making it array
  pieData = (Object.keys(pieData) as (keyof typeof pieData)[]).map((label) => ({
    label,
    execution_time: (pieData as Record<string, number>)[label]
      ? (pieData as Record<string, number>)[label]
      : 0,
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    [x: string]: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer className={"w-full h-full"}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={pieData}
          dataKey="execution_time"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
