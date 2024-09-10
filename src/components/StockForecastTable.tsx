import React from "react";
import {StockForecast} from "../types/StockForecast";
import {AgGridReact} from "ag-grid-react";
import {ColDef, RowClickedEvent} from "ag-grid-community";
import millify from "millify";
import {findGrowthRateByPE, findPEByGrowthRate} from "../utils/growthRateToPE";

interface Props {
    stockForecasts: StockForecast[];
    onRowClicked: (event: RowClickedEvent<StockForecast>) => void;
}

export const StockForecastTable = React.memo<Props>(({stockForecasts, onRowClicked}) => {
    const ratioCellStyle = (valueFunction?: (value: number, data: StockForecast) => number) => params => {
        if (!params.data) {
            return null;
        }

        const value = valueFunction ? valueFunction(params.value, params.data) : params.value;
        if (value < 0) {
            return {backgroundColor: "#ccc"};
        } else if (value <= 1 && value > 0) {
            return {backgroundColor: "#a6e194"};
        } else if (value > 1 && value <= 1.5) {
            return {backgroundColor: "#f3c08b"};
        } else if (value > 1.5) {
            return {backgroundColor: "#f08e8d"};
        }
    };

    const growthRateTooltipValueGetter = params => `代表增長率: ${findGrowthRateByPE(Number(params.value))}%`;

    const columnDefs = React.useMemo<ColDef<StockForecast>[]>(
        () => [
            {field: "symbol", pinned: "left", headerName: "代碼", filter: true, width: 100},
            {field: "price", headerName: "股價", type: "rightAligned", width: 100},
            {
                field: "volume",
                headerName: "成交量",
                type: "rightAligned",
                filter: "agNumberColumnFilter",
                filterParams: {filterOptions: ["greaterThan"]},
                valueFormatter: params => millify(params.value),
                width: 100,
            },
            {
                field: "market_cap",
                headerName: "市值",
                type: "rightAligned",
                filter: "agNumberColumnFilter",
                filterParams: {filterOptions: ["greaterThan"]},
                valueFormatter: params => millify(params.value),
                width: 100,
            },
            {
                field: "roe_ttm",
                headerName: "ROE",
                type: "rightAligned",
                filter: "agNumberColumnFilter",
                filterParams: {filterOptions: ["greaterThan"]},
                valueFormatter: params => `${Number(params.value * 100).toFixed(2)}%`,
                width: 100,
            },
            {
                field: "net_profit_margin_ttm",
                headerName: "純利率",
                type: "rightAligned",
                filter: "agNumberColumnFilter",
                filterParams: {filterOptions: ["greaterThan"]},
                valueFormatter: params => `${Number(params.value * 100).toFixed(2)}%`,
                width: 100,
            },

            {
                field: "average_eps_growth",
                headerName: "平均增長率",
                type: "rightAligned",
                filter: "agNumberColumnFilter",
                filterParams: {filterOptions: ["greaterThan"]},
                valueFormatter: params => `${params.value}%`,
                tooltipValueGetter: params => `合理 P/E: ${findPEByGrowthRate(Math.round(params.value))}`,
                width: 130,
            },

            {
                field: "pe_forecast_discount",
                headerName: "P/E 股價折現",
                type: "rightAligned",
                cellStyle: ratioCellStyle(),
                width: 120,
            },
            {
                field: "ps_forecast_discount",
                headerName: "P/S 股價折現",
                type: "rightAligned",
                cellStyle: ratioCellStyle(),
                width: 120,
            },
            {
                field: "pb_forecast_discount",
                headerName: "P/B 股價折現",
                type: "rightAligned",
                cellStyle: ratioCellStyle(),
                width: 120,
            },
            {
                field: "pocf_forecast_discount",
                headerName: "P/OCF 股價折現",
                type: "rightAligned",
                cellStyle: ratioCellStyle(),
                width: 140,
            },

            {
                headerName: "P/E 值",
                type: "centerAligned",
                children: [
                    {field: "eps_ttm", headerName: "每股盈利", type: "rightAligned", width: 100},
                    {
                        field: "pe_current",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.pe_current) / Number(data.pe_avg)),
                        tooltipValueGetter: growthRateTooltipValueGetter,
                    },
                    {
                        field: "pe_high",
                        headerName: "極值",
                        type: "rightAligned",
                        width: 100,
                        tooltipValueGetter: growthRateTooltipValueGetter,
                    },
                    {
                        field: "pe_avg",
                        headerName: "均值",
                        type: "rightAligned",
                        width: 100,
                        tooltipValueGetter: growthRateTooltipValueGetter,
                    },
                    {
                        field: "pe_low",
                        headerName: "殘值",
                        type: "rightAligned",
                        width: 100,
                        tooltipValueGetter: growthRateTooltipValueGetter,
                    },
                ],
            },
            {
                headerName: "P/E 股價預測",
                children: [
                    {
                        field: "price",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pe_avg_forecast)),
                    },
                    {field: "pe_high_forecast", headerName: "極值", type: "rightAligned", width: 120},
                    {field: "pe_avg_forecast", headerName: "均值", type: "rightAligned", width: 120},
                    {field: "pe_low_forecast", headerName: "殘值", type: "rightAligned", width: 120},
                ],
            },

            {
                headerName: "P/S 值",
                type: "centerAligned",
                children: [
                    {field: "sps_ttm", headerName: "每股營收", type: "rightAligned", width: 100},
                    {
                        field: "ps_current",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.ps_current) / Number(data.ps_avg)),
                    },
                    {field: "ps_high", headerName: "極值", type: "rightAligned", width: 100},
                    {field: "ps_avg", headerName: "均值", type: "rightAligned", width: 100},
                    {field: "ps_low", headerName: "殘值", type: "rightAligned", width: 100},
                ],
            },
            {
                headerName: "P/S 股價預測",
                children: [
                    {
                        field: "price",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.ps_avg_forecast)),
                    },
                    {field: "ps_high_forecast", headerName: "極值", type: "rightAligned", width: 120},
                    {field: "ps_avg_forecast", headerName: "均值", type: "rightAligned", width: 120},
                    {field: "ps_low_forecast", headerName: "殘值", type: "rightAligned", width: 120},
                ],
            },

            {
                headerName: "P/B 值",
                type: "centerAligned",
                children: [
                    {field: "nav_ttm", headerName: "每股淨值", type: "rightAligned", width: 100},
                    {
                        field: "pb_current",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.pb_current) / Number(data.pb_avg)),
                    },
                    {field: "pb_high", headerName: "極值", type: "rightAligned", width: 100},
                    {field: "pb_avg", headerName: "均值", type: "rightAligned", width: 100},
                    {field: "pb_low", headerName: "殘值", type: "rightAligned", width: 100},
                ],
            },
            {
                headerName: "P/B 股價預測",
                children: [
                    {
                        field: "price",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pb_avg_forecast)),
                    },
                    {field: "pb_high_forecast", headerName: "極值", type: "rightAligned", width: 120},
                    {field: "pb_avg_forecast", headerName: "均值", type: "rightAligned", width: 120},
                    {field: "pb_low_forecast", headerName: "殘值", type: "rightAligned", width: 120},
                ],
            },

            {
                headerName: "P/OCF 值",
                type: "centerAligned",
                children: [
                    {field: "ocf_ttm", headerName: "每股營運現金流", type: "rightAligned", width: 130},
                    {
                        field: "pocf_current",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 130,
                        cellStyle: ratioCellStyle((_, data) => Number(data.pocf_current) / Number(data.pocf_avg)),
                    },
                    {field: "pocf_high", headerName: "極值", type: "rightAligned", width: 130},
                    {field: "pocf_avg", headerName: "均值", type: "rightAligned", width: 130},
                    {field: "pocf_low", headerName: "殘值", type: "rightAligned", width: 130},
                ],
            },
            {
                headerName: "P/OCF 股價預測",
                children: [
                    {
                        field: "price",
                        headerName: "現值",
                        type: "rightAligned",
                        width: 100,
                        cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pocf_avg_forecast)),
                    },
                    {field: "pocf_high_forecast", headerName: "極值", type: "rightAligned", width: 140},
                    {field: "pocf_avg_forecast", headerName: "均值", type: "rightAligned", width: 140},
                    {field: "pocf_low_forecast", headerName: "殘值", type: "rightAligned", width: 140},
                ],
            },
        ],
        []
    );

    return (
        <div className="ag-theme-quartz" style={{height: "calc(100vh - 20px)"}}>
            <AgGridReact loading={stockForecasts.length === 0} rowData={stockForecasts} onRowClicked={onRowClicked} columnDefs={columnDefs} />
        </div>
    );
});
