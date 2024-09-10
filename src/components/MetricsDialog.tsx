import React from "react";
import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {StockSummary} from "../types/StockSummary.ts";
import {AgCharts} from "ag-charts-react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    title: string;
    yKey: string | null;
    onClose: () => void;
    data: StockSummary[];
}

export const MetricsDialog = React.memo<Props>(({title, data, yKey, onClose}) => {
    return (
        <Dialog fullWidth maxWidth="lg" open={Boolean(yKey)} onClose={onClose}>
            <DialogTitle sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                {title}
                <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {yKey && (
                    <AgCharts
                        options={{
                            data,
                            series: [{type: "line", xKey: "year", yKey}],
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
});
