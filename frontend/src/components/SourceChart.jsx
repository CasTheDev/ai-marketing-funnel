import "./SourceChart.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function SourceChart({ sources }) {
  return (
    <div className="source-chart">
      <h2 className="source-chart-title">
        Lead Sources
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sources}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="source" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="leads"
            fill="#2563eb"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SourceChart;