import { useState, useEffect, useRef} from "react";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";

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

export default function T_mpShorts(props:{modifier?:string,data:T_SHORTS[]}) {
    // Props
    const {modifier,data} = Object.assign({modifier:"",data:[]},props);

    // State, Ref

    const shortsIndex = useRef(0);
    const shortsVideo = useRef(null);
    const nextVideo = useRef(null);
    const swiper = useRef(null);

    // method
    const shortsVideoPlay = () => {
        console.log(data[shortsIndex.current].sources[0]);
        shortsVideo.current.src(data[shortsIndex.current].sources[0]);
        shortsVideo.current.play();
    }

    // 숏츠를 현재 슬라이더에 이동시킨다.
    const appendToShortsVideo = () => {
        console.log(swiper.current);
        // console.log( $(swiper.current.$el) );
    }

    // hooks
    useEffect(()=>{
        shortsVideo.current = useGreenRoomVideo("shorts-video");
        nextVideo.current = useGreenRoomVideo("next-video");
    },[]);
    useEffect(()=>{
        if(data.length==0) return;
        swiper.current = new Swiper(".swiper-container",{
            direction:"vertical",
            height:window.outerHeight,
            on:{
                afterInit:(swiper)=>{
                    shortsIndex.current = swiper.realIndex;
                    console.log('a0');
                    appendToShortsVideo(); // 숏츠비디오 이동
                    shortsVideoPlay();
                }
            }
        }).on("slideChangeTransitionEnd",(swiper) => {
            shortsIndex.current = swiper.realIndex;
            console.log('a1');
            appendToShortsVideo(); // 숏츠비디오 이동
            shortsVideoPlay();
        });
    },[data]);
    useEffect(()=>{
        if(data.length && shortsVideo.current){
            $(".swiper-slide-active .m-mpShorts").append(shortsVideo.current.el_);
            shortsVideo.current.src(data[0].sources[0]);
        }
        if(data.length && nextVideo.current){
            $(".swiper-slide-next .m-mpShorts").append(nextVideo.current.el_);
            nextVideo.current.src(data[1].sources[0]);
        }
    });

    // render
    return (<section className={`t-mpShorts ${modifier}`} id="mpShorts">
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