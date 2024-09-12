import React from "react";
import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {StockPrice} from "../../types/StockPrice.ts";
import {apiClient} from "../../utils/apiClient.ts";
import {Line} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {StockSummary} from "../../types/StockSummary.ts";
import "chartjs-adapter-moment";
import CloseIcon from "@mui/icons-material/Close";

Chart.register(...registerables, zoomPlugin);

interface Props {
    open: "pe" | "pb" | "ps" | "pocf" | null;
    symbol: string;
    onClose: () => void;
    stockSummaries: StockSummary[];
}

export const PriceRatioDialog = React.memo<Props>(({open, onClose, symbol, stockSummaries}) => {
    const [stockPrices, setStockPrices] = React.useState<StockPrice[]>([]);

    const fetchData = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_price/${symbol}`);
        setStockPrices(response.data);
    }, [symbol]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData, symbol]);

    const name = React.useMemo(() => {
        switch (open) {
            case "pe":
                return "P/E";
            case "pb":
                return "P/B";
            case "ps":
                return "P/S";
            case "pocf":
                return "P/OCF";
            default:
                return "";
        }
    }, [open]);

    const base = React.useMemo(() => {
        switch (open) {
            case "pe":
                return "eps";
            case "pb":
                return "nav";
            case "ps":
                return "sps";
            case "pocf":
                return "ocf";
            default:
                return "";
        }
    }, [open]);

    return (
        <Dialog fullWidth maxWidth="lg" open={Boolean(open)} onClose={onClose}>
            <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                {name}
                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Line
                    data={{
                        labels: stockPrices.map(item => item.date),
                        datasets: [
                            {
                                label: "股價",
                                data: stockPrices.map(item => item.adjClose),
                                fill: false,
                                borderColor: "rgb(75, 192, 192)",
                                tension: 0.1,
                            },
                            {
                                label: `${name} 極值`,
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0][`${open}_high`]) * Number(summary[base]);
                                }),
                                fill: false,
                                borderColor: "rgb(255, 99, 132)",
                                tension: 0.1,
                            },
                            {
                                label: `${name} 標準差+1`,
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return (Number(stockSummaries[0][`${open}_avg`]) + Number(stockSummaries[0][`${open}_std`])) * Number(summary[base]);
                                }),
                                fill: false,
                                borderColor: "rgb(255,120,41)",
                            },
                            {
                                label: `${name} 均值`,
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0][`${open}_avg`]) * Number(summary[base]);
                                }),
                                fill: false,
                                borderColor: "rgb(255, 205, 86)",
                                tension: 0.1,
                            },
                            {
                                label: `${name} 標準差-1`,
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return (Number(stockSummaries[0][`${open}_avg`]) - Number(stockSummaries[0][`${open}_std`])) * Number(summary[base]);
                                }),
                                fill: false,
                                borderColor: "rgb(104,211,68)",
                            },
                            {
                                label: `${name} 殘值`,
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0][`${open}_low`]) * Number(summary[base]);
                                }),
                                fill: false,
                                borderColor: "rgb(54, 162, 235)",
                                tension: 0.1,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            zoom: {
                                pan: {
                                    enabled: true,
                                },
                                zoom: {
                                    wheel: {
                                        enabled: true,
                                    },
                                    mode: "x",
                                },
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 1,
                            },
                            point: {
                                radius: 0,
                            },
                        },
                        scales: {
                            x: {
                                type: "time",
                            },
                        },
                    }}
                />
            </DialogContent>
        </Dialog>
    );
});
