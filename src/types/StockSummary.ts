export interface StockSummary {
    id: number;
    symbol: string;
    year: string;
    max_close: string;
    avg_close: string;
    min_close: string;
    roe: string;
    eps: string;
    sps: string;
    nav: string;
    ocf: string;
    eps_growth: string;

    pe_current: string;
    pe_high: string;
    pe_avg: string;
    pe_low: string;

    ps_current: string;
    ps_high: string;
    ps_avg: string;
    ps_low: string;

    pb_current: string;
    pb_high: string;
    pb_avg: string;
    pb_low: string;

    pocf_current: string;
    pocf_high: string;
    pocf_avg: string;
    pocf_low: string;

    updated_at: string;
    created_at: string;
}
