import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Chart = ({ type, data, options = {}, className = '' }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    ...options
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    doughnut: Doughnut
  }[type];

  if (!ChartComponent) {
    return <div>Unsupported chart type: {type}</div>;
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ChartComponent data={data} options={defaultOptions} />
    </div>
  );
};

export default Chart;