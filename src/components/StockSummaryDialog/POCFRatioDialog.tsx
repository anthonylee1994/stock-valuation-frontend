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
    open: boolean;
    symbol: string;
    onClose: () => void;
    stockSummaries: StockSummary[];
}

export const POCFRatioDialog = React.memo<Props>(({open, onClose, symbol, stockSummaries}) => {
    const [stockPrices, setStockPrices] = React.useState<StockPrice[]>([]);

    const fetchData = React.useCallback(async () => {
        const response = await apiClient.get(`/stock_price/${symbol}`);
        setStockPrices(response.data);
    }, [symbol]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData, symbol]);

    return (
        <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
            <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                P/OCF
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
                                label: "P/OCF 極值",
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0].pocf_high) * Number(summary.ocf);
                                }),
                                fill: false,
                                borderColor: "rgb(255, 99, 132)",
                                tension: 0.1,
                            },
                            {
                                label: "P/OCF 均值",
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0].pocf_avg) * Number(summary.ocf);
                                }),
                                fill: false,
                                borderColor: "rgb(255, 205, 86)",
                                tension: 0.1,
                            },
                            {
                                label: "P/OCF 殘值",
                                data: stockPrices.map(item => {
                                    let summary = stockSummaries.find(summary => summary.year === String(new Date(item.date).getFullYear()));
                                    summary = summary ? summary : stockSummaries[0];

                                    return Number(stockSummaries[0].pocf_low) * Number(summary.ocf);
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
