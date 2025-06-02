import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { theme } from "../../theme/theme"; // Adjust path if theme.js is elsewhere
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
    const { isDarkMode } = useContext(ThemeContext);
    const currentTheme = isDarkMode ? theme.dark : theme.light;

    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: `${currentTheme.background.elevated}e6`, // Adding 90% opacity (e6)
            border: `1px solid ${currentTheme.border.main}`,
            color: currentTheme.text.primary,
          }}
          className="backdrop-blur-sm p-4 rounded-lg shadow-xl transform translate-x-3 -translate-y-[105%] pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="font-bold text-lg" style={{ color: currentTheme.text.primary }}>
              {label}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p style={{ color: currentTheme.text.secondary }}>Skill Level:</p>
            <p className="font-semibold" style={{ color: currentTheme.primary.main }}>
              {`${payload[0].value}%`}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t" style={{ borderColor: currentTheme.border.light }}>
            <p className="text-sm" style={{ color: currentTheme.text.disabled }}>
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

  const { isDarkMode: chartIsDarkMode } = useContext(ThemeContext); // Renamed to avoid conflict in CustomTooltip
  const currentChartTheme = chartIsDarkMode ? theme.dark : theme.light;

  return (
    <div className="bg-[var(--background-paper)] border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
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
            <CartesianGrid strokeDasharray="3 3" stroke={currentChartTheme.border.main} />
            <XAxis
              dataKey="name"
              stroke={currentChartTheme.border.dark} // Axis line color
              tick={{ fill: currentChartTheme.text.secondary, fontWeight: "bold" }}
              angle={-45}
              textAnchor="end"
              height={70}
              tickLine={{ stroke: currentChartTheme.border.dark }}
            />
            <YAxis
              stroke={currentChartTheme.border.dark} // Axis line color
              tick={{ fill: currentChartTheme.text.secondary, fontWeight: "bold" }}
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
              tickLine={{ stroke: currentChartTheme.border.dark }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79, 70, 229, 0.1)" }} />
            <Legend
              wrapperStyle={{
                color: currentChartTheme.text.secondary,
                paddingTop: "10px",
              }}
              formatter={(value, entry) => (
                <span style={{ color: currentChartTheme.text.secondary }}>{value}</span>
              )}
            />
            <Bar
              dataKey="level" // This fill is overridden by Cell, but good to have a base
              fill={currentChartTheme.primary.main}
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
