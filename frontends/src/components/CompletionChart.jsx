import React from 'react';
import Chart from 'react-apexcharts';

const CompletionChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.map(item => `${item.month} ${item.year}`),
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    tooltip: {
      x: {
        format: 'MMM yyyy'
      }
    },
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    }
  };

  const series = [
    {
      name: 'Completions',
      data: data.map(item => item.count)
    }
  ];

  return (
    <div className="h-72">
      <Chart
        options={chartOptions}
        series={series}
        type="area"
        height="100%"
      />
    </div>
  );
};

export default CompletionChart;