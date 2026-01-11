import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import anime from 'animejs';
import './Histogram.css';

export default function Histogram({ data }) {
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
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x0), d3.max(data, d => d.x1)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) * 1.1])
            .range([height, 0]);

        // Axes
        const xAxis = d3.axisBottom(xScale).ticks(10);
        const yAxis = d3.axisLeft(yScale).ticks(6);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        g.append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        // Axis labels
        g.append('text')
            .attr('class', 'axis-label')
            .attr('x', width / 2)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .text('BMI (Body Mass Index)');

        g.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .text('Frequency');

        // Tooltip
        const tooltip = d3.select(container)
            .append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);

        // Bars
        const bars = g.selectAll('.histogram-bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'histogram-bar')
            .attr('x', d => xScale(d.x0) + 1)
            .attr('y', height)
            .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
            .attr('height', 0)
            .attr('fill', 'url(#histogramGradient)')
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                const category = d.midpoint < 18.5 ? 'Underweight' :
                    d.midpoint < 25 ? 'Normal' :
                        d.midpoint < 30 ? 'Overweight' : 'Obese';

                tooltip.html(`
          <strong>BMI Range:</strong> ${d.x0.toFixed(1)} - ${d.x1.toFixed(1)}<br/>
          <strong>Count:</strong> ${d.count}<br/>
          <strong>Category:</strong> ${category}
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
            .attr('id', 'histogramGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'var(--color-secondary)')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'var(--color-primary)')
            .attr('stop-opacity', 1);

        // Animate bars
        anime({
            targets: bars.nodes(),
            y: (el, i) => yScale(data[i].count),
            height: (el, i) => height - yScale(data[i].count),
            duration: 1200,
            delay: anime.stagger(100, { start: 400 }),
            easing: 'easeOutCubic'
        });

        // BMI category lines
        const categories = [
            { value: 18.5, label: 'Underweight', color: 'var(--color-warning)' },
            { value: 25, label: 'Normal', color: 'var(--color-success)' },
            { value: 30, label: 'Overweight', color: 'var(--color-warning)' }
        ];

        categories.forEach(cat => {
            if (cat.value >= xScale.domain()[0] && cat.value <= xScale.domain()[1]) {
                g.append('line')
                    .attr('class', 'category-line')
                    .attr('x1', xScale(cat.value))
                    .attr('x2', xScale(cat.value))
                    .attr('y1', 0)
                    .attr('y2', height)
                    .attr('stroke', cat.color)
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '5,5')
                    .attr('opacity', 0.5);

                g.append('text')
                    .attr('class', 'category-label')
                    .attr('x', xScale(cat.value) + 5)
                    .attr('y', 15)
                    .attr('fill', cat.color)
                    .style('font-size', '0.7rem')
                    .text(cat.label);
            }
        });

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <div className="chart-container" ref={containerRef}>
            <h2 className="chart-title">BMI Distribution</h2>
            <p className="chart-subtitle">Body Mass Index distribution across the population</p>
            <svg ref={svgRef}></svg>
        </div>
    );
}
