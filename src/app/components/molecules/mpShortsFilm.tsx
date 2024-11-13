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
        toggle(){
            fn[(fn.isShow) ? "hide" : "show"]();
        }
    };

    // 엘리먼트에 연결되는 핸들러
    const handler = {
        toggle(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            fn.toggle();
        },
        pause(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            onPause();
            fn.videoState = "pause";
            fn.hold();
        },
        play(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            onPlay();
            fn.videoState = "play";
            fn.setClearTimer(1000);
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
                <M_timeline></M_timeline>
            </div>);
});
