import React from "react";
import {apiClient} from "./utils/apiClient";
import {StockForecast} from "./types/StockForecast";
import {AgGridReact} from "ag-grid-react";
import {StockSummaryModal} from "./components/StockSummaryModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {findGrowthRateByPE} from "./utils/growthRateToPE";
import {ColDef} from "ag-grid-community";

export const App = React.memo(() => {
    const [forecasts, setForecasts] = React.useState<StockForecast[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<StockForecast | null>(null);

    const fetchData = async () => {
        const response = await apiClient.get("/stock_forecasts");
        setForecasts(
            response.data.map((item: StockForecast) => ({
                symbol: item.symbol,
                price: Number(item.price),
                volume: Number(item.volume),
                market_cap: Number(item.market_cap),
                roe_ttm: Number(item.roe_ttm),
                eps_ttm: Number(item.eps_ttm),
                pe_high: Number(item.pe_high),
                pe_avg: Number(item.pe_avg),
                pe_low: Number(item.pe_low),
                pe_current: (Number(item.price) / Number(item.eps_ttm)).toFixed(2),
                pe_high_forecast: Number(item.pe_high_forecast),
                pe_avg_forecast: Number(item.pe_avg_forecast),
                pe_low_forecast: Number(item.pe_low_forecast),
                pe_forecast_discount: Number(item.pe_forecast_discount),
                sps_ttm: Number(item.sps_ttm),
                ps_high: Number(item.ps_high),
                ps_avg: Number(item.ps_avg),
                ps_low: Number(item.ps_low),
                ps_current: (Number(item.price) / Number(item.sps_ttm)).toFixed(2),
                ps_high_forecast: Number(item.ps_high_forecast),
                ps_avg_forecast: Number(item.ps_avg_forecast),
                ps_low_forecast: Number(item.ps_low_forecast),
                ps_forecast_discount: Number(item.ps_forecast_discount),
                nav_ttm: Number(item.nav_ttm),
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                pb_current: (Number(item.price) / Number(item.nav_ttm)).toFixed(2),
                pb_high_forecast: Number(item.pb_high_forecast),
                pb_avg_forecast: Number(item.pb_avg_forecast),
                pb_low_forecast: Number(item.pb_low_forecast),
                pb_forecast_discount: Number(item.pb_forecast_discount),
                ocf_ttm: Number(item.ocf_ttm),
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
                pocf_current: (Number(item.price) / Number(item.ocf_ttm)).toFixed(2),
                pocf_high_forecast: Number(item.pocf_high_forecast),
                pocf_avg_forecast: Number(item.pocf_avg_forecast),
                pocf_low_forecast: Number(item.pocf_low_forecast),
                pocf_forecast_discount: Number(item.pocf_forecast_discount),
            }))
        );
    };

    React.useEffect(() => {
        fetchData();
    }, []);

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
            {field: "volume", headerName: "成交量", type: "rightAligned", filter: "agNumberColumnFilter", filterParams: {filterOptions: ["greaterThan"]}, width: 150},
            {field: "market_cap", headerName: "市值", type: "rightAligned", filter: "agNumberColumnFilter", filterParams: {filterOptions: ["greaterThan"]}, width: 150},
            {field: "roe_ttm", headerName: "ROE", type: "rightAligned", filter: "agNumberColumnFilter", filterParams: {filterOptions: ["greaterThan"]}, width: 100},

            {field: "pe_forecast_discount", headerName: "P/E 股價折現", type: "rightAligned", cellStyle: ratioCellStyle(), width: 120},
            {field: "ps_forecast_discount", headerName: "P/S 股價折現", type: "rightAligned", cellStyle: ratioCellStyle(), width: 120},
            {field: "pb_forecast_discount", headerName: "P/B 股價折現", type: "rightAligned", cellStyle: ratioCellStyle(), width: 120},
            {field: "pocf_forecast_discount", headerName: "P/OCF 股價折現", type: "rightAligned", cellStyle: ratioCellStyle(), width: 140},

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
                    {field: "pe_high", headerName: "極值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                    {field: "pe_avg", headerName: "均值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                    {field: "pe_low", headerName: "殘值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                ],
            },
            {
                headerName: "P/E 股價預測",
                children: [
                    {field: "price", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pe_avg_forecast))},
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
                    {field: "ps_current", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.ps_current) / Number(data.ps_avg))},
                    {field: "ps_high", headerName: "極值", type: "rightAligned", width: 100},
                    {field: "ps_avg", headerName: "均值", type: "rightAligned", width: 100},
                    {field: "ps_low", headerName: "殘值", type: "rightAligned", width: 100},
                ],
            },
            {
                headerName: "P/S 股價預測",
                children: [
                    {field: "price", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.ps_avg_forecast))},
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
                    {field: "pb_current", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.pb_current) / Number(data.pb_avg))},
                    {field: "pb_high", headerName: "極值", type: "rightAligned", width: 100},
                    {field: "pb_avg", headerName: "均值", type: "rightAligned", width: 100},
                    {field: "pb_low", headerName: "殘值", type: "rightAligned", width: 100},
                ],
            },
            {
                headerName: "P/B 股價預測",
                children: [
                    {field: "price", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pb_avg_forecast))},
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
                    {field: "pocf_current", headerName: "現值", type: "rightAligned", width: 130, cellStyle: ratioCellStyle((_, data) => Number(data.pocf_current) / Number(data.pocf_avg))},
                    {field: "pocf_high", headerName: "極值", type: "rightAligned", width: 130},
                    {field: "pocf_avg", headerName: "均值", type: "rightAligned", width: 130},
                    {field: "pocf_low", headerName: "殘值", type: "rightAligned", width: 130},
                ],
            },
            {
                headerName: "P/OCF 股價預測",
                children: [
                    {field: "price", headerName: "現值", type: "rightAligned", width: 100, cellStyle: ratioCellStyle((_, data) => Number(data.price) / Number(data.pocf_avg_forecast))},
                    {field: "pocf_high_forecast", headerName: "極值", type: "rightAligned", width: 140},
                    {field: "pocf_avg_forecast", headerName: "均值", type: "rightAligned", width: 140},
                    {field: "pocf_low_forecast", headerName: "殘值", type: "rightAligned", width: 140},
                ],
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div className="ag-theme-quartz" style={{height: "calc(100vh - 20px)"}}>
                <AgGridReact
                    loading={forecasts.length === 0}
                    rowData={forecasts}
                    onRowClicked={event => {
                        if (event.data) {
                            setSelectedItem(event.data);
                        }
                    }}
                    columnDefs={columnDefs}
                />
            </div>
            <StockSummaryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </React.Fragment>
    );
});
