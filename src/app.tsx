import React from "react";
import {apiClient} from "./utils/apiClient";
import {StockForecast} from "./types/StockForecast";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export const App = React.memo(() => {
    const [forecasts, setForecasts] = React.useState<StockForecast[]>([]);

    const fetchData = async () => {
        const response = await apiClient.get("/stock_forecasts");
        setForecasts(response.data);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const discountCellStyle = params => {
        const value = Number(params.value);
        if (value <= 0.5 && value >= 0) {
            return {backgroundColor: "#a6e194"};
        } else if (value > 1 && value <= 1.5) {
            return {backgroundColor: "#f3c08b"};
        } else if (value > 1.5) {
            return {backgroundColor: "#f08e8d"};
        }
        return null;
    };

    return (
        <div className="ag-theme-quartz" style={{height: "calc(100vh - 20px)"}}>
            <AgGridReact
                loading={forecasts.length === 0}
                rowData={forecasts}
                columnDefs={[
                    {field: "symbol", pinned: "left", headerName: "代碼", filter: true},
                    {field: "price", headerName: "股價", pinned: "left"},
                    {field: "volume", headerName: "成交量"},
                    {field: "market_cap", headerName: "市值"},

                    {field: "eps_ttm", headerName: "每股盈利"},
                    {field: "pe_high", headerName: "極值 P/E"},
                    {field: "pe_low", headerName: "殘值 P/E"},
                    {field: "pe_high_forecast", headerName: "極值 P/E 股價"},
                    {field: "pe_low_forecast", headerName: "殘值 P/E 股價"},
                    {field: "pe_forecast_discount", headerName: "P/E 股價折現", cellStyle: discountCellStyle},

                    {field: "sps_ttm", headerName: "每股營收"},
                    {field: "ps_low", headerName: "殘值 P/S"},
                    {field: "ps_high", headerName: "極值 P/S"},
                    {field: "ps_high_forecast", headerName: "極值 P/S 股價"},
                    {field: "ps_low_forecast", headerName: "殘值 P/S 股價"},
                    {field: "ps_forecast_discount", headerName: "P/S 股價折現", cellStyle: discountCellStyle},

                    {field: "nav_ttm", headerName: "每股淨值"},
                    {field: "pb_high", headerName: "極值 P/B"},
                    {field: "pb_low", headerName: "殘值 P/B"},
                    {field: "pb_high_forecast", headerName: "極值 P/B 股價"},
                    {field: "pb_low_forecast", headerName: "殘值 P/B 股價"},
                    {field: "pb_forecast_discount", headerName: "P/B 股價折現", cellStyle: discountCellStyle},

                    {field: "ocf_ttm", headerName: "每股營運現金流"},
                    {field: "pocf_high", headerName: "極值 P/OCF"},
                    {field: "pocf_low", headerName: "殘值 P/OCF"},
                    {field: "pocf_high_forecast", headerName: "極值 P/OCF 股價"},
                    {field: "pocf_low_forecast", headerName: "殘值 P/OCF 股價"},
                    {field: "pocf_forecast_discount", headerName: "P/OCF 股價折現", cellStyle: discountCellStyle},
                ]}
            />
        </div>
    );
});
