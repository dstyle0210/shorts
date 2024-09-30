import { useState, useEffect, useRef} from "react";
import "./mpShorts.scss";
declare const videojs:any;
declare const Swiper:any;
type T_SHORTS = {title:string,sources:string[]};


const wrapperId = "#mpShorts";
const greenRoomId = "#mpShortsGreenRoom";

// 그린룸(대기실)에 비디오엘리먼트 생성 및 videoJs 오브젝트로 생성
const useGreenRoomVideo = (id:string,options:{width:number,height:number}={width:window.outerWidth,height:window.outerHeight}) => {
    // 그린룸 생성
    if( $(wrapperId).find(greenRoomId).length == 0 ){
        const dom = `<div id="${greenRoomId.replace("#","")}"></div>`;
        $(wrapperId).append(dom);
    }
    $(greenRoomId).append( `<video id=${id} class="video-js" preload="auto" playsinline></video>` );
    return videojs(id,options,function(){
        this.muted(true);
    });
};

// {width:$(window).width(),height:$(window).height()}
export default function T_mpShorts({data}:{data:T_SHORTS[]}) {
    const shortsVideo = useRef();
    const nextVideo = useRef();
    const shortsVideoPlay = () => {
        shortsVideo.current.play();
    }
    useEffect(()=>{
        shortsVideo.current = useGreenRoomVideo("shorts-video");
        nextVideo.current = useGreenRoomVideo("next-video");
    },[]);
    useEffect(()=>{
        new Swiper(".swiper-container",{
            direction:"vertical",
            height:window.outerHeight
        });
    },[data]);
    useEffect(()=>{
        console.log(data);
        if(data.length && shortsVideo.current){
            $(".swiper-slide-active .m-mpShorts").append(shortsVideo.current.el_);
            shortsVideo.current.src(data[0].sources[0]);
            shortsVideoPlay();
        }
    });

    return (<section className="p-mpShorts__player t-mpShorts" id="mpShorts">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide">
                        <M_mpShorts></M_mpShorts>
                    </article>);
                })}
            </div>
        </div>
    </section>);
}


function M_mpShorts(){
    return (<div className="m-mpShorts"></div>);
}