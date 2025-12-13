import { type FC, Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import Select from 'react-select';

interface OrderCompletionChartProps {
    categories: string[];
    series:
        | {
              name?: string;
              type?: string;
              color?: string;
              group?: string;
              hidden?: boolean;
              zIndex?: number;
              data:
                  | (number | null)[]
                  | {
                        x: any;
                        y: any;
                        fill?: ApexFill;
                        fillColor?: string;
                        strokeColor?: string;
                        meta?: any;
                        goals?: any;
                        barHeightOffset?: number;
                        columnWidthOffset?: number;
                    }[]
                  | [number, number | null][]
                  | [number, (number | null)[]][]
                  | number[][];
          }[]
        | number[];
    timeSerieValue?: string;
    setTimeSerieValue?: (value: string) => void;
}

const OrderCompletionChart: FC<OrderCompletionChartProps> = ({ categories, series, timeSerieValue, setTimeSerieValue }) => {
    const timeSerieOptions: { label: string; value: string }[] = [
        {
            label: '15 minutes',
            value: '15',
        },
        {
            label: '30 minutes',
            value: '30',
        },
        {
            label: '1 hour',
            value: '60',
        },
        {
            label: '2 hours',
            value: '120',
        },
        {
            label: '3 hours',
            value: '180',
        },
        {
            label: '6 hours',
            value: '360',
        },
        {
            label: '12 hours',
            value: '720',
        },
        {
            label: '1 day',
            value: '1440',
        },
        {
            label: '2 days',
            value: '2880',
        },
        {
            label: '3 days',
            value: '4320',
        },
        {
            label: '5 days',
            value: '7200',
        },
        {
            label: '7 days',
            value: '10080',
        },
        {
            label: '14 days',
            value: '20160',
        },
        {
            label: '30 days',
            value: '43200',
        },
    ];

    return (
        <Fragment>
            <Select
                isClearable={false}
                isMulti={false}
                options={timeSerieOptions}
                value={timeSerieOptions.find((option) => option.value === timeSerieValue) ?? null}
                onChange={(option) => {
                    if (setTimeSerieValue && option) {
                        setTimeSerieValue(option.value);
                    }
                }}
                className="w-full mb-4"
                placeholder="Select time serie"
                styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
                components={{ IndicatorSeparator: () => null }}
            />

            <ReactApexChart
                options={{
                    chart: {
                        height: 360,
                        type: 'bar',
                        fontFamily: 'Nunito, sans-serif',
                        toolbar: {
                            show: false,
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        width: 2,
                        colors: ['transparent'],
                    },
                    colors: ['#FCD77F'],
                    // @ts-ignore
                    dropShadow: {
                        enabled: true,
                        blur: 3,
                        color: '#515365',
                        opacity: 0.4,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            borderRadius: 8,
                            borderRadiusApplication: 'end',
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                        fontSize: '14px',
                        itemMargin: {
                            horizontal: 8,
                            vertical: 8,
                        },
                    },
                    grid: {
                        borderColor: '#e0e6ed',
                        padding: {
                            left: 20,
                            right: 20,
                        },
                        xaxis: {
                            lines: {
                                show: false,
                            },
                        },
                    },
                    xaxis: {
                        categories: categories,
                        axisBorder: {
                            show: true,
                            color: '#e0e6ed',
                        },
                        tooltip: {
                            formatter: (value) => {
                                return `${value} Orders`;
                            },
                        },
                    },
                    yaxis: {
                        tickAmount: 6,
                        opposite: false,
                        labels: {
                            offsetX: 0,
                            formatter: (value) => {
                                return `${value}%`;
                            },
                        },
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'light',
                            type: 'vertical',
                            shadeIntensity: 0.3,
                            inverseColors: false,
                            opacityFrom: 1,
                            opacityTo: 0.8,
                            stops: [0, 100],
                        },
                    },
                    tooltip: {
                        marker: {
                            show: true,
                        },
                    },
                }}
                series={series}
                type="bar"
                height={360}
                className="overflow-hidden"
            />
        </Fragment>
    );
};

export default OrderCompletionChart;
