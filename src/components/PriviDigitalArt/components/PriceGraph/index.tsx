import React, { useEffect, useState, useRef } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { PriceGraphStyles } from "./index.styles";
import * as LightweightCharts from 'lightweight-charts';
import { Color } from "shared/ui-kit";
import { format, addDays, setMinutes, setHours, setSeconds, setMilliseconds } from "date-fns";
import { useResizeObserver } from "./useResizeObserver";

export default function PriceGraph({ data, title, subTitle, filterDisable = false }) {
    const classes = PriceGraphStyles();
	const containerRef = useRef(null);

    const theme = useTheme();
	const [seriesesData, setSeriesData] = useState<any>(null)
	const [intervals, setIntervals] = useState<Array<string>>(['1D', '7D']);
	const [width, height] = useResizeObserver(containerRef);
	
	useEffect(() => {
		const dayData: any[] = [];
		const weekData: any[] = [];
		const monthData: any[] = [];
		const yearData: any[] = [];

		let day = '';
		let month = '';
		let week = '';
		let year = '';

		data.forEach((m) => {
			const dayFormat = format(new Date(m.timestamp), "yyyy-MM-dd");
			const monthFormat = format(new Date(m.timestamp), "yyyy-MM");
			const yearFormat = format(new Date(m.timestamp), "yyyy");

			if (year !== yearFormat) {
				yearData.push({
					time: dayFormat,
					value: +m.price
				});
				year = yearFormat;
			}
			if (month !== monthFormat) {
				monthData.push({
					time: dayFormat,
					value: +m.price
				});
				month = monthFormat;
			}
			if (week !== dayFormat) {
				weekData.push({
					time: dayFormat,
					value: +m.price
				});
				week = dayFormat;
			}
			if (day !== dayFormat) {
				dayData.push({
					time: dayFormat,
					value: +m.price
				});
				day = dayFormat;
			}
		})

		const mapData: any = [
			['1D', dayData],
			['7D', weekData]
		];
		const intervalData: string[] = [...intervals];

		if (monthData.length > 1) {
			intervalData.push('1D');
			mapData.push(['1M', monthData]);
		}
		if (yearData.length > 1) {
			intervalData.push('YTD');
			mapData.push(['YTD', yearData]);
		}

		setIntervals(intervalData)
		// @ts-ignore
		setSeriesData(new Map(mapData))
	}, [data])

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
				if (!filterDisable) {
        	document?.getElementById('price_chart')?.appendChild(switcherElement);
				}

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
    }, [seriesesData, intervals, width, height, filterDisable])

    return (
		
		<div ref={containerRef} id="price_chart" className={classes.root} style={{ width: '100%' }}>
            <Box display="flex" flexDirection="column" className={classes.titleBox}>
                <span className={classes.title}>{title}</span>
                <span className={classes.date}>{subTitle}</span>
            </Box>
        </div>
    )
}
