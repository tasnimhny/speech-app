'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define types for chart data
type LineData = {
  day: string;
  [key: string]: number | string;
};

type LineConfig = {
  key: string;
  color: string;
};

type MiniGraphProps = {
  title: string;
  data: LineData[];
  lines: LineConfig[];
};

// MiniGraph component for reusable charts
const MiniGraph: React.FC<MiniGraphProps> = ({ title, data, lines }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-gray-300 text-center mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#ddd" />
          <YAxis stroke="#ddd" />
          <Tooltip />
          {lines.map((line, index) => (
            <Line key={index} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Dummy data for different statistics
const lineCommitData: LineData[] = [
  { day: 'Mon', speechCode: 10, regularCode: 5 },
  { day: 'Tue', speechCode: 30, regularCode: 20 },
  { day: 'Wed', speechCode: 30, regularCode: 25 },
  { day: 'Thu', speechCode: 50, regularCode: 35 },
  { day: 'Fri', speechCode: 70, regularCode: 45 }
];

const commandsUsedData: LineData[] = [
  { day: 'Mon', speechCommands: 15, manualCommands: 10 },
  { day: 'Tue', speechCommands: 25, manualCommands: 18 },
  { day: 'Wed', speechCommands: 22, manualCommands: 16 },
  { day: 'Thu', speechCommands: 35, manualCommands: 20 },
  { day: 'Fri', speechCommands: 40, manualCommands: 30 }
];

const errorsFixedData: LineData[] = [
  { day: 'Mon', errorsFixed: 3 },
  { day: 'Tue', errorsFixed: 5 },
  { day: 'Wed', errorsFixed: 4 },
  { day: 'Thu', errorsFixed: 7 },
  { day: 'Fri', errorsFixed: 8 }
];

const timeSavedData: LineData[] = [
  { day: 'Mon', minutesSaved: 20 },
  { day: 'Tue', minutesSaved: 40 },
  { day: 'Wed', minutesSaved: 35 },
  { day: 'Thu', minutesSaved: 50 },
  { day: 'Fri', minutesSaved: 60 }
];

// Main Analytics Page
export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold text-center mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Lines of Code Committed */}
        <MiniGraph
          title="Lines of Code Committed"
          data={lineCommitData}
          lines={[
            { key: 'speechCode', color: '#4F46E5' },
            { key: 'regularCode', color: '#E53E3E' }
          ]}
        />

        {/* Commands Used */}
        <MiniGraph
          title="Commands Used Per Day"
          data={commandsUsedData}
          lines={[
            { key: 'speechCommands', color: '#38B2AC' },
            { key: 'manualCommands', color: '#F6AD55' }
          ]}
        />

        {/* Errors Fixed */}
        <MiniGraph
          title="Errors Fixed by AI"
          data={errorsFixedData}
          lines={[
            { key: 'errorsFixed', color: '#9F7AEA' }
          ]}
        />

        {/* Time Saved */}
        <MiniGraph
          title="Time Saved Using Speech-to-Code (Minutes)"
          data={timeSavedData}
          lines={[
            { key: 'minutesSaved', color: '#48BB78' }
          ]}
        />
      </div>
    </div>
  );
}
