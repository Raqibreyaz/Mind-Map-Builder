import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export const LineVariant = ({
  data,
}: {
  data: { name: string; execution_time: number }[];
}) => {
  return (
    <ResponsiveContainer className={"w-full h-full"}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#eee" />
        <Line type="monotone" dataKey="execution_time" stroke="#10b981" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
};

