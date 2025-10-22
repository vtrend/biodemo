import * as d3 from 'd3';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { DataPoint, RangeZone } from '@/data/schemas';
import Tooltip from './Tooltip';

interface ChartWithRangesProps {
  bioData: DataPoint[];
  selectedBiomarker: string;
  rangesZones: RangeZone[];
}

const ChartWithRanges = ({ bioData, selectedBiomarker, rangesZones }: ChartWithRangesProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tootipPosition, setTootipPosition] = useState({ top: 0, left: 0 });
  const [tooltipData, setTooltipData] = useState<DataPoint | null>(null);
  const { width, height = 300, ref: containerRef } = useResizeDetector();

  useEffect(() => {
    if (!svgRef.current || !width || !height) return;

    const maxValue = d3.max(bioData, (d) => d.value)!;
    const minValue = d3.min(bioData, (d) => d.value)!;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    const margin = {
      top: 40,
      right: 20,
      bottom: 80,
      left: 20,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const legendFontSize = 10;
    const legendRowHeight = 20;
    const legendOffset = 5; // ZONE
    const bandwidth = 8;

    // SCALES
    const xScale = d3
      .scaleBand()
      .domain(bioData.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([minValue, maxValue]).range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // ZONES

    rangesZones.forEach((zone: RangeZone) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(zone.max))
        .attr('width', bandwidth)
        .attr('height', yScale(zone.min) - yScale(zone.max))
        .attr('fill', zone.color);

      if (zone.background) {
        g.append('rect')
          .attr('x', bandwidth)
          .attr('y', yScale(zone.max))
          .attr('width', innerWidth - bandwidth)
          .attr('height', yScale(zone.min) - yScale(zone.max))
          .attr('fill', zone.color)
          .attr('opacity', 0.2);
      }
    });

    //GRADIENT
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'zoneGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    bioData.forEach((d, i) => {
      const zone = rangesZones.find((z) => d.value >= z.min && d.value < z.max) || {};
      const color = zone?.color ?? '#000';
      const percentage = (i / (bioData.length - 1)) * 100;

      gradient.append('stop').attr('offset', `${percentage}%`).attr('stop-color', color);
    });

    //LINE
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .y((d) => yScale(d.value));

    g.append('path')
      .datum(bioData)
      .transition()
      .duration(500)
      .attr('fill', 'none')
      .attr('stroke', 'url(#zoneGradient)')
      .attr('stroke-width', 2)
      .attr('d', line(bioData))
      .end();

    //BOTTOM LINE
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', height - margin.bottom - legendRowHeight)
      .attr('y2', height - margin.bottom - legendRowHeight)
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

    //CIRCLES
    bioData.forEach((d, i) => {
      const x = xScale(d.date)! + xScale.bandwidth() / 2;
      const y = yScale(d.value);

      const zone = rangesZones.find((z) => d.value >= z.min && d.value < z.max);
      const pointColor = zone?.color ?? '#000';

      // HIGHLIGHT BAR
      g.append('rect')
        .attr('x', x - xScale.bandwidth() / 2)
        .attr('y', 0)
        .attr('width', xScale.bandwidth())
        .attr('height', height - margin.bottom - legendRowHeight)
        .attr('fill', 'transparent')
        .attr('opacity', 0.2)
        .on('mouseover', function (event: MouseEvent) {
          d3.select(this).transition().duration(100).attr('fill', pointColor);
          setTootipPosition({ top: event.clientY, left: event.clientX });
          setTooltipData(d);
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration(100).attr('fill', 'transparent');
          setTootipPosition({ top: 0, left: 0 });
          setTooltipData(null);
        });

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('fill', '#fff')
        .attr('stroke', pointColor)
        .attr('stroke-width', 2)

        .on('mouseover', function (event: MouseEvent) {
          setTootipPosition({ top: event.clientY, left: event.clientX });
          setTooltipData(d);
          d3.select(this).transition().duration(100).attr('r', 8);
        })
        .on('mouseout', function () {
          setTootipPosition({ top: 0, left: 0 });
          setTooltipData(null);
          d3.select(this).transition().duration(100).attr('r', 4);
        })

        .transition()
        .duration(300)
        .attr('r', 4);

      //LEGENDS
      const legend = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${height - margin.bottom + legendRowHeight})`);

      const legendItems = legend
        .selectAll('.legend-item')
        .data(bioData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => {
          const x = xScale(d.date)! + xScale.bandwidth() / 2 + legendOffset;
          const row = i % 2;
          const y = row * legendRowHeight;
          return `translate(${x}, ${y})`;
        });

      legendItems
        .append('text')
        .attr('x', 0)
        .attr('y', legendRowHeight - 5)
        .attr('font-size', legendFontSize)
        .attr('fill', '#333')
        .attr('text-anchor', 'middle')
        .text((d) => dayjs(d.date).format('DD/MM/YYYY'));

      const legendItemSpacing = 120;
      const totalLegendWidth = rangesZones.length * legendItemSpacing;
      const legendX = margin.left + Math.max(0, (innerWidth - totalLegendWidth) / 2);

      const colorLegend = svg
        .append('g')
        .attr('transform', `translate(${legendX},${height - margin.bottom + legendRowHeight * 3})`)
        .attr('class', 'color-legend')
        .selectAll('.color-legend-item')
        .data(rangesZones)
        .enter()
        .append('g')
        .attr('class', 'color-legend-item')
        .attr('transform', (d, i) => {
          const x = i * legendItemSpacing;
          const y = 0;
          return `translate(${x}, ${y})`;
        });

      colorLegend
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', (d: { color: string }) => d?.color ?? '#000');

      colorLegend
        .append('text')
        .attr('x', 15)
        .attr('y', legendRowHeight - legendFontSize)
        .attr('font-size', legendFontSize)
        .attr('fill', '#333')
        .attr('text-anchor', 'start')
        .text((d: { legend: string }) => d.legend);
    });
  }, [bioData, width, height, rangesZones]);

  return (
    <>
      <Tooltip position={{ top: tootipPosition.top, left: tootipPosition.left }}>
        <div>
          <span className="font-bold capitalize">{selectedBiomarker}</span>
          <br />
          {tooltipData?.value} {tooltipData?.unit}
          <br />
          {dayjs(tooltipData?.date).format('DD/MM/YYYY')}
        </div>
      </Tooltip>
      <div className="w-full h-full flex items-center justify-center p-4" ref={containerRef}>
        <svg ref={svgRef} width={width} height={height} />
      </div>
    </>
  );
};

export default ChartWithRanges;
