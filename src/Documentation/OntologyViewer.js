import React, {useEffect} from "react";
import {graphStyle} from "../Common/Styles";
import * as d3 from "d3";

export default function OntologyViewer({canvasID, dotContent}) {

    useEffect(() => {
        if (!dotContent) {
            return;
        }
        try {
            d3.select(`#${canvasID}`).graphviz()
                .fit(true)
                .renderDot(dotContent)
                .transition(function () {
                    return d3.transition()
                        .ease(d3.easeLinear)
                        .duration(500);
                });
        } catch (error) {
            console.log(error);
        }
    }, [dotContent]);

    return <div id={canvasID}
                style={{...graphStyle, height: "calc(100vh - 180px)", maxHeight: "calc(100vh - 180px)"}}/>;
}