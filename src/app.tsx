import React from "react";
import {apiClient} from "./utils/apiClient";
import {StockForecast} from "./types/StockForecast";
import {AgGridReact} from "ag-grid-react";
import {StockSummaryModal} from "./components/StockSummaryModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
                eps_ttm: Number(item.eps_ttm),
                pe_high: Number(item.pe_high),
                pe_avg: Number(item.pe_avg),
                pe_low: Number(item.pe_low),
                pe_high_forecast: Number(item.pe_high_forecast),
                pe_avg_forecast: Number(item.pe_avg_forecast),
                pe_low_forecast: Number(item.pe_low_forecast),
                pe_forecast_discount: Number(item.pe_forecast_discount),
                sps_ttm: Number(item.sps_ttm),
                ps_low: Number(item.ps_low),
                ps_avg: Number(item.ps_avg),
                ps_high: Number(item.ps_high),
                ps_high_forecast: Number(item.ps_high_forecast),
                ps_avg_forecast: Number(item.ps_avg_forecast),
                ps_low_forecast: Number(item.ps_low_forecast),
                ps_forecast_discount: Number(item.ps_forecast_discount),
                nav_ttm: Number(item.nav_ttm),
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                pb_high_forecast: Number(item.pb_high_forecast),
                pb_avg_forecast: Number(item.pb_avg_forecast),
                pb_low_forecast: Number(item.pb_low_forecast),
                pb_forecast_discount: Number(item.pb_forecast_discount),
                ocf_ttm: Number(item.ocf_ttm),
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
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

    const discountCellStyle = params => {
        const value = Number(params.value);
        if (value <= 0.8 && value >= 0) {
            return {backgroundColor: "#a6e194"};
        } else if (value > 1 && value <= 1.5) {
            return {backgroundColor: "#f3c08b"};
        } else if (value > 1.5) {
            return {backgroundColor: "#f08e8d"};
        }
        return null;
    };

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
                    columnDefs={[
                        {field: "symbol", pinned: "left", headerName: "代碼", filter: true, width: 100},
                        {field: "price", headerName: "股價", pinned: "left", type: "rightAligned", width: 100},
                        {field: "volume", headerName: "成交量", type: "rightAligned", width: 150},
                        {field: "market_cap", headerName: "市值", type: "rightAligned", width: 150},

                        {field: "pe_forecast_discount", headerName: "P/E 股價折現", type: "rightAligned", cellStyle: discountCellStyle, width: 120},
                        {field: "ps_forecast_discount", headerName: "P/S 股價折現", type: "rightAligned", cellStyle: discountCellStyle, width: 120},
                        {field: "pb_forecast_discount", headerName: "P/B 股價折現", type: "rightAligned", cellStyle: discountCellStyle, width: 120},
                        {field: "pocf_forecast_discount", headerName: "P/OCF 股價折現", type: "rightAligned", cellStyle: discountCellStyle, width: 140},

                        {field: "eps_ttm", headerName: "每股盈利", type: "rightAligned", width: 100},
                        {field: "pe_high", headerName: "極值 P/E", type: "rightAligned", width: 100},
                        {field: "pe_avg", headerName: "均值 P/E", type: "rightAligned", width: 100},
                        {field: "pe_low", headerName: "殘值 P/E", type: "rightAligned", width: 100},
                        {field: "pe_high_forecast", headerName: "極值 P/E 股價", type: "rightAligned", width: 120},
                        {field: "pe_avg_forecast", headerName: "均值 P/E 股價", type: "rightAligned", width: 120},
                        {field: "pe_low_forecast", headerName: "殘值 P/E 股價", type: "rightAligned", width: 120},

                        {field: "sps_ttm", headerName: "每股營收", type: "rightAligned", width: 100},
                        {field: "ps_high", headerName: "極值 P/S", type: "rightAligned", width: 100},
                        {field: "ps_avg", headerName: "均值 P/S", type: "rightAligned", width: 100},
                        {field: "ps_low", headerName: "殘值 P/S", type: "rightAligned", width: 100},
                        {field: "ps_high_forecast", headerName: "極值 P/S 股價", type: "rightAligned", width: 120},
                        {field: "ps_avg_forecast", headerName: "均值 P/S 股價", type: "rightAligned", width: 120},
                        {field: "ps_low_forecast", headerName: "殘值 P/S 股價", type: "rightAligned", width: 120},

                        {field: "nav_ttm", headerName: "每股淨值", type: "rightAligned", width: 100},
                        {field: "pb_high", headerName: "極值 P/B", type: "rightAligned", width: 100},
                        {field: "pb_avg", headerName: "均值 P/B", type: "rightAligned", width: 100},
                        {field: "pb_low", headerName: "殘值 P/B", type: "rightAligned", width: 100},
                        {field: "pb_high_forecast", headerName: "極值 P/B 股價", type: "rightAligned", width: 120},
                        {field: "pb_avg_forecast", headerName: "均值 P/B 股價", type: "rightAligned", width: 120},
                        {field: "pb_low_forecast", headerName: "殘值 P/B 股價", type: "rightAligned", width: 120},

                        {field: "ocf_ttm", headerName: "每股營運現金流", type: "rightAligned", width: 130},
                        {field: "pocf_high", headerName: "極值 P/OCF", type: "rightAligned", width: 120},
                        {field: "pocf_avg", headerName: "均值 P/OCF", type: "rightAligned", width: 120},
                        {field: "pocf_low", headerName: "殘值 P/OCF", type: "rightAligned", width: 120},
                        {field: "pocf_high_forecast", headerName: "極值 P/OCF 股價", type: "rightAligned", width: 140},
                        {field: "pocf_avg_forecast", headerName: "均值 P/OCF 股價", type: "rightAligned", width: 140},
                        {field: "pocf_low_forecast", headerName: "殘值 P/OCF 股價", type: "rightAligned", width: 140},
                    ]}
                />
            </div>
            <StockSummaryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </React.Fragment>
    );
});
