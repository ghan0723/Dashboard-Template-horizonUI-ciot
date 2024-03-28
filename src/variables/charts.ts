import { ApexOptions } from 'apexcharts';

type ApexGeneric = ApexOptions & any;

export const barChartDataDailyTraffic = [
  {
    name: '주민번호',
    data: [20, 30, 40, 20, 45, 50, 30],
  },
  {
    name: '핸드폰번호',
    data: [30, 40, 50, 60, 75, 80, 90],
  },
  {
    name: '이력서',
    data: [50, 70, 90, 100, 65, 70, 90],
  },
];

export const barChartOptionsDailyTraffic = (props?: string[]): ApexGeneric => {
  return {
    chart: {
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: props,
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '14px',
          fontWeight: '500',
        },
        formatter : function(val:string) {
          // val은 categories 배열의 각 항목을 나타냄
          if (val.length > 10) { // 레이블의 길이가 10자를 넘으면
            return val.substring(0, 10) + '...'; // 처음 10자만 표시하고 "..." 추가
          } else {
            return val; // 그 외의 경우는 원래 값을 그대로 반환
          }
        }
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      tooltip : {
        enabled : false
      }
    },
    yaxis: {
      show: true,
      color: 'black',
      labels: {
        show: true,
        style: {
          colors: '#CBD5E0',
          fontSize: '14px',
        },
      },
    },
    tooltip: {
      x: {
        show: true,
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w }: { series: any; seriesIndex: number; dataPointIndex: number; w: any; }) {
          // props가 제공되지 않았을 경우를 대비한 검사
          if (!props) return "";
          // 전체 'categories' 배열에서 현재 데이터 포인트의 인덱스에 해당하는 값을 반환
          return props[dataPointIndex] || '';
        }
      },
      style: {
        fontSize: '16px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '16px',
          fontFamily: undefined,
        },
        formatter: function(val:any) {
          return val; // 전체 텍스트를 툴팁으로 반환
        }
      },
      theme: 'dark',
    },
    grid: {
      show: true,
      strokeDashArray: 10,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      colors: ['#2099EC', '#0AD993', '#FFCB00', "#FF4560", "#AB92E5"],
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: ['13px', '13px'],
      },
    },
  };
};

export const radialBarChartData = [
  {
    name: 'PRODUCT A',
    data: [70],
  },
  {
    name: 'PRODUCT B',
    data: [90],
  },
];

export const radialBarChartOptions = (props?: string[]): ApexGeneric => {
  return {
    chart: {
      type: 'radialBar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          showOn: 'always',
          name: {
            show: true,
            fontSize: '18px',
            fontWeight: 'bold',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '16px',
            offsetY: 5,
          },
        },
      },
    },
    colors: ['#5E37FF', '#6AD2FF'],
    labels: ['PRODUCT A', 'PRODUCT B'],
    legend: {
      show: false,
    },
  };
};

export const barChartOptionsConsumption = (props?: string[]): ApexGeneric => {
  return {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
      },
      theme: 'dark',
    },
    xaxis: {
      categories: props,
      show: true,
      labels: {
        show: false,
        style: {
          // colors: ['#3498db','#e74c3c','#2ecc71','#9b59b6','#e67e22','#95a5a6','#27ae60','#f368e0','#87CEEB','#00CED1'],
          fontSize: '5px',
          fontWeight: '100',
        },
        maxWidth: 50, // 최대 너비 제한
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: true,
      color: 'black',
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
    },

    grid: {
      borderColor: 'rgba(163, 174, 208, 0.3)',
      show: true,
      yaxis: {
        lines: {
          show: true,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#ff7473', '#ffc952', '#60c5ba', '#47b8e0', '#6C49B8'],
    },
    legend: {
      show: true,
    },
    colors: ['#ff7473', '#ffc952', '#60c5ba', '#47b8e0', '#6C49B8'],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '15px',
        distributed: true,
      },
    },
  };
};

export const barChartDataConsumption = [
  {
    name: '압축 Size',
    data: [250, 100, 150, 700, 600],
  },
  {
    name: '일반 Size',
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380],
  },
];

// 파일 사이즈를 바이트에서 MB로 변환하는 함수
function bytesToMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

export const FileSizeChartOptions = (props?: number[]): ApexGeneric => {
  // 바이트를 MB로 변환하여 새로운 배열을 생성
  const mbProps = props?.map(bytesToMB);

  return {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
        },
      },
      theme: 'dark',
    },
    xaxis: {
      categories: props,
      show: true,
      labels: {
        show: true,
        style: {
          // colors: ['#3498db','#e74c3c','#2ecc71','#9b59b6','#e67e22','#95a5a6','#27ae60','#f368e0','#87CEEB','#00CED1'],
          fontSize: '12px',
          fontWeight: '100',
        },
        maxWidth: 50, // 최대 너비 제한
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: true,
      color: 'black',
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
        formatter: function(value:any) {
          return bytesToMB(value);
        },
      },
    },

    grid: {
      borderColor: 'rgba(163, 174, 208, 0.3)',
      show: true,
      yaxis: {
        lines: {
          show: true,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: 'solid',
      colors: ['#ff7473', '#ffc952'],
    },
    legend: {
      show: true,
    },
    colors: ['#ff7473', '#ffc952'],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '15px',
        distributed: false,
      },
    },
  };
};

