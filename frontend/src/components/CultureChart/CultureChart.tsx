import { formatNumberToUsd } from '@/helpers/helpers';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement
} from 'chart.js';
import { AreaData, ColorType, Time, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

ChartJS.register(Filler);

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CultureChartProps {
  data: Array<{ time: number; value: number }>;
  tokenDecimals: number;
}

export const CultureChart = ({ data, tokenDecimals }: CultureChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const uniqueData = data.filter((item, index) => {
    return data.indexOf(item) == index;
  });

  const orderedData = uniqueData.sort((a, b) => {
    return a.time - b.time;
  });

  useEffect(() => {
    if (!chartContainerRef.current || !data) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#fff'
        }
      },

      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          visible: false
        }
      },
      localization: {
        locale: 'en-US',
        priceFormatter: (price: number) => {
          if (price < 0.000001) {
            return price.toExponential(1);
          } else {
            return formatNumberToUsd(Math.abs(tokenDecimals)).format(+price);
          }
        }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true
      }
    });

    const lineSeries = chart.addAreaSeries({
      lineColor: '#BEFF6C',
      lineWidth: 2,
      topColor: 'rgba(190,255,108,1)',
      bottomColor: 'rgba(190,255,108,0)',
      priceFormat: {
        minMove: 0.00000001,
        precision: 10,
        formatter: (price: number) => {
          if (price < 0.000001) {
            return price.toExponential(1);
          } else {
            return formatNumberToUsd(Math.abs(tokenDecimals)).format(+price);
          }
        }
      }
    });

    lineSeries.setData(orderedData as unknown as AreaData<Time>[]);

    return () => chart.remove();
  }, [data, orderedData, tokenDecimals]);

  return <div ref={chartContainerRef} style={{ width: '100%' }}></div>;
};
