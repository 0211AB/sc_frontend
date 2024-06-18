import React from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const colors = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'];

const ChartThree = ({ details }) => {
  const total = details.reduce((total, d) => total + Number(d.productCount), 0)

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Category Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <span className="absolute right-3 top-5 z-10 -translate-y-1/2">
              Products belonging to each category
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={{ ...options, labels: details.map(d => d.categoryName) }}
            series={details.map(d => Number(d.productCount))}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {details.map((d, index) => {
          return <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-[${colors[index % 4]}]`}></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span className='capitalize'> {d.categoryName}</span>
                <span> {Math.floor(d.productCount/total*100)} %</span>
              </p>
            </div>
          </div>
        })}
      </div>
    </div>
  );
};

export default ChartThree;
