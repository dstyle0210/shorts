import {useRef, useEffect, forwardRef, useContext, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import { ShortsContext } from "../../contexts/shortsContext";

export type T_timelineProps = {};

export default forwardRef(function(props_:T_timelineProps,ref){
    const [progessEl,progessRef] = useElement<HTMLProgressElement>();
    const [timeEl,timeRef] = useElement<HTMLSpanElement>();
    const [dueEl,dueRef] = useElement<HTMLSpanElement>();
    const shortsContext = useContext(ShortsContext);

    
    const handler = {
        click(){

        },
        touchStart(e){
            e.stopPropagation();
            const duration = shortsContext.shortsVideo.duration(); // 영상의 전체 시간
            const timelineEl = e.nativeEvent.srcElement; // progessEl과 사실은 같음.
            const rect = timelineEl.getBoundingClientRect();
            const touchX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const maxX = rect.width;
            const per = (touchX/maxX); // 진행률
            const seek = per * duration; // 터치 시작된 포인트의 시간

            console.log( per , seek );
        },
        touchMove(){

        },
        touchEnd(){

        }
    };

    const fn = {
        timeText(sec_:number){
            if(sec_<0) return "00:00";
            const stamp = (num:number) => (num<10 ? "0"+num : ""+num);
            const cur = Math.floor(sec_);
            const min = stamp(Math.floor(cur/60));
            const sec = stamp(Math.floor(cur%60));
            return min+":"+sec;
        }
    };
    
    useEffect(()=>{
        if(!shortsContext.shortsVideo) return;
        shortsContext.shortsVideo.on("timeupdate",()=>{

            const duration = shortsContext.shortsVideo.duration();
            if(Number.isNaN(duration)) return;
            
            const currentTime = shortsContext.shortsVideo.currentTime(); // 재생시간    
            progessEl.max = duration;
            progessEl.value = currentTime;
            timeEl.innerText = fn.timeText(currentTime);
            dueEl.innerText = fn.timeText(duration);
        });

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