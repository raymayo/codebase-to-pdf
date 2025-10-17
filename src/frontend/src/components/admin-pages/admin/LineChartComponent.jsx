import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 200 },
  { name: "Apr", uv: 278 },
  { name: "May", uv: 189 },
];

export default function LineChartComponent() {
  return (
    <LineChart width={700} height={500} data={data}>
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
}
