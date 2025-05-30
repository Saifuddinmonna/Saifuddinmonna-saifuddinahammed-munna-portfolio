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
        <div className="bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl border border-gray-700 transform translate-x-3 -translate-y-[105%] pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="font-bold text-white/80 text-lg">{label}</p> {/* Inherits text-white */}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-300">Skill Level:</p> {/* Slightly dimmer white */}
            <p className="text-indigo-400 font-semibold">{`${payload[0].value}%`}</p>{" "}
            {/* Accent color for value */}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              {" "}
              {/* Dimmer white for proficiency status */}
              {payload[0].value >= 90
                ? "Expert"
                : payload[0].value >= 75
                ? "Advanced"
                : payload[0].value >= 60
                ? "Intermediate"
                : "Beginner"}
            </p>
          </div>
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
              tick={{ fill: "#374151", fontWeight: "bold" }} // Changed fill to a darker gray and added fontWeight
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#374151", fontWeight: "bold" }} // Changed fill to a darker gray and added fontWeight
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79, 70, 229, 0.1)" }} />
            <Legend />
            <Bar
              dataKey="level"
              fill="#4F46E5"
              name="Skill Level (%)"
              radius={[4, 4, 0, 0]}
              animationDuration={2000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${index * 30}, 70%, 50%)`}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillChart;
