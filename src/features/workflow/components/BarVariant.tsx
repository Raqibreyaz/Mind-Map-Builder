import {
  BarChart,
  XAxis,
  Tooltip,
  Legend,
  Bar,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const BarVariant = ({
  data,
}: {
  data: { name: string; execution_time: number }[];
}) => {
  console.log(data);
  return (
    <ResponsiveContainer className={"w-full h-full"}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend />
        <CartesianGrid stroke="#eee" />
        <Bar dataKey="execution_time" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
