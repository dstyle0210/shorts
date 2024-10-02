import { useState, useEffect, useMemo, useRef, MutableRefObject} from "react";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";

type T_Video = MutableRefObject<any>;
type T_SHORTS = {title:string,sources:string[]};

export default function Sample(props:{data:any[]}) {
    const {data} = props;
    const swiper = useRef(null);
    const swiperIndex = useRef(0);
    const greenRoom:{current:HTMLDivElement} = useRef();
    const shortsVideo = useRef(null);

    // 목록에서 동영상 주소구하기
    const getVideoSrc = (eq:number) => data[eq].sources[0];
    
    // 숏츠 비디오 그린룸으로 이동
    const appendGreenRoom = (videoRef:T_Video) => {
        greenRoom.current.appendChild(videoRef.current.el_);
    };
    // 숏츠비디오 활성화 슬라이드로 이동
    const appendActiveSlide = (videoRef:T_Video) => {
        const activeSlide = swiper.current.slides[swiperIndex.current];
        activeSlide.appendChild(videoRef.current.el_);
    };

    useEffect(()=>{
        if(!data.length) return;
        swiper.current = new Swiper(".swiper-container",{
            initialSlide:swiperIndex.current,
            on:{
                afterInit:(swiper)=>{
                    swiperIndex.current = swiper.realIndex;
                },
                slideChangeTransitionEnd(swiper) {
                    swiperIndex.current = swiper.realIndex;
                    appendActiveSlide(shortsVideo);
                }
            }
        });
        appendActiveSlide(shortsVideo);
        shortsVideo.current.src(getVideoSrc(swiperIndex.current));
        shortsVideo.current.play();

        // CleanUp
        return ()=>{
            appendGreenRoom(shortsVideo);
            swiper.current.destroy();
        };
    },[data]);

    
    useEffect(()=>{
        const createVideoJs = (id:string,options?:{width?:number,height?:number}) => {
            const {width,height} = Object.assign({width:window.outerWidth,height:window.outerHeight},options);
            greenRoom.current.insertAdjacentHTML("beforeend",`<video id=${id} class="video-js" preload="auto" playsinline></video>`);
            shortsVideo.current = videojs(id,options,function(){
                this.muted(true);
            });
        };
        createVideoJs("shorts-video");
    },[]);

    return (<section className={`t-mpShorts`} id="sample">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide">
                        <M_mpShorts></M_mpShorts>
                    </article>);
                })}
            </div>
        </div>
        <div ref={greenRoom} id="greenRoom"></div>
    </section>);
}

function M_mpShorts(){
    return (<div className="m-mpShorts"></div>);
}