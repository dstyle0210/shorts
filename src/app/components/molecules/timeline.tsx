import {useEffect, forwardRef, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
export type T_timelineProps = {};
export default forwardRef(function(props_:T_timelineProps,ref){
    const [proressEl,progessRef] = useElement();
    const [timeEl,timeRef] = useElement();
    const [dueEl,dueRef] = useElement();

    
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

    return (<div className="m-mpShortsTimeline">
        <progress ref={progessRef} onClick={handler.click} onTouchStart={handler.touchStart} onTouchMove={handler.touchMove} onTouchEnd={handler.touchEnd} className="timeline"></progress>
        <span ref={timeRef} className="time"></span>
        <span ref={dueRef} className="due"></span>
        <div className="poster">
            <span className="posterTime"></span>
        </div>
    </div>);
});