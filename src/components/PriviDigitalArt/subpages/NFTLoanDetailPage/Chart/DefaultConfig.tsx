const DefaultConfig = {
  config: {
    data: {
      labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      datasets: [
        {
          type: "line",
          label: "$",
          data: [],
          pointRadius: 2,
          backgroundColor: "#FFFFFF",
          borderColor: "#9EACF2",
          pointBackgroundColor: "#9EACF2",
          hoverBackgroundColor: "#9EACF2",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 2,
          cubicInterpolationMode: "monotone",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#FFFFFF",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(158, 172, 242, 0.09)",
              lineWidth: 60,
            },
            ticks: {
              display: false,
              beginAtZero: false,
              fontColor: "#707582",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "#9caaf233",
              lineWidth: 1,
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `Bid: ${tooltipItem.yLabel}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "#00FF15",
        bodyFontSize: 15,
        bodyFontColor: "white",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
  configurer: (config: any, ref: CanvasRenderingContext2D): object => {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(0, "#9EACF2");
    gradient.addColorStop(0.3, "rgba(158, 152, 252, 0.3)");
    gradient.addColorStop(0.6, "rgba(158, 172, 242, 0)");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

export default DefaultConfig;
