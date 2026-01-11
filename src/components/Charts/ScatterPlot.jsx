import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import anime from 'animejs';
import './ScatterPlot.css';

export default function ScatterPlot({ data }) {
    const svgRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const container = containerRef.current;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
        const width = container.clientWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const g = svg
            .attr('width', container.clientWidth)
            .attr('height', 500)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.age) + 5])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.charges) + 5000])
            .range([height, 0]);

        const colorScale = d => d.smoker === 'yes'
            ? 'var(--color-smoker-yes)'
            : 'var(--color-smoker-no)';

        // Axes
        const xAxis = d3.axisBottom(xScale).ticks(10);
        const yAxis = d3.axisLeft(yScale).ticks(8).tickFormat(d => `$${(d / 1000).toFixed(0)}k`);

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
            .text('Age (years)');

        g.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .text('Medical Charges ($)');

        // Tooltip
        const tooltip = d3.select(container)
            .append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);

        // Plot points
        const circles = g.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.age))
            .attr('cy', d => yScale(d.charges))
            .attr('r', 0)
            .attr('fill', colorScale)
            .attr('opacity', 0.7)
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .attr('opacity', 1);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                tooltip.html(`
          <strong>Age:</strong> ${d.age}<br/>
          <strong>Charges:</strong> $${d.charges.toFixed(2)}<br/>
          <strong>BMI:</strong> ${d.bmi.toFixed(1)}<br/>
          <strong>Smoker:</strong> ${d.smoker}<br/>
          <strong>Region:</strong> ${d.region}
        `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5)
                    .attr('opacity', 0.7);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

        // Animate circles
        anime({
            targets: circles.nodes(),
            r: 5,
            duration: 1000,
            delay: anime.stagger(2, { start: 300 }),
            easing: 'easeOutElastic(1, .8)'
        });

        // Legend
        const legend = g.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 120}, 0)`);

        const legendData = [
            { label: 'Smoker', color: 'var(--color-smoker-yes)' },
            { label: 'Non-Smoker', color: 'var(--color-smoker-no)' }
        ];

        legendData.forEach((item, i) => {
            const legendRow = legend.append('g')
                .attr('transform', `translate(0, ${i * 25})`);

            legendRow.append('circle')
                .attr('r', 6)
                .attr('fill', item.color)
                .attr('opacity', 0.7);

            legendRow.append('text')
                .attr('x', 15)
                .attr('y', 5)
                .attr('class', 'legend-text')
                .text(item.label);
        });

        return () => {
            tooltip.remove();
        };
    }, [data]);

    return (
        <div className="chart-container" ref={containerRef}>
            <h2 className="chart-title">Medical Charges vs Age</h2>
            <p className="chart-subtitle">Impact of smoking on healthcare costs across age groups</p>
            <svg ref={svgRef}></svg>
        </div>
    );
}
