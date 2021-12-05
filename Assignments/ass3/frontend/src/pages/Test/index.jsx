import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function ProfitsGraph() {
  // eslint-disable-next-line no-unused-vars
  const [booking, setBookings] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [graphData, setGraphData] = useState([]);

  const options = {
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [10, 20, 30, 40, 10],
        type: 'line',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <>
      <ReactECharts option={options} />
    </>
  );
}
