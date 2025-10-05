'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { MonthlyData } from '../../lib/data';

interface MonthlyChartProps {
  monthlyData: MonthlyData[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ monthlyData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!monthlyData || monthlyData.length === 0) {
      d3.select(svgRef.current).selectAll('*').remove();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = (svgRef.current?.clientWidth || 800) - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Format month labels as MM-YY
    const formatMonth = (monthKey: string) => {
      const [year, month] = monthKey.split('-');
      return `${month}-${year.substring(2)}`;
    };

    // Sort data by month to ensure proper order
    const sortedData = [...monthlyData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNumber - b.monthNumber;
    });

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) || 0])
      .nice()
      .range([height, 0]);

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Create gradient for bars (teal to light green)
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#0D9488') // Teal-600
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10B981') // Emerald-500
      .attr('stop-opacity', 0.6);

    // Create glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // X-axis with enhanced styling
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(formatMonth));

    // Style X-axis line
    xAxis.select('.domain')
      .attr('stroke', '#374151') // Gray-700
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // Style X-axis ticks
    xAxis.selectAll('.tick line')
      .attr('stroke', '#6B7280') // Gray-500
      .attr('stroke-width', 1)
      .attr('opacity', 0.6);

    // Style X-axis labels
    xAxis.selectAll('.tick text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('fill', '#9CA3AF') // Gray-400
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    // Y-axis with enhanced styling
    const yAxis = g.append('g')
      .call(d3.axisLeft(y));

    // Style Y-axis line
    yAxis.select('.domain')
      .attr('stroke', '#374151') // Gray-700
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // Style Y-axis ticks
    yAxis.selectAll('.tick line')
      .attr('stroke', '#6B7280') // Gray-500
      .attr('stroke-width', 1)
      .attr('opacity', 0.6);

    // Style Y-axis labels
    yAxis.selectAll('.tick text')
      .attr('fill', '#9CA3AF') // Gray-400
      .attr('font-size', '12px')
      .attr('font-weight', '500');

    // Bars with gradient and glow effect
    g.selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.month)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', 'url(#barGradient)')
      .attr('filter', 'url(#glow)')
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4)
      .on('mouseover', function (event, d) {
        // Create hover gradient
        const hoverGradient = defs.append('linearGradient')
          .attr('id', 'hoverGradient')
          .attr('x1', '0%')
          .attr('y1', '100%')
          .attr('x2', '0%')
          .attr('y2', '0%');
        
        hoverGradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', '#059669') // Emerald-600
          .attr('stop-opacity', 0.9);
        
        hoverGradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#34D399') // Emerald-400
          .attr('stop-opacity', 0.7);

        d3.select(this)
          .attr('fill', 'url(#hoverGradient)')
          .attr('filter', 'url(#glow)');
        
        tooltip.style('opacity', 1)
          .html(`Month: ${formatMonth(d.month)}<br/>Connections: ${d.count}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('fill', 'url(#barGradient)')
          .attr('filter', 'url(#glow)');
        tooltip.style('opacity', 0);
      });

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#1F2937')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');

  }, [monthlyData]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full h-80"></svg>
    </div>
  );
};

export default MonthlyChart;
