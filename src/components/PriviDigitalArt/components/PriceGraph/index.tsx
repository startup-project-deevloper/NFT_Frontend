import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { PriceGraphStyles } from "./index.styles";
import * as LightweightCharts from 'lightweight-charts';
import { Color } from "shared/ui-kit";
import { format, addDays, setMinutes, setHours, setSeconds, setMilliseconds } from "date-fns";

const intervals = ['1D', '7D', '1M', 'YTD'];

export default function PriceGraph({ data, title, subTitle }) {
    const classes = PriceGraphStyles();

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
	const isMobile = useMediaQuery(theme.breakpoints.down(700));
	const [seriesesData, setSeriesData] = useState<any>(null)
	const [timeVisible, setTimeVisible] = useState<boolean>(false);
	
	useEffect(() => {
		const dayData: any[] = [];
		const weekData: any[] = [];
		const monthData: any[] = [];
		const ystData: any[] = [];

		
		let hour = 0;
		let day = 0;
		let month = 0;
		let week = 0;
		const yesterday = addDays(new Date(), -1);
		const start = setSeconds(setMinutes(setHours(yesterday, 0), 0), 0);
		const end = setMilliseconds(setSeconds(setMinutes(setHours(yesterday, 23), 59), 59), 999);

		data.forEach((m) => {
			if (hour !== m.hour && m.hour > start && m.hour < end) {
				ystData.push({
					time: Math.floor(m.timestamp / 1000),
					value: +m.price
				});
				hour = m.hour;
			}

			if (day !== m.day) {
				dayData.push({
					time: format(new Date(m.timestamp), "yyyy-MM-dd"),
					value: +m.price
				});
				day = m.day;
			}

			if (month !== m.month) {
				monthData.push({
					time: format(new Date(m.timestamp), "yyyy-MM-dd"),
					value: +m.price
				});
				month = m.month;
			}
			if (week !== m.week) {
				weekData.push({
					time: format(new Date(m.timestamp), "yyyy-MM-dd"),
					value: +m.price
				});
				week = m.week;
			}
		})


		// @ts-ignore
		setSeriesData(new Map([
			['1D', dayData ],
			['7D', weekData ],
			['1M', monthData ],
			['YTD', ystData ],
		]))
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
            width: 1144,
            height: 405,
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
            },
            crosshair: {
                horzLine: {
                    visible: false,
                },
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
                topColor: 'rgba(76, 175, 80, 0.56)',
                bottomColor: 'rgba(76, 175, 80, 0.04)',
                lineColor: 'rgba(76, 175, 80, 1)',
                lineWidth: 2,
            });
            areaSeries.setData(seriesesData.get(interval));
        }

		if (seriesesData) {
			syncToInterval(intervals[0]);
		}
    }, [seriesesData, timeVisible])

    return (
        <Box id="price_chart" className={classes.root}>
            <Box display="flex" flexDirection="column" className={classes.titleBox}>
                <span className={classes.title}>{title}</span>
                <span className={classes.date}>{subTitle}</span>
            </Box>
        </Box>
    )
}
