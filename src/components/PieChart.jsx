import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: '출근', value: 15 },
  { name: '휴가', value: 3 },
  { name: '외근', value: 5 }
];

const COLORS = ['#ff6384', '#36a2eb']; // 색상 설정

const PieChartComponent = () => {
  return (
    <div>
      <PieChart width={280} height={280}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"  // 원형 차트의 X 좌표
          cy="50%"  // 원형 차트의 Y 좌표
          outerRadius={100}  // 원의 크기
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;