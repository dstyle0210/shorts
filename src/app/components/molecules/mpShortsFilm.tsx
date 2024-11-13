import {forwardRef,useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
import "./mpShortsFilm.scss";

type T_mpShortsFilmProps = {
    onPause():void,
    onPlay():void
}

export default forwardRef(function mpShortsFilm(props_:T_mpShortsFilmProps,ref){
    const [filmEl,filmRef] = useElement<HTMLDivElement>();
    const {onPause,onPlay} = props_;
    const fn = {
        get isShow(){
            return ((cl)=> (cl.contains("-show") || cl.contains("-hold")) )(filmEl.classList);
        },
        outTimer:null,
        clear(){
            clearTimeout(fn.outTimer);
            filmEl.classList.remove("-show","-hold","-seek");
            return filmEl.classList;
        },
        show(){
            fn.clear().add("-show");
            fn.outTimer = setTimeout(fn.clear,3000);
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

    // 동작을 주관하는 핸들
    const handle = {
        pause(){
            onPause();
            fn.hold();
        },
        play(){
            onPlay();
            fn.clear();
        }
    };

    // 엘리먼트에 연결되는 핸들러
    const handler = {
        pause(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            handle.pause();
        },
        play(e:React.MouseEvent<HTMLElement, MouseEvent>){
            e.stopPropagation();
            handle.play();
        }
    };

    useImperativeHandle(ref, () => ({
        get el(){
            return filmEl;
        },
        ...handle
    }));

    return (<div ref={filmRef} className="t-mpShorts__film" onClick={fn.toggle}>
        <div className="m-mpShortsControl">
            <button className="pauseBtn" onClick={handler.pause}>일시정지</button>
            <button className="playBtn" onClick={handler.play}>재생</button>
        </div>
    </div>);
});
