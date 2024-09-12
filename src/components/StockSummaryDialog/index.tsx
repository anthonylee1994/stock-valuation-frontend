import {Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery} from "@mui/material";
import React from "react";
import {apiClient} from "../../utils/apiClient";
import {StockSummary} from "../../types/StockSummary";
import {StockForecast} from "../../types/StockForecast";
import CloseIcon from "@mui/icons-material/Close";
import {TradingViewWidget} from "./TradingViewWidget";
import {StockInfo} from "../../types/StockInfo";
import {StockSummaryTable} from "./StockSummaryTable";

interface Props {
    item: StockForecast | null;
    onClose: () => void;
}

export const StockSummaryDialog = React.memo(({item, onClose}: Props) => {
    const isMobile = useMediaQuery("(max-width: 600px)");
    const [stockInfo, setStockInfo] = React.useState<StockInfo | null>(null);
    const [stockSummaries, setStockSummaries] = React.useState<StockSummary[]>([]);

    const fetchInfo = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_info/${item?.symbol}`);
        setStockInfo(response.data);
    }, [item?.symbol]);

    const fetchData = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_summary/${item?.symbol}`);

        const stockSummaries = [
            {
                year: "最新預測",
                max_close: "-",
                avg_close: "-",
                min_close: "-",
                pe_current: item?.pe_current,
                pe_high: item?.pe_high ?? "",
                pe_avg: item?.pe_avg ?? "",
                pe_low: item?.pe_low ?? "",
                pe_std: item?.pe_std ?? "",
                ps_current: item?.ps_current,
                ps_high: item?.ps_high ?? "",
                ps_avg: item?.ps_avg ?? "",
                ps_low: item?.ps_low ?? "",
                ps_std: item?.ps_std ?? "",
                pb_current: item?.pb_current,
                pb_high: item?.pb_high ?? "",
                pb_avg: item?.pb_avg ?? "",
                pb_low: item?.pb_low ?? "",
                pb_std: item?.pb_std ?? "",
                pocf_current: item?.pocf_current,
                pocf_high: item?.pocf_high ?? "",
                pocf_avg: item?.pocf_avg ?? "",
                pocf_low: item?.pocf_low ?? "",
                pocf_std: item?.pocf_std ?? "",
                roe: item?.roe_ttm ?? "",
                net_profit_margin: item?.net_profit_margin_ttm ?? "",
                eps: item?.eps_ttm ?? "",
                sps: item?.sps_ttm ?? "",
                nav: item?.nav_ttm ?? "",
                ocf: item?.ocf_ttm ?? "",
                eps_growth: item?.eps_growth ?? "",
            },
            ...response.data.map((item: StockSummary) => ({
                year: item.year,
                max_close: Number(item.max_close),
                avg_close: Number(item.avg_close),
                min_close: Number(item.min_close),
                pe_current: "-",
                pe_high: Number(item.pe_high),
                pe_avg: Number(item.pe_avg),
                pe_low: Number(item.pe_low),
                pe_std: Number(item.pe_std),
                ps_current: "-",
                ps_high: Number(item.ps_high),
                ps_avg: Number(item.ps_avg),
                ps_low: Number(item.ps_low),
                ps_std: Number(item.ps_std),
                pb_current: "-",
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                pb_std: Number(item.pb_std),
                pocf_current: "-",
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
                pocf_std: Number(item.pocf_std),
                roe: Number(item.roe),
                eps: Number(item.eps),
                sps: Number(item.sps),
                nav: Number(item.nav),
                ocf: Number(item.ocf),
                net_profit_margin: Number(item.net_profit_margin),
                eps_growth: Number(item.eps_growth),
            })),
        ];

        setStockSummaries(stockSummaries);
    }, [item]);

    React.useEffect(() => {
        if (item?.symbol) {
            fetchData();
            fetchInfo();
        }
    }, [fetchData, fetchInfo, item?.symbol]);

    return (
        <Dialog fullWidth fullScreen={isMobile} maxWidth="xl" open={Boolean(item)} onClose={onClose}>
            <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                {item?.symbol}
                {stockInfo ? `: ${stockInfo.company_name}` : undefined}
                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {item && <StockSummaryTable symbol={item.symbol} stockSummaries={stockSummaries} />}
                {item && (
                    <div style={{height: 400, marginTop: 10}}>
                        <TradingViewWidget symbol={item.symbol} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});
