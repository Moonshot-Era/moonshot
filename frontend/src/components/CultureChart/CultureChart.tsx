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
