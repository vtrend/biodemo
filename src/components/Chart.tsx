import * as d3 from 'd3';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { DataPoint } from '@/data/schemas';
import Tooltip from './Tooltip';

interface ChartProps {
  bioData: DataPoint[];
  selectedBiomarker: string;
}

const Chart = ({ bioData, selectedBiomarker }: ChartProps) => {
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

    // SCALES
    const xScale = d3
      .scaleBand()
      .domain(bioData.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([minValue, maxValue]).range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('d', line(bioData))
      .end();

    //CIRCLES
    bioData.forEach((d) => {
      const x = xScale(d.date)! + xScale.bandwidth() / 2;
      const y = yScale(d.value);

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('fill', '#fff')
        .attr('stroke', '#000')
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
      const legendFontSize = 10;
      const legendRowHeight = 20;

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
          const x = xScale(d.date)! + xScale.bandwidth() / 2;
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
    });
  }, [bioData, width, height]);

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

export default Chart;
