import { useState, useEffect, useMemo, useRef,useContext, forwardRef, useImperativeHandle, MutableRefObject, MouseEventHandler, useCallback} from "react";
import Swiper from 'swiper';
import 'swiper/css';
import { ShortsContext } from "@/app/contexts/shortsContext";
import useElement from "../../hooks/useElement";

export default forwardRef(function mpShortsSwiper(props_,ref) {
    console.log("--mpShortsSwiper--");
    // props
    const data = useContext(ShortsContext);
    const [root,rootRef] = useElement<HTMLDivElement>();
    const props = {
        data:[],
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };
    console.log(data);

    return (
        <div ref={rootRef} className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts,idx)=>{
                    return (<article key={idx} className="swiper-slide"></article>);
                })}
            </div>
        </div>
    );
});