import { formatNumberToUsd } from '@/helpers/helpers';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement
} from 'chart.js';
import { format, subMinutes } from 'date-fns';
import {
  AreaData,
  ColorType,
  CrosshairMode,
  Time,
  createChart
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import './style.scss';

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
  const tooltipRef = useRef<HTMLDivElement>(null);
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
        secondsVisible: true,
        ticksVisible: true,
        rightOffset: 0,
        barSpacing: 10
      },
      rightPriceScale: {
        visible: false
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          labelVisible: false
        },
        horzLine: {
          labelVisible: false
        }
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
      },
      priceLineVisible: false,
      crosshairMarkerVisible: false
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

  useEffect(() => {
    if (!chart || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const handleCrosshairMove = (param: any) => {
      if (!param || !param.time || !param.seriesData) {
        tooltip.style.display = 'none';
        return;
      }

      const price = param.seriesData.get(lineSeries);
      if (!price || !param.sourceEvent || !chartContainerRef.current) {
        tooltip.style.display = 'none';
        return;
      }
      const offsetMinutes = new Date(param.time * 1000).getTimezoneOffset();
      const formattedDate = format(
        subMinutes(new Date(param.time * 1000), -1 * offsetMinutes),
        'PP'
      );
      const formattedTime = format(
        subMinutes(new Date(param.time * 1000), -1 * offsetMinutes),
        'p'
      );

      tooltip.style.display = 'block';
      tooltip.style.left = `${param.point.x}px`;
      tooltip.style.top = `${param.point.y}px`;
      tooltip.innerHTML = `<div class="charTooltip__price">$${price.value.toFixed(
        4
      )}</div>
      <div class="charTooltip__date">${formattedDate}</div>
      <div class="charTooltip__date">${formattedTime}</div>`;
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [chart, lineSeries]);

  return (
    <div ref={chartContainerRef} className="chart">
      <div ref={tooltipRef} className="charTooltip"></div>
    </div>
  );
};
