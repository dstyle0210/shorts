import {useState, useEffect, useRef , forwardRef, useImperativeHandle} from "react";
import videojs from "video.js";
import 'video.js/dist/video-js.css';
export default forwardRef(function O_activeShorts(props:{id:string,src?:string,width?:number,height?:number},ref) {
    const {
        id = "activeShorts",
        src:src_ = "",
        width = window.outerWidth,
        height = window.outerHeight
    } = props;
    const [src,setSrc] = useState(src_);
    const videoId = id+"Video";
    const videoRef = useRef(null);
    useEffect(()=>{
        videoRef.current = videojs(videoId,{width,height},function(){
            this.muted(true);
        });
    },[]);
    useImperativeHandle(ref,()=>({
        src(src_:string){
            videoRef.current.src(src_);
        },
        play(){
            videoRef.current.play();
        }
    }));
    return (
        <div className="o-activeShorts" id={id}>
            <video id={videoId} className="video-js" preload="auto" playsInline></video>
        </div>
    );
});