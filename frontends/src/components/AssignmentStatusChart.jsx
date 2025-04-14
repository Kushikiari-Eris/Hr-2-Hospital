import React from 'react';
import Chart from 'react-apexcharts';

const AssignmentStatusChart = ({ data }) => {
  const statusLabels = {
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    expired: 'Expired'
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: Object.keys(data).map(key => statusLabels[key]),
    colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
    legend: {
      position: 'bottom'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#373d3f'
            }
          }
        }
      }
    }
  };

  const series = Object.values(data);

  return (
    <div className="h-72">
      <Chart
        options={chartOptions}
        series={series}
        type="donut"
        height="100%"
      />
    </div>
  );
};

export default AssignmentStatusChart;