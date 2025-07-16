import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SkillChart = () => {
  const data = [
    { name: "HTML", level: 100 },
    { name: "CSS", level: 98 },
    { name: "Bootstrap", level: 95 },
    { name: "TailwindCSS", level: 98 },
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 75 },
    { name: "React", level: 90 },
    { name: "NextJs", level: 60 },
    { name: "NodeJs", level: 70 },
    { name: "MongoDb", level: 80 },
    { name: "SQL", level: 60 },
    { name: "Prisma", level: 55 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold">{label}</p>
          <p className="text-indigo-400">{`Skill Level: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Skills <span className="text-indigo-600 dark:text-indigo-400">Visualization</span>
      </h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="level"
              fill="#4F46E5"
              name="Skill Level (%)"
              radius={[4, 4, 0, 0]}
              animationDuration={2000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillChart;
