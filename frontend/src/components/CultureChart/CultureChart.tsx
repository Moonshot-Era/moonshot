import { formatNumberToUsd } from '@/helpers/helpers';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement
} from 'chart.js';
import {
  AreaData,
  ColorType,
  ISeriesApi,
  Time,
  createChart
} from 'lightweight-charts';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

ChartJS.register(Filler);

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface CultureChartProps {
  data: Array<{ time: number; value: number[] }>;
  tokenDecimals: number;
  loadMoreBars: () => void;
}

export const CultureChart = ({
  data,
  tokenDecimals,
  loadMoreBars
}: CultureChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [lineSeries, setLineSeries] = useState<any>(null);
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      layout: {
        background: {
          type: ColorType.Solid,
          color: '#fff'
        },
        textColor: ' rgba(0, 0, 0, 0) '
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
      lineColor: '#BEFF6C',
      lineWidth: 2,
      topColor: 'rgba(190,255,108,1)',
      bottomColor: 'rgba(190,255,108,0)',
      priceFormat: {
        type: 'custom',
        formatter: (price: string) => {
          return formatNumberToUsd(Math.abs(tokenDecimals / 2)).format(+price);
        }
      }
    });

    setLineSeries(lineSeries);
    setChart(chart);

    return () => chart.remove();
  }, []);

  useEffect(() => {
    if (chart) {
      chart
        .timeScale()
        .subscribeVisibleLogicalRangeChange(
          (logicalRange: { from: number }) => {
            if (logicalRange.from < 50) {
              loadMoreBars();
            }
          }
        );
    }
  }, [chart, loadMoreBars]);

  useEffect(() => {
    if (!lineSeries || !data.length) return;

    if (data.length) {
      lineSeries.setData(data as unknown as AreaData<Time>[]);
    }
  }, [data, lineSeries]);

  return <div ref={chartContainerRef} style={{ width: '100%' }}></div>;
};