export const pieChartOptions = (props?: string[]): ApexGeneric => {
  return {
    labels: props,
    colors: ['#0086FF', '#00EC93', '#FFB000', '#FF1752', '#814AD6'],
    chart: {
      type: 'donut',
      width: '100%',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    legend: {
      show: true,
      position: 'right',
      width: 100,
      height: 100,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: '100',
      },
    },
    hover: { mode: null },
    plotOptions: {
      pie: {
        expandOnClick: false,
        customScale: 1,
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              fontSize: '12px',
            },
            value: {
              fontSize: '25px',
              fontWeight: '700',
            },
          },
        },
      },
    },
    fill: {
      colors: ['#0086FF', '#00EC93', '#FFB000', '#FF1752', '#814AD6'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
    },
  };
};

export const pieChartData = [63, 25, 12];

// Total Spent Default

export const lineChartDataTotalSpent = [
  {
    name: 'Revenue',
    data: [50, 64, 48, 66, 49, 68, 100, 50, 70, 80, 9, 20],
  },
  {
    name: 'Profit',
    data: [30, 40, 24, 46, 20, 46, 70, 50, 60, 80, 90, 100],
  },
  {
    name: 'kakao',
    data: [25, 30, 34, 36, 10, 26, 100, 20, 50, 60, 70, 30],
  },
];

export const lineChartOptionsTotalSpent = (props?: any[]): ApexOptions => {
  return {
    chart: {
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF',
      },
    },
    // colors: ['#4318FF', '#39B8FF', '#FF0000', '#FF0000'], // 선색
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6'], // 선색
    markers: {
      size: 0,
      colors: 'white',
      strokeColors: '#000000',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: 'dark',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      // type: "line",
    },
    xaxis: {
      // type: "numeric",
      // categories: props,
      categories: props,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      column: {
        opacity: 0.5,
      },
    },
  };
};

// 파일 사이즈를 바이트에서 MB로 변환하는 함수
function averageToLeak(average: number): string {
  return (average) + '건';
}

export const lineChartOptionsAverage = (props?: number[]): ApexOptions => {
  return {
    chart: {
      toolbar: {
        show: true,
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#4318FF',
      },
    },
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6'], // 선색
    markers: {
      size: 0,
      colors: 'white',
      strokeColors: '#000000',
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      showNullDataPoints: true,
    },
    tooltip: {
      theme: 'dark',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      // type: "line",
    },
    xaxis: {
      categories: props,
      labels: {
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        style: {
          colors: '#A3AED0',
          fontSize: '12px',
          fontWeight: '500',
        },
        formatter: function(value:any) {
          return averageToLeak(value);
        },
      },
    },
    legend: {
      show: true,
    },
    grid: {
      show: true,
      column: {
        opacity: 0.5,
      },
    },
  };
};

// export const lineChartOptionsTotalSpent: ApexOptions = {
//   chart: {
//     toolbar: {
//       show: false,
//     },
//     dropShadow: {
//       enabled: true,
//       top: 13,
//       left: 0,
//       blur: 10,
//       opacity: 0.1,
//       color: '#4318FF',
//     },
//   },
//   colors: ['#4318FF', '#39B8FF', '#FF0000'], // 선색
//   markers: {
//     size: 0,
//     colors: 'white',
//     strokeColors: '#000000',
//     strokeWidth: 3,
//     strokeOpacity: 0.9,
//     strokeDashArray: 0,
//     fillOpacity: 1,
//     discrete: [],
//     shape: 'circle',
//     radius: 2,
//     offsetX: 0,
//     offsetY: 0,
//     showNullDataPoints: true,
//   },
//   tooltip: {
//     theme: 'dark',
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   stroke: {
//     curve: 'smooth',
//     // type: "line",
//   },
//   xaxis: {
//     // type: "numeric",
//     categories: ['1','2','3','4','5','6','7','8','9','10','11','12'],
//     labels: {
//       style: {
//         colors: '#A3AED0',
//         fontSize: '12px',
//         fontWeight: '500',
//       },
//     },
//     axisBorder: {
//       show: false,
//     },
//     axisTicks: {
//       show: false,
//     },
//   },
//   yaxis: {
//     show: false,
//   },
//   legend: {
//     show: false,
//   },
//   grid: {
//     show: false,
//     column: {
//       // color: ["#7551FF", "#39B8FF"],
//       opacity: 0.5,
//     },
//   },
//   // color: ["#7551FF", "#39B8FF"],
// };
