import {useEffect, forwardRef, useContext, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import { ShortsContext } from "../../contexts/shortsContext";

export type T_timelineProps = {};

export default forwardRef(function(props_:T_timelineProps,ref){
    const [progessEl,progessRef] = useElement<HTMLProgressElement>();
    const [timeEl,timeRef] = useElement();
    const [dueEl,dueRef] = useElement();
    const shortsContext = useContext(ShortsContext);

    
    const handler = {
        click(){

        },
        touchStart(){

        },
        touchMove(){

        },
        touchEnd(){

        }
    }

    
    useEffect(()=>{
        if(!shortsContext.shortsVideo) return;
        shortsContext.shortsVideo.on("timeupdate",()=>{
            const currentTime = shortsContext.shortsVideo.currentTime(); // 재생시간
            const duration = shortsContext.shortsVideo.duration();
            if(Number.isNaN(duration)) return;

            progessEl.max = duration;
            progessEl.value = currentTime;
        })
    },[shortsContext.shortsVideo]);

    return (<div className="m-mpShortsTimeline">
        <progress ref={progessRef} onClick={handler.click} onTouchStart={handler.touchStart} onTouchMove={handler.touchMove} onTouchEnd={handler.touchEnd} className="timeline"></progress>
        <span ref={timeRef} className="time"></span>
        <span ref={dueRef} className="due"></span>
        <div className="poster">
            <span className="posterTime"></span>
        </div>
    </div>);
});