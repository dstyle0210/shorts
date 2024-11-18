import {useRef, useEffect, forwardRef, useContext, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import { ShortsContext } from "../../contexts/shortsContext";

export type T_timelineProps = {
    onSeekStart():void,
    onSeekEnd():void,
};

export default forwardRef(function(props_:T_timelineProps,ref){
    const {onSeekStart,onSeekEnd} = props_;
    const [progessEl,progessRef] = useElement<HTMLProgressElement>();
    const [timeEl,timeRef] = useElement<HTMLSpanElement>();
    const [dueEl,dueRef] = useElement<HTMLSpanElement>();
    const shortsContext = useContext(ShortsContext);

    const fn = {
        timeText(sec_:number){
            if(sec_<0) return "00:00";
            const stamp = (num:number) => (num<10 ? "0"+num : ""+num);
            const cur = Math.floor(sec_);
            const min = stamp(Math.floor(cur/60));
            const sec = stamp(Math.floor(cur%60));
            return min+":"+sec;
        },
        getSeek(e:React.TouchEvent<HTMLProgressElement>){
            if (e.target instanceof Element) {
                const duration = shortsContext.shortsVideo.duration();
                const timelineEl = e.target;
                const rect = timelineEl.getBoundingClientRect();
                const touchX = e.touches[0].clientX - rect.left;
                const maxX = rect.width;
                const per = (touchX/maxX); // 진행률
                return per * duration;
            };
        }
    };

    const handle = {
        seek:0,
        paused:false,
        get duration(){
            return shortsContext.shortsVideo.duration();
        },
        seekStart(seek_:number){
            handle.paused = shortsContext.shortsVideo.paused(); // 일시정지인지 확인
            handle.seek = seek_;
            onSeekStart(); // seek 가 돌면, 일시정지가 됨.
        },
        seekMove(seek_:number){
            progessEl.value = handle.seek;
        },
        seekEnd(){
            shortsContext.shortsVideo.currentTime(handle.seek);
            if(!handle.paused) shortsContext.shortsVideo.play();
            progessEl.value = handle.seek;
            onSeekEnd();
        }
    }

    const handler = {
        click(){

        },
        // React.MouseEvent<HTMLElement, MouseEvent>
        touchStart(e:React.TouchEvent<HTMLProgressElement>){
            e.stopPropagation();
            handle.seekStart( fn.getSeek(e) );
        },
        touchMove(e:React.TouchEvent<HTMLProgressElement>){
            e.stopPropagation();
            handle.seekMove( fn.getSeek(e) );
        },
        touchEnd(e:React.TouchEvent<HTMLProgressElement>){
            e.stopPropagation();
            handle.seekEnd();
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