import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import React from "react";
import {apiClient} from "../utils/apiClient";
import {StockSummary} from "../types/StockSummary";
import {AgGridReact} from "ag-grid-react";
import {StockForecast} from "../types/StockForecast";

interface Props {
    item: StockForecast | null;
    onClose: () => void;
}

export const StockSummaryModal = React.memo(({item, onClose}: Props) => {
    const [stockSummaries, setStockSummaries] = React.useState<StockSummary[]>([]);

    const fetchData = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_summary/${item?.symbol}`);
        setStockSummaries([
            {
                year: "最新預測",
                max_close: "-",
                min_close: "-",
                pe_high: item?.pe_high || "",
                pe_avg: item?.pe_avg || "",
                pe_low: item?.pe_low || "",
                pb_high: item?.pb_high || "",
                pb_avg: item?.pb_avg || "",
                pb_low: item?.pb_low || "",
                ps_high: item?.ps_high || "",
                ps_avg: item?.ps_avg || "",
                ps_low: item?.ps_low || "",
                pocf_high: item?.pocf_high || "",
                pocf_avg: item?.pocf_avg || "",
                pocf_low: item?.pocf_low || "",
                eps: item?.eps_ttm || "",
                sps: item?.sps_ttm || "",
                nav: item?.nav_ttm || "",
                ocf: item?.ocf_ttm || "",
            },
            ...response.data.map((item: StockSummary) => ({
                year: item.year,
                max_close: Number(item.max_close),
                min_close: Number(item.min_close),
                pe_high: Number(item.pe_high),
                pe_avg: Number(item.pe_avg),
                pe_low: Number(item.pe_low),
                pb_high: Number(item.pb_high),
                pb_avg: Number(item.pb_avg),
                pb_low: Number(item.pb_low),
                ps_high: Number(item.ps_high),
                ps_avg: Number(item.ps_avg),
                ps_low: Number(item.ps_low),
                pocf_high: Number(item.pocf_high),
                pocf_avg: Number(item.pocf_avg),
                pocf_low: Number(item.pocf_low),
                eps: Number(item.eps),
                sps: Number(item.sps),
                nav: Number(item.nav),
                ocf: Number(item.ocf),
            })),
        ]);
    }, [item?.symbol]);

    React.useEffect(() => {
        if (item?.symbol) {
            fetchData();
        }
    }, [fetchData, item?.symbol]);

    return (
        <Dialog fullWidth maxWidth="xl" open={Boolean(item)} onClose={onClose}>
            <DialogTitle>{item?.symbol}</DialogTitle>
            <DialogContent>
                <div className="ag-theme-quartz" style={{width: "100%", height: "400px"}}>
                    <AgGridReact
                        loading={stockSummaries.length === 0}
                        rowData={stockSummaries}
                        columnDefs={[
                            {field: "year", headerName: "年度", pinned: "left", type: "rightAligned"},
                            {field: "eps", headerName: "每股盈利", type: "rightAligned"},
                            {field: "sps", headerName: "每股營收", type: "rightAligned"},
                            {field: "nav", headerName: "每股淨值", type: "rightAligned"},
                            {field: "ocf", headerName: "每股營運現金流", type: "rightAligned"},
                            {field: "max_close", headerName: "最高收盤價", type: "rightAligned"},
                            {field: "min_close", headerName: "最低收盤價", type: "rightAligned"},
                            {field: "pe_high", headerName: "極值 P/E", type: "rightAligned"},
                            {field: "pe_avg", headerName: "均值 P/E", type: "rightAligned"},
                            {field: "pe_low", headerName: "殘值 P/E", type: "rightAligned"},
                            {field: "ps_high", headerName: "極值 P/S", type: "rightAligned"},
                            {field: "ps_avg", headerName: "均值 P/S", type: "rightAligned"},
                            {field: "ps_low", headerName: "殘值 P/S", type: "rightAligned"},
                            {field: "pb_high", headerName: "極值 P/B", type: "rightAligned"},
                            {field: "pb_avg", headerName: "均值 P/B", type: "rightAligned"},
                            {field: "pb_low", headerName: "殘值 P/B", type: "rightAligned"},
                            {field: "pocf_high", headerName: "極值 P/OCF", type: "rightAligned"},
                            {field: "pocf_avg", headerName: "均值 P/OCF", type: "rightAligned"},
                            {field: "pocf_low", headerName: "殘值 P/OCF", type: "rightAligned"},
                        ]}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
});
