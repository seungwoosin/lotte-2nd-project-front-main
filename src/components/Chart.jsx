import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '휴가', cnt: 5 },
  { date: '출근', cnt: 15 },
  { date: '결근', cnt: 1 },
  { date: '반차', cnt: 0 },
  { date: '외근', cnt: 3 },
];

const AttendanceChart = () => {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="cnt" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;