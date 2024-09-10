import React from "react";
import {apiClient} from "./utils/apiClient";
import {StockForecast} from "./types/StockForecast";
import {StockSummaryModal} from "./components/StockSummaryModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {StockForecastTable} from "./components/StockForecastTable";

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
                net_profit_margin_ttm: Number(item.net_profit_margin_ttm),
                eps_growth: Number(item.eps_growth),
                average_eps_growth: Number(item.average_eps_growth),
                pe_high: Number(item.pe_high),
                pe_avg: Number(item.pe_avg),
                pe_low: Number(item.pe_low),
                pe_current: Number(item.pe_current),
                pe_high_forecast: Number(item.pe_high_forecast),
                pe_avg_forecast: Number(item.pe_avg_forecast),
                pe_low_forecast: Number(item.pe_low_forecast),
                pe_forecast_discount: Number(item.pe_forecast_discount),
                sps_ttm: Number(item.sps_ttm),
                ps_high: Number(item.ps_high),
                ps_avg: Number(item.ps_avg),
                ps_low: Number(item.ps_low),
                ps_current: Number(item.ps_current),
                ps_high_forecast: Number(item.ps_high_forecast),
                ps_avg_forecast: Number(item.ps_avg_forecast),
                ps_low_forecast: Number(item.ps_low_forecast),
                ps_forecast_discount: Number(item.ps_forecast_discount),
                nav_ttm: Number(item.nav_ttm),
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                pb_current: Number(item.pb_current),
                pb_high_forecast: Number(item.pb_high_forecast),
                pb_avg_forecast: Number(item.pb_avg_forecast),
                pb_low_forecast: Number(item.pb_low_forecast),
                pb_forecast_discount: Number(item.pb_forecast_discount),
                ocf_ttm: Number(item.ocf_ttm),
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
                pocf_current: Number(item.pocf_current),
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

    return (
        <React.Fragment>
            <StockForecastTable
                stockForecasts={forecasts}
                onRowClicked={event => {
                    if (event.data) {
                        setSelectedItem(event.data);
                    }
                }}
            />
            <StockSummaryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </React.Fragment>
    );
});
