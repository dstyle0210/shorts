import { useRef,useEffect, useImperativeHandle, forwardRef} from "react";
import type Player from 'video.js/dist/types/player';
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import useElement from "../../hooks/useElement";

export type I_ShortsVideoProps = {
    source?:string,
    poster?:string,
    isAutoplay?:boolean
};

export interface I_ShortsVideoRef {
    readonly video:Player,
    readonly el:Element,
    play():void,
    src(source_:string):void,
    poster(poster_:string):void,
    pause():void
};

export default forwardRef(function(props_:I_ShortsVideoProps,ref){
    // props
    const props = {
        source:"",
        poster:"",
        isAutoplay:false,
        ...props_
    };

    // computed
    const {source,poster,isAutoplay} = props;
    const [videoEl,videoRef] = useElement<HTMLVideoElement>();
    const video = useRef<Player>();

    useImperativeHandle(ref, () => ({
        get video(){
            return video.current;
        },
        get el(){
            return video.current.el_;
        },
        play(){
            video.current.play();
        },
        src(source_:string){
            video.current.src(source_);
        },
        poster(thumb_:string){
            video.current.poster(thumb_);
        },
        pause(){
            video.current.pause();
        }
    })); // 부모에게 핸들 전달

    // useEffect
    useEffect(()=>{
        if(!videoEl) return;
        const videoOptions = {
            width:window.outerWidth,
            height:window.outerHeight,
            ...props
        };
        video.current = videojs(videoEl,videoOptions,function(){
            this.muted(true);
        });

        if(source) video.current.src(props.source);
        if(poster) video.current.src(props.poster);
        if(isAutoplay) video.current.play();

    },[videoEl,source])

    return (<video className="video-js" ref={videoRef}></video>);
});