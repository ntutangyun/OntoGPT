import React, {useEffect, useState} from "react";
import {graphStyle} from "../Common/Styles";
import {extractDotHistory} from "../ResponseUtils";
import * as d3 from "d3";
import {Pagination} from "antd";

export default function OntologyAnimator({canvasID, distillationLog}) {
    const [dotHistory, setDotHistory] = useState([]);
    const [loopIndex, setLoopIndex] = useState(0);

    useEffect(() => {
        if (!distillationLog) {
            return;
        }
        console.log(distillationLog);
        const history = extractDotHistory(distillationLog.split("\n"));
        setDotHistory(history);
    }, [distillationLog]);

    useEffect(() => {
        try {
            d3.select(`#${canvasID}`).graphviz()
                .fit(true)
                .renderDot(dotHistory[loopIndex])
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(500);
                });
        } catch (error) {
            console.log(error);
        }
    }, [dotHistory, loopIndex]);

    return <>
        {dotHistory &&
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <p style={{margin: "0.5rem"}}>Select Iteration (odd: prompt, even: response)</p>
                <Pagination total={dotHistory.length}
                            pageSize={1}
                            onChange={page => setLoopIndex(page - 1)}/>

            </div>}
        <div id={canvasID} style={{...graphStyle, height: "calc(100vh - 150px)", maxHeight: "calc(100vh - 150px)"}}/>
    </>;
}