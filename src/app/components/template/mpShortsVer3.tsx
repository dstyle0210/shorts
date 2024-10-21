import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, MutableRefObject} from "react";
import { setTimeout, clearTimeout } from "timers";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";

type T_Video = MutableRefObject<Player>;
type T_Data = {thumb:string,sources:string[]}[]

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식

export default forwardRef(function mpShortsVer3(props_:{data:T_Data},ref) {
    // props
    const props = {
        data:[],
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    // computed
    const data = props.data;
    const swiper = useRef<Swiper>();
    const activeSlideIdx = useRef(props.initIdx); // 현재 보여지고 있는 인덱스
    const shortsVideo = useRef<Player>();
    const prevVideo = useRef<Player>();
    const nextVideo = useRef<Player>();
    const greenRoomRef = useRef<HTMLDivElement>(null); // 비디오가 들어가는 대기실
    const filmRef = useRef<HTMLDivElement>(null); // 숏츠 위 필름(일시정지, 프로그래스 등, 기능버튼 들어가는 부분)

    // data Function
    const dataFn = {
        getVideoPoster:(dataIdx:number) => (data[dataIdx]?.thumb ?? ""),
        getVideoSrc:(dataIdx:number) => (data[dataIdx]?.sources[0] ?? "")
    }

    // Film Ref Function
    const filmFn = {
        appendSlide(slideIdx:number = activeSlideIdx.current){
            swiperFn.getSlide(slideIdx).append(filmRef.current);
        },
        appendGreenRoom(){
            greenRoomRef.current.append(filmRef.current);
        }
    }

    // Videojs Ref Function
    const videojsFn = {
        insertVideoElement(videoId:string){
            greenRoomRef.current.insertAdjacentHTML("beforeend",`<video id=${videoId} class="video-js" preload="auto" playsinline></video>`);
            return videoId;
        },
        create(videoId_:string,videoJsOption_?:{width?:number,height?:number}):Player|null{
            const videoId = videojsFn.insertVideoElement(videoId_); // videojs를 만들어낼 엘리먼트 대기실에 생성
            if(videoId=="") return null; // 대기실이 없으면, 생성되지 않음.
            const videoJsOption = {
                width:window.outerWidth,
                height:window.outerHeight,
                ...videoJsOption_
            };
            return videojs(videoId,videoJsOption,function(){
                this.muted(true);
            });
        },
        setSrc(videoRef:T_Video , dataIdx:number){
            return videoRef.current.src( dataFn.getVideoSrc(dataIdx) );
        },
        setPoster(videoRef:T_Video , dataIdx:number){
            return videoRef.current.poster(dataFn.getVideoPoster(dataIdx));
        },
        appendSlide(videoRef:T_Video , slideIdx:number){
            videojsFn.setPoster(videoRef,slideIdx);
            if( !!swiperFn.getSlide(slideIdx) ){
                swiperFn.getSlide(slideIdx).append(videoRef.current.el_);
            }else{
                videojsFn.appendGreenRoom(videoRef);
            };
        },
        appendGreenRoom(videoRef:T_Video){
            greenRoomRef.current.append(videoRef.current.el_);
        },
        playToShorts(){
            shortsVideo.current.play();
            console.log("play url : "+shortsVideo.current.cache_.sources[0].src);
        }
    }

    // Swiper Ref Function
    const swiperFn = {
        getSlide(idx:number){
            return swiper.current.slides[idx]; // 슬라이드
        },
        create():Swiper{
            console.log("swiperFn.create");
            const swiper_ = new Swiper(".swiper-container",{
                initialSlide:activeSlideIdx.current,
                direction:"vertical"
            });
            swiper_.on("slideChangeTransitionEnd",(swiper)=>{
                activeSlideIdx.current = swiper.realIndex;
                videojsFn.appendSlide(shortsVideo,swiper.realIndex);
                videojsFn.appendSlide(prevVideo,swiper.realIndex - 1);
                videojsFn.appendSlide(nextVideo,swiper.realIndex + 1);
                videojsFn.setSrc(shortsVideo,swiper.realIndex);
                videojsFn.playToShorts();
                filmFn.appendSlide(swiper.realIndex);
            });
            return swiper_;
        },
        destroy(){
            console.log("swiperFn.destroy");
            return swiper.current.destroy();
        }
    };

    // Handle Function
    const handleFn = {
        play(){
            videojsFn.playToShorts();
        }
    }

    // Hooks
    useEffect(()=>{
        if(data.length==0) return;

        shortsVideo.current = shortsVideo.current ?? videojsFn.create("shorts-video");
        prevVideo.current = prevVideo.current ?? videojsFn.create("prev-video");
        nextVideo.current = nextVideo.current ?? videojsFn.create("next-video");

        swiper.current = swiperFn.create();
        videojsFn.appendSlide(shortsVideo,activeSlideIdx.current);
        videojsFn.appendSlide(prevVideo,activeSlideIdx.current - 1);
        videojsFn.appendSlide(nextVideo,activeSlideIdx.current + 1);
        filmFn.appendSlide(activeSlideIdx.current);
        if(!shortsVideo.current.cache_.sources.length){ // 이전에 로드된 적이 없다면
            videojsFn.setSrc(shortsVideo,activeSlideIdx.current);
        };
        videojsFn.playToShorts();

        return () => {
            swiperFn.destroy();
            videojsFn.appendGreenRoom(shortsVideo);
            videojsFn.appendGreenRoom(prevVideo);
            videojsFn.appendGreenRoom(nextVideo);
            filmFn.appendGreenRoom();

        };
    },[data]);
    // init 

    // Render
    if(data.length==0){
        return (<section className={`t-mpShorts`} id="sample">
            <div className="t-mpShorts__renderBefore">초기로딩중(임의 2초설정)</div>
        </section>);
    }else{
        return (<section className={`t-mpShorts`} id="sample">
            <div className="t-mpShorts__list swiper-container">
                <div className="swiper-wrapper">
                    {data.map((shorts,idx)=>{
                        return (<article key={idx} className="swiper-slide"></article>);
                    })}
                </div>
            </div>
            <div ref={filmRef} className="t-mpShorts__film">
                <button className="pauseBtn">일시정지</button>
                <button className="playBtn">재생</button>
            </div>
            <div ref={greenRoomRef} className="t-mpShorts__greenRoom"></div>
        </section>);
    };
});