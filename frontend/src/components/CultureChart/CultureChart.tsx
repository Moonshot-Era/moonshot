import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartArea,
  ScriptableContext
} from 'chart.js';
import { Filler } from 'chart.js';
import { useOhlcv } from '@/hooks/useOhlcvc';
import { usePathname } from 'next/navigation';

ChartJS.register(Filler);

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CultureChartProps {
  data: Array<number>;
  labels: Array<string>;
}

export const CultureChart = ({ data, labels }: CultureChartProps) => {
  const pathname = usePathname();
  const tokenAddress = pathname.replace('/culture/', '');

  const { ohlcv } = useOhlcv(tokenAddress);

  console.log('ohlcv', ohlcv);
  const chartRef = React.useRef(null);

  let width: number;
  let height: number;
  let gradient: CanvasGradient | undefined;

  function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, 'rgba(190,255,108,0)');
      gradient.addColorStop(1, 'rgba(190,255,108,1)');
    }

    return gradient;
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: data,
        fill: true,
        tension: 0.6,
        pointStyle: 'circle',
        pointBackgroundColor: '#000000',
        pointBorderColor: '#000000',
        pointBorderWidth: 1,
        pointRadius: 1,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#000000',
        pointHoverBorderColor: '#000000',
        pointHoverBorderWidth: 1,
        borderColor: '#000000',
        borderWidth: 1,
        backgroundColor: function (context: ScriptableContext<'line'>) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea);
        }
      }
    ]
  };

  const options = {
    scales: {
      y: {
        display: false,
        beginAtZero: true
      },
      x: {
        display: false
      }
    }
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};
