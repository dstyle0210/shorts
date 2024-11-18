import {useRef, useEffect, forwardRef, useContext, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import "./timeline.scss";
import M_ShortsVideo , {I_ShortsVideoRef} from "../molecules/ShortsVideo";
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
    const [posterEl,posterRef] = useElement<HTMLDivElement>();
    const shortsContext = useContext(ShortsContext);
    const posterVideoRef = useRef<I_ShortsVideoRef>(null); // 포스터용 비디오
    
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
            if (!(e.target instanceof Element)) return {posX_:0,seek_:0}; // 엘리먼트 아니면 그냥 0 던져줌
            const duration = shortsContext.shortsVideo.duration();
            const {left,width} = e.target.getBoundingClientRect();
            const touchX = e.touches[0].clientX - left;
            const per = (touchX/width); // 진행률
            return {posX_:touchX,seek_:per * duration};
        },
        setPosterLeft(posx){
            posterEl.style.left = (posx - 30)+"px";
        }
    };

    const handle = {
        _seek:0,
        get seek(){
            return this._seek;
        },
        set seek(seek_:number){
            progessEl.value = seek_;
            this._seek = Math.floor(seek_);
        },
        paused:false,
        seekStart({posX_,seek_}:{posX_:number,seek_:number}){
            handle.paused = shortsContext.shortsVideo.paused(); // 일시정지 상태였는지 확인
            handle.seek = seek_; // seek 값 지정
            posterVideoRef.current.src( shortsContext.shortsVideo.lastSource_.player );
            posterVideoRef.current.play();
            fn.setPosterLeft(posX_);
            onSeekStart(); // seek 가 돌면, 일시정지가 됨.
        },
        seekMove({posX_,seek_}:{posX_:number,seek_:number}){
            handle.seek = seek_;
            posterEl.classList.add("-show");
            posterVideoRef.current.currentTime(seek_);
            posterVideoRef.current.pause();
            fn.setPosterLeft(posX_);
        },
        seekEnd(){
            shortsContext.shortsVideo.currentTime(handle.seek);
            if(!handle.paused) shortsContext.shortsVideo.play();
            posterEl.classList.remove("-show");
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
        <div ref={posterRef} className="a-mpShortsPoster">
            <M_ShortsVideo ref={posterVideoRef} isAutoplay={false} width={60} height={100} ></M_ShortsVideo>
            <span></span>
        </div>
    </div>);
});