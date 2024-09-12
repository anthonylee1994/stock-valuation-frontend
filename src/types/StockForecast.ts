export interface StockForecast {
    id: number;
    symbol: string;
    price: string;
    volume: string;
    market_cap: string;

    roe_ttm: string;
    eps_ttm: string;
    sps_ttm: string;
    nav_ttm: string;
    ocf_ttm: string;
    net_profit_margin_ttm: string;
    eps_growth: string;
    average_eps_growth: string;

    pe_high: string;
    pe_avg: string;
    pe_low: string;
    pe_std: string;
    pe_current: string;
    pe_high_forecast: string;
    pe_avg_forecast: string;
    pe_low_forecast: string;
    pe_forecast_discount: string;

    ps_high: string;
    ps_avg: string;
    ps_low: string;
    ps_std: string;
    ps_current: string;
    ps_high_forecast: string;
    ps_avg_forecast: string;
    ps_low_forecast: string;
    ps_forecast_discount: string;

    pb_high: string;
    pb_avg: string;
    pb_low: string;
    pb_std: string;
    pb_current: string;
    pb_high_forecast: string;
    pb_avg_forecast: string;
    pb_low_forecast: string;
    pb_forecast_discount: string;

    pocf_high: string;
    pocf_avg: string;
    pocf_low: string;
    pocf_std: string;
    pocf_current: string;
    pocf_high_forecast: string;
    pocf_avg_forecast: string;
    pocf_low_forecast: string;
    pocf_forecast_discount: string;

    updated_at: string;
    created_at: string;
}
