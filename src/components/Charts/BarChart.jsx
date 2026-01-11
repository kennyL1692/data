import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import anime from 'animejs';
import './BarChart.css';

export default function BarChart({ data }) {
    const svgRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const g = svg
            .attr('width', container.clientWidth)
            .attr('height', 400)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.region))
            .range([0, width])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.avgCharges) * 1.1])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d => `$${(d / 1000).toFixed(0)}k`);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-transform', 'capitalize');

        g.append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // Axis labels
        g.append('text')
            .attr('class', 'axis-label')
            .attr('x', width / 2)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .text('Region');

        g.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .text('Average Charges ($)');

        // Tooltip
        const tooltip = d3.select(container)
            .append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);

        // Bars
        const bars = g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.region))
            .attr('y', height)
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .attr('fill', 'url(#barGradient)')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html(`
          <strong>Region:</strong> ${d.region}<br/>
          <strong>Avg Charges:</strong> $${d.avgCharges.toFixed(2)}<br/>
          <strong>Sample Size:</strong> ${d.count}
        `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

        // Gradient definition
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'barGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'var(--color-primary-light)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'var(--color-primary-dark)')
            .attr('stop-opacity', 1);

        // Animate bars
        anime({
            targets: bars.nodes(),
            y: (el, i) => yScale(data[i].avgCharges),
            height: (el, i) => height - yScale(data[i].avgCharges),
            duration: 1200,
            delay: anime.stagger(150, { start: 300 }),
            easing: 'easeOutCubic'
        });

        // Value labels
        const labels = g.selectAll('.value-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => xScale(d.region) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.avgCharges) - 10)
            .attr('text-anchor', 'middle')
            .style('opacity', 0)
            .text(d => `$${(d.avgCharges / 1000).toFixed(1)}k`);

        // Animate labels
        anime({
            targets: labels.nodes(),
            opacity: 1,
            duration: 600,
            delay: anime.stagger(150, { start: 800 }),
            easing: 'easeOutQuad'
        });

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <div className="chart-container" ref={containerRef}>
            <h2 className="chart-title">Average Charges by Region</h2>
            <p className="chart-subtitle">Regional comparison of medical insurance costs</p>
            <svg ref={svgRef}></svg>
        </div>
    );
}
