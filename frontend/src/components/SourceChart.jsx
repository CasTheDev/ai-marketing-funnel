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
    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          color: "#6b7280",
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
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