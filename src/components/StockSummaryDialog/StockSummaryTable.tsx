import React from "react";
import {AgGridReact} from "ag-grid-react";
import {StockSummary} from "../../types/StockSummary";
import {findGrowthRateByPE, findPEByGrowthRate} from "../../utils/growthRateToPE";
import {MetricsDialog} from "./MetricsDialog.tsx";
import {PriceRatioDialog} from "./PriceRatioDialog.tsx";

interface Props {
    symbol: string;
    stockSummaries: StockSummary[];
}

export const StockSummaryTable = React.memo<Props>(({symbol, stockSummaries}) => {
    const [chartTitle, setChartTitle] = React.useState<string>("");
    const [chartKey, setChartKey] = React.useState<string | null>(null);
    const [priceRatioDialogOpen, setPriceRatioDialogOpen] = React.useState<"pe" | "ps" | "pb" | "pocf" | null>(null);

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
        <React.Fragment>
            <div className="ag-theme-quartz" style={{width: "100%", height: "400px"}}>
                <AgGridReact
                    loading={stockSummaries.length === 0}
                    rowData={stockSummaries}
                    columnDefs={[
                        {field: "year", headerName: "年度", pinned: "left", type: "rightAligned", width: 100},
                        {
                            headerName: "關鍵指標",
                            children: [
                                {
                                    field: "eps",
                                    headerName: "每股盈利",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => {
                                        setChartTitle("每股盈利");
                                        setChartKey("eps");
                                    },
                                },
                                {
                                    field: "eps_growth",
                                    headerName: "盈利增長率",
                                    type: "rightAligned",
                                    width: 110,
                                    valueFormatter: params => `${Number(params.value).toFixed(2)}%`,
                                    tooltipValueGetter: params => {
                                        return `合理 P/E: ${findPEByGrowthRate(params.value)}`;
                                    },
                                },
                                {
                                    field: "sps",
                                    headerName: "每股營收",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => {
                                        setChartTitle("每股營收");
                                        setChartKey("sps");
                                    },
                                },
                                {
                                    field: "nav",
                                    headerName: "每股淨值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => {
                                        setChartTitle("每股淨值");
                                        setChartKey("nav");
                                    },
                                },
                                {
                                    field: "ocf",
                                    headerName: "每股營運現金流",
                                    type: "rightAligned",
                                    width: 150,
                                    onCellClicked: () => {
                                        setChartTitle("每股營運現金流");
                                        setChartKey("ocf");
                                    },
                                },
                                {
                                    field: "roe",
                                    headerName: "ROE",
                                    type: "rightAligned",
                                    width: 100,
                                    valueFormatter: params => `${Number(params.value * 100).toFixed(2)}%`,
                                },
                                {
                                    field: "net_profit_margin",
                                    headerName: "純利率",
                                    type: "rightAligned",
                                    valueFormatter: params => `${Number(params.value).toFixed(2)}%`,
                                    width: 100,
                                },
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
                                    valueFormatter: params => (params.value === "-" ? "-" : Number(params.value).toFixed(2)),
                                    onCellClicked: () => setPriceRatioDialogOpen("pe"),
                                },
                                {
                                    field: "pe_high",
                                    headerName: "極值",
                                    type: "rightAligned",
                                    width: 100,
                                    tooltipValueGetter: growthRateTooltipValueGetter,
                                    onCellClicked: () => setPriceRatioDialogOpen("pe"),
                                },
                                {
                                    field: "pe_avg",
                                    headerName: "均值",
                                    type: "rightAligned",
                                    width: 100,
                                    tooltipValueGetter: growthRateTooltipValueGetter,
                                    onCellClicked: () => setPriceRatioDialogOpen("pe"),
                                },
                                {
                                    field: "pe_low",
                                    headerName: "殘值",
                                    type: "rightAligned",
                                    width: 100,
                                    tooltipValueGetter: growthRateTooltipValueGetter,
                                    onCellClicked: () => setPriceRatioDialogOpen("pe"),
                                },
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
                                    valueFormatter: params => (params.value === "-" ? "-" : Number(params.value).toFixed(2)),
                                    onCellClicked: () => setPriceRatioDialogOpen("ps"),
                                },
                                {
                                    field: "ps_high",
                                    headerName: "極值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("ps"),
                                },
                                {
                                    field: "ps_avg",
                                    headerName: "均值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("ps"),
                                },
                                {
                                    field: "ps_low",
                                    headerName: "殘值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("ps"),
                                },
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
                                    valueFormatter: params => (params.value === "-" ? "-" : Number(params.value).toFixed(2)),
                                    onCellClicked: () => setPriceRatioDialogOpen("pb"),
                                },
                                {
                                    field: "pb_high",
                                    headerName: "極值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("pb"),
                                },
                                {
                                    field: "pb_avg",
                                    headerName: "均值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("pb"),
                                },
                                {
                                    field: "pb_low",
                                    headerName: "殘值",
                                    type: "rightAligned",
                                    width: 100,
                                    onCellClicked: () => setPriceRatioDialogOpen("pb"),
                                },
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
                                    valueFormatter: params => (params.value === "-" ? "-" : Number(params.value).toFixed(2)),
                                    onCellClicked: () => setPriceRatioDialogOpen("pocf"),
                                },
                                {
                                    field: "pocf_high",
                                    headerName: "極值",
                                    type: "rightAligned",
                                    width: 120,
                                    onCellClicked: () => setPriceRatioDialogOpen("pocf"),
                                },
                                {
                                    field: "pocf_avg",
                                    headerName: "均值",
                                    type: "rightAligned",
                                    width: 120,
                                    onCellClicked: () => setPriceRatioDialogOpen("pocf"),
                                },
                                {
                                    field: "pocf_low",
                                    headerName: "殘值",
                                    type: "rightAligned",
                                    width: 120,
                                    onCellClicked: () => setPriceRatioDialogOpen("pocf"),
                                },
                            ],
                        },
                    ]}
                />
            </div>
            <MetricsDialog title={chartTitle} data={[...stockSummaries].reverse()} yKey={chartKey} onClose={() => setChartKey(null)} />
            <PriceRatioDialog open={priceRatioDialogOpen} onClose={() => setPriceRatioDialogOpen(null)} stockSummaries={stockSummaries} symbol={symbol} />
        </React.Fragment>
    );
});
