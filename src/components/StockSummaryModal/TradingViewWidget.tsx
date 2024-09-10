import React from "react";

interface Props {
    symbol: string;
}

export const TradingViewWidget = React.memo<Props>(({symbol}) => {
    const container = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "zh_TW",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
        container.current!.appendChild(script);
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{height: 400, width: "100%"}}>
            <div className="tradingview-widget-container__widget" style={{height: "calc(100% - 32px)", width: "100%"}}></div>
            <div className="tradingview-widget-copyright">
                <a href="https://tw.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">追蹤TradingView上的所有市場</span>
                </a>
            </div>
        </div>
    );
});
