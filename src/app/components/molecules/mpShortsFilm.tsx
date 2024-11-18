import {forwardRef, useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import "./mpShortsFilm.scss";
import M_timeline  from "../molecules/timeline";

export type T_mpShortsFilmProps = {
    onPause():void,
    onPlay():void
}

export interface I_mpShortsFilmRef {
    el:HTMLDivElement
}

export default forwardRef(function mpShortsFilm(props_:T_mpShortsFilmProps,ref){
    const [filmEl,filmRef] = useElement<HTMLDivElement>();
    const [timelineEl,timelineRef] = useElement<HTMLProgressElement>();
    const {onPause,onPlay} = props_;

    const fn = {
        get isShow(){
            return ((cl)=> (cl.contains("-show") || cl.contains("-hold")) )(filmEl.classList);
        },
        outTimer:null,
        setClearTimer(delay:number){
            fn.outTimer = setTimeout(fn.clear,delay);
        },
        clear(){
            clearTimeout(fn.outTimer);
            filmEl.classList.remove("-show","-hold","-seek");
            return filmEl.classList;
        },
        videoState:"play",
        show(){
            if(fn.videoState=="play"){
                fn.clear().add("-show");
            }else if(fn.videoState=="pause"){
                fn.clear().add("-hold");
            };
            fn.setClearTimer(3000);
        },
        hide(){
            fn.clear();
        },
        hold(){
            fn.clear().add("-hold");
        },
        seek(){
            fn.clear().add("-seek");
        },
        toggle(){
            fn[(fn.isShow) ? "hide" : "show"]();
        }
    };



    // 핸들
    const handle = {
        toggle:fn.toggle,
        hide:fn.hide,
        pause(){
            onPause();
            fn.videoState = "pause";
            fn.hold();
        },
        play(){
            onPlay();
            fn.videoState = "play";
            fn.setClearTimer(1000);
        },
        seek(){
            onPause();
            fn.seek();
        }
    }

    // 엘리먼트에 연결되는 핸들러
    const handler = {
        toggle(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            handle.toggle();
        },
        pause(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            handle.pause();
        },
        play(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            handle.play();
        },
        seekStart(){
            handle.seek();
        },
        seekEnd(){
            handle.hide();
        }
    };

    useImperativeHandle(ref, () => ({
        get el(){
            return filmEl;
        }
    }));

    return (<div ref={filmRef} className="t-mpShorts__film" onClick={handler.toggle}>
                <div className="m-mpShortsControl">
                    <button className="pauseBtn" onClick={handler.pause}>일시정지</button>
                    <button className="playBtn" onClick={handler.play}>재생</button>
                </div>
                <M_timeline onSeekStart={handler.seekStart} onSeekEnd={handler.seekEnd}></M_timeline>
            </div>);
});
