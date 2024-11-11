import { useRef,useEffect, useImperativeHandle, forwardRef} from "react";
import type Player from 'video.js/dist/types/player';
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import useElement from "../../hooks/useElement";

export default forwardRef(function ShortsVideo(props_:{source:string,isAutoplay:boolean},ref){
    // props
    const props = {
        source:"",
        isAutoplay:false,
        ...props_
    };

    // computed
    const [videoEl,videoRef] = useElement<HTMLVideoElement>();
    const {source,isAutoplay} = props;
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
        pause(source_:string){
            video.current.pause();
        }
    })); // 부모에게 핸들 전달

    // useEffect
    useEffect(()=>{
        if(!videoEl || !source) return;
        const videoOptions = {
            width:window.outerWidth,
            height:window.outerHeight,
            ...props
        };
        video.current = videojs(videoEl,videoOptions,function(){
            this.muted(true);
        });
        video.current.src(props.source);
        if(isAutoplay){
            video.current.play();
        };
    },[videoEl,source])

    return (<video className="video-js" ref={videoRef}></video>);
});