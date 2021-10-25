import React, { useEffect, useState, useRef } from "react";

import Box from "shared/ui-kit/Box";
import { PriceGraphStyles } from "./index.styles";
import * as LightweightCharts from 'lightweight-charts';
import { Color } from "shared/ui-kit";
import { useResizeObserver } from "./useResizeObserver";

export default function PriceGraph({ graphData, title, subTitle }) {
  const classes = PriceGraphStyles();
	const containerRef = useRef(null);

	const [seriesesData, setSeriesData] = useState<any>(null)
	const [width, height] = useResizeObserver(containerRef);
	const intervals = ['1H', '1D', '7D'];
	
	useEffect(() => {
		if (graphData) {
			const mapData: any = [
				['1H', graphData[0].data.data],
				['1D', graphData[1].data.data],
				['7D', graphData[2].data.data]
			];

			// @ts-ignore
			setSeriesData(new Map(mapData))
		}
	}, [graphData])

  useEffect(() => {
		const createSimpleSwitcher = (items, activeItem, activeItemChangedCallback) => {
			var switcherElement = document.createElement('div');
			switcherElement.classList.add('switcher');
		
			var intervalElements = items.map(function(item) {
				var itemEl = document.createElement('button');
				itemEl.innerText = item;
				itemEl.classList.add('switcher-item');
				itemEl.classList.toggle('switcher-active-item', item === activeItem);
				itemEl.addEventListener('click', function() {
					onItemClicked(item);

				});
				switcherElement.appendChild(itemEl);
				return itemEl;
			});
		
			function onItemClicked(item) {
				if (item === activeItem) {
					return;
				}
		
				intervalElements.forEach(function(element, index) {
					element.classList.toggle('switcher-active-item', items[index] === item);
				});
		
				activeItem = item;
		
				activeItemChangedCallback(item);
			}
		
			return switcherElement;
		}

    var switcherElement = createSimpleSwitcher(intervals, intervals[0], syncToInterval);

		var chartElement = document.createElement('div');  
		var chart = LightweightCharts.createChart(chartElement, {
			width,
			height,
			layout: {
				backgroundColor: Color.Purple,
				textColor: '#d1d4dc',
			},
			grid: {
				vertLines: {
					visible: false,
				},
				horzLines: {
					color: 'rgba(42, 46, 57, 0.5)',
				},
			},
			rightPriceScale: {
				borderVisible: false,
			},
			timeScale: {
				timeVisible: true,
				borderVisible: false,
				fixLeftEdge: true,
				fixRightEdge: true
			},
		});
		
		if (document.getElementById('price_chart')?.getElementsByClassName("tv-lightweight-charts").length) {
			const child = document?.getElementById('price_chart');
			if (child) child.innerHTML = '';
		}
        
		document?.getElementById('price_chart')?.appendChild(chartElement);
		document?.getElementById('price_chart')?.appendChild(switcherElement);

		var areaSeries: any = null;
		function syncToInterval(interval) {
			if (areaSeries) {
				chart.removeSeries(areaSeries!);
				areaSeries = null;
			}
			areaSeries = chart.addAreaSeries({
				topColor: '#DDFF57',
				bottomColor: '#DDFF5704',
				lineColor: '#DDFF57',
				lineWidth: 4,
			});
			areaSeries.setData(seriesesData.get(interval));
		}

		if (seriesesData) {
			syncToInterval(intervals[0]);
		}
  }, [seriesesData, width, height])

	if (!graphData) {
		return null;
	}

	return (
		<div ref={containerRef} id="price_chart" className={classes.root} style={{ width: '100%' }}>
			<Box display="flex" flexDirection="column" className={classes.titleBox}>
				<span className={classes.title}>{title}</span>
				<span className={classes.date}>{subTitle}</span>
			</Box>
		</div>
	)
}
