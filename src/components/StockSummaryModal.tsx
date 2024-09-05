import {Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery} from "@mui/material";
import React from "react";
import {apiClient} from "../utils/apiClient";
import {StockSummary} from "../types/StockSummary";
import {AgGridReact} from "ag-grid-react";
import {StockForecast} from "../types/StockForecast";
import CloseIcon from "@mui/icons-material/Close";
import {TradingViewWidget} from "./TradingViewWidget";
import {StockInfo} from "../types/StockInfo";
import {findGrowthRateByPE} from "../utils/growthRateToPE";

interface Props {
    item: StockForecast | null;
    onClose: () => void;
}

export const StockSummaryModal = React.memo(({item, onClose}: Props) => {
    const isMobile = useMediaQuery("(max-width: 600px)");
    const [stockInfo, setStockInfo] = React.useState<StockInfo | null>(null);
    const [stockSummaries, setStockSummaries] = React.useState<StockSummary[]>([]);

    const fetchInfo = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_info/${item?.symbol}`);
        setStockInfo(response.data);
    }, [item?.symbol]);

    const fetchData = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_summary/${item?.symbol}`);
        setStockSummaries([
            {
                year: "最新預測",
                max_close: "-",
                avg_close: "-",
                min_close: "-",
                pe_current: item?.pe_current || "",
                pe_high: item?.pe_high || "",
                pe_avg: item?.pe_avg || "",
                pe_low: item?.pe_low || "",
                ps_current: item?.ps_current || "",
                ps_high: item?.ps_high || "",
                ps_avg: item?.ps_avg || "",
                ps_low: item?.ps_low || "",
                pb_current: item?.pb_current || "",
                pb_high: item?.pb_high || "",
                pb_avg: item?.pb_avg || "",
                pb_low: item?.pb_low || "",
                pocf_current: item?.pocf_current || "",
                pocf_high: item?.pocf_high || "",
                pocf_avg: item?.pocf_avg || "",
                pocf_low: item?.pocf_low || "",
                roe: item?.roe_ttm || "",
                eps: item?.eps_ttm || "",
                sps: item?.sps_ttm || "",
                nav: item?.nav_ttm || "",
                ocf: item?.ocf_ttm || "",
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
                ps_current: "-",
                ps_high: Number(item.ps_high),
                ps_avg: Number(item.ps_avg),
                ps_low: Number(item.ps_low),
                pb_current: "-",
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                pocf_current: "-",
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
                roe: Number(item.roe),
                eps: Number(item.eps),
                sps: Number(item.sps),
                nav: Number(item.nav),
                ocf: Number(item.ocf),
            })),
        ]);
    }, [item]);

    React.useEffect(() => {
        if (item?.symbol) {
            fetchData();
            fetchInfo();
        }
    }, [fetchData, fetchInfo, item?.symbol]);

    const ratioCellStyle = (valueFunction: (data: StockSummary) => number) => params => {
        if (!params.data) {
            return null;
        }

        const value = valueFunction(params.data);
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
                <div className="ag-theme-quartz" style={{width: "100%", height: "400px"}}>
                    <AgGridReact
                        loading={stockSummaries.length === 0}
                        rowData={stockSummaries}
                        columnDefs={[
                            {field: "year", headerName: "年度", pinned: "left", type: "rightAligned", width: 100},
                            {
                                headerName: "關鍵指標",
                                children: [
                                    {field: "eps", headerName: "每股盈利", type: "rightAligned", width: 100},
                                    {field: "sps", headerName: "每股營收", type: "rightAligned", width: 100},
                                    {field: "nav", headerName: "每股淨值", type: "rightAligned", width: 100},
                                    {field: "ocf", headerName: "每股營運現金流", type: "rightAligned", width: 150},
                                    {field: "roe", headerName: "ROE", type: "rightAligned", width: 100},
                                ],
                            },
                            {
                                headerName: "收盤價",
                                children: [
                                    {field: "max_close", headerName: "最高", type: "rightAligned", width: 120},
                                    {field: "avg_close", headerName: "平均", type: "rightAligned", width: 120},
                                    {field: "min_close", headerName: "最低", type: "rightAligned", width: 120},
                                ],
                            },
                            {
                                headerName: "P/E",
                                children: [
                                    {
                                        field: "pe_current",
                                        headerName: "現值",
                                        type: "rightAligned",
                                        width: 100,
                                        cellStyle: ratioCellStyle((data: StockSummary) => Number(data.pe_current) / Number(data.pe_avg)),
                                        tooltipValueGetter: growthRateTooltipValueGetter,
                                    },
                                    {field: "pe_high", headerName: "極值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                                    {field: "pe_avg", headerName: "均值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                                    {field: "pe_low", headerName: "殘值", type: "rightAligned", width: 100, tooltipValueGetter: growthRateTooltipValueGetter},
                                ],
                            },
                            {
                                headerName: "P/S",
                                children: [
                                    {
                                        field: "ps_current",
                                        headerName: "現值",
                                        type: "rightAligned",
                                        width: 100,
                                        cellStyle: ratioCellStyle((data: StockSummary) => Number(data.ps_current) / Number(data.ps_avg)),
                                    },
                                    {field: "ps_high", headerName: "極值", type: "rightAligned", width: 100},
                                    {field: "ps_avg", headerName: "均值", type: "rightAligned", width: 100},
                                    {field: "ps_low", headerName: "殘值", type: "rightAligned", width: 100},
                                ],
                            },
                            {
                                headerName: "P/B",
                                children: [
                                    {
                                        field: "pb_current",
                                        headerName: "現值",
                                        type: "rightAligned",
                                        width: 100,
                                        cellStyle: ratioCellStyle((data: StockSummary) => Number(data.pb_current) / Number(data.pb_avg)),
                                    },
                                    {field: "pb_high", headerName: "極值", type: "rightAligned", width: 100},
                                    {field: "pb_avg", headerName: "均值", type: "rightAligned", width: 100},
                                    {field: "pb_low", headerName: "殘值", type: "rightAligned", width: 100},
                                ],
                            },
                            {
                                headerName: "P/OCF",
                                children: [
                                    {
                                        field: "pocf_current",
                                        headerName: "現值",
                                        type: "rightAligned",
                                        width: 120,
                                        cellStyle: ratioCellStyle((data: StockSummary) => Number(data.pocf_current) / Number(data.pocf_avg)),
                                    },
                                    {field: "pocf_high", headerName: "極值", type: "rightAligned", width: 120},
                                    {field: "pocf_avg", headerName: "均值", type: "rightAligned", width: 120},
                                    {field: "pocf_low", headerName: "殘值", type: "rightAligned", width: 120},
                                ],
                            },
                        ]}
                    />
                </div>
                {item && (
                    <div style={{height: 400, marginTop: 10}}>
                        <TradingViewWidget symbol={item.symbol} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});
