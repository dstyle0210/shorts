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
    const prevVideo = useRef(null);
    const nextVideo = useRef(null);

    // 비디오 생성하고, 대기실로 이동
    const createVideoJs = (id:string,options?:{width?:number,height?:number}) => {
        const videoJsOption = Object.assign({width:window.outerWidth,height:window.outerHeight},options);
        greenRoom.current.insertAdjacentHTML("beforeend",`<video id=${id} class="video-js" preload="auto" playsinline></video>`);
        return videojs(id,videoJsOption,function(){
            this.muted(true);
        });
    };

    // 목록에서 동영상 주소구하기
    const getVideoSrc = (eq:number) => data[eq].sources[0];
    const getVideoPoster = (eq:number) => data[eq].thumb;
    
    // 숏츠 비디오 그린룸으로 이동
    const appendGreenRoom = (videoRef:T_Video) => {
        videoRef.current.pause();
        greenRoom.current.appendChild(videoRef.current.el_);
    };

    // 슬라이드에 비디오 넣기 + 동영상주소 및 포스터 셋팅
    const setVideoToSlide = (videoRef:T_Video , slideIndex:number) => {
        const slide = swiper.current.slides[slideIndex];
        if(!slide) return appendGreenRoom(videoRef); // 슬라이드가 없다면, 대기실로 이동
        slide.appendChild(videoRef.current.el_);
        videoRef.current.poster(getVideoPoster(slideIndex));
        videoRef.current.src(getVideoSrc(slideIndex));
    };

    // 전체숏츠 셋팅
    const setShorts = (currentIndex:number) => {
        setTimeout( ()=> {
            swiperIndex.current = currentIndex; // 인덱스 저장
            setVideoToSlide(shortsVideo,swiperIndex.current); // 현재 숏츠
            setVideoToSlide(prevVideo,swiperIndex.current-1); // 이전 슬라이드 숏츠
            setVideoToSlide(nextVideo,swiperIndex.current+1); // 다음 슬라이드 숏츠
            shortsVideo.current.play(); // 현재 숏츠 재생시작
        });
    };

    // Hooks
    useEffect(()=>{
        if(!data.length) return;
        swiper.current = new Swiper(".swiper-container",{
            initialSlide:swiperIndex.current,
            direction:"vertical",
            on:{
                afterInit:(swiper)=>{
                    setShorts(swiper.realIndex);
                },
                slideChangeTransitionEnd(swiper) {
                    setShorts(swiper.realIndex);
                } 
            }
        });

        // CleanUp
        return ()=>{
            appendGreenRoom(shortsVideo);
            appendGreenRoom(prevVideo);
            appendGreenRoom(nextVideo);
            swiper.current.destroy();
        };
    },[data]);

    
    useEffect(()=>{
        // 비디오 오브젝트 셋팅
        shortsVideo.current = shortsVideo.current ?? createVideoJs("shorts-video");
        prevVideo.current = prevVideo.current ?? createVideoJs("prev-video");
        nextVideo.current = nextVideo.current ?? createVideoJs("next-video");
    },[]);

    return (<section className={`t-mpShorts`} id="sample">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide"></article>);
                })}
            </div>
        </div>
        <div ref={greenRoom} id="greenRoom"></div>
    </section>);
}