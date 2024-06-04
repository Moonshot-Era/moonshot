import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';
import { Filler } from 'chart.js';
import { createChart, ColorType } from 'lightweight-charts';

ChartJS.register(Filler);

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CultureChartProps {
  data: Array<{ time: string; value: number }>;
}

export const CultureChart = ({ data }: CultureChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      layout: {
        background: {
          type: ColorType.Solid,

          color: 'rgba(0,0,0,0)'
        },
        textColor: '#000000'
      },
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
      }
    });

    const lineSeries = chart.addAreaSeries({
      lineColor: '#000000',
      lineWidth: 1,
      topColor: 'rgba(190,255,108,1)',
      bottomColor: 'rgba(190,255,108,0)'
    });

    chart.priceScale('right').applyOptions({
      visible: false
    });
    chart.timeScale().applyOptions({
      visible: false
    });

    const orderedData = data.sort((a, b) => {
      return +a.time - +b.time;
    });

    lineSeries.setData(orderedData);

    return () => chart.remove();
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '200px' }} />
  );
};
