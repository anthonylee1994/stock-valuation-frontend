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
                pe_low: item?.pe_low || "",
                pb_high: item?.pb_high || "",
                pb_low: item?.pb_low || "",
                ps_high: item?.ps_high || "",
                ps_low: item?.ps_low || "",
                pocf_high: item?.pocf_high || "",
                pocf_low: item?.pocf_low || "",
                eps: item?.eps_ttm || "",
                sps: item?.sps_ttm || "",
                nav: item?.nav_ttm || "",
                ocf: item?.ocf_ttm || "",
            },
            ...response.data,
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
                            {field: "year", headerName: "年度", pinned: "left"},
                            {field: "eps", headerName: "每股盈利"},
                            {field: "sps", headerName: "每股營收"},
                            {field: "nav", headerName: "每股淨值"},
                            {field: "ocf", headerName: "每股營運現金流"},
                            {field: "max_close", headerName: "最高收盤價"},
                            {field: "min_close", headerName: "最低收盤價"},
                            {field: "pe_high", headerName: "極值 P/E"},
                            {field: "pe_low", headerName: "殘值 P/E"},
                            {field: "ps_high", headerName: "極值 P/S"},
                            {field: "ps_low", headerName: "殘值 P/S"},
                            {field: "pb_high", headerName: "極值 P/B"},
                            {field: "pb_low", headerName: "殘值 P/B"},
                            {field: "pocf_high", headerName: "極值 P/OCF"},
                            {field: "pocf_low", headerName: "殘值 P/OCF"},
                        ]}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
});
