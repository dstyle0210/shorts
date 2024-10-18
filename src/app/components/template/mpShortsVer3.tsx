import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, MutableRefObject} from "react";
import { setTimeout, clearTimeout } from "timers";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식

export default forwardRef(function mpShortsVer3(props_:{data:any[]},ref) {
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
    const greenRoomRef = useRef<HTMLDivElement>(null);

    // Videojs Ref Function
    const videojsFn = {
        create(videoId:string,videoJsOption_?:{width?:number,height?:number}):Promise<Player>{
            return new Promise((res,rej)=>{
                if(!greenRoomRef.current) return; // 대기실이 없다면 안만듬 (ex : 초기접속)
                const videoJsOption = {
                    width:window.outerWidth,
                    height:window.outerHeight,
                    ...videoJsOption_
                };
                greenRoomRef.current.insertAdjacentHTML("beforeend",`<video id=${videoId} class="video-js" preload="auto" playsinline></video>`);
                videojs(videoId,videoJsOption,function(){
                    this.muted(true);
                    res(this);
                });
            });
        }
    }

    // Swiper Ref Function
    const swiperFn = {
        create():Promise<Swiper>{
            return new Promise((res,rej)=>{
                console.log("swiperFn.create");
                swiper.current = new Swiper(".swiper-container",{
                    initialSlide:activeSlideIdx.current,
                    direction:"vertical",
                    on:{
                        afterInit:(swiper)=>{
                            console.log("afterInit");
                            res(swiper);
                        }
                    }
                });
                swiper.current.on("slideChangeTransitionEnd",(swiper)=>{

                });
            });
        },
        async destroy(){
            console.log("swiperFn.destroy");
            swiper.current.destroy();
        }
    };

    // Hooks
    useEffect(()=>{
        (async ()=>{
            console.log(shortsVideo.current)
            shortsVideo.current = shortsVideo.current ?? await videojsFn.create("shorts-video");
            prevVideo.current = prevVideo.current ?? await videojsFn.create("prev-video");
            nextVideo.current = nextVideo.current ?? await videojsFn.create("next-video");
        })();
    },[]);

    useEffect(()=>{
        (async ()=>{
            await swiperFn.create();
        })();
        return () => {
            (async ()=>{
                await swiperFn.destroy();
            })();
        }
    },[data]);





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
            <div className="t-mpShorts__film">
                <button className="pauseBtn">일시정지</button>
                <button className="playBtn">재생</button>
            </div>
            <div ref={greenRoomRef} className="t-mpShorts__greenRoom"></div>
        </section>);
    };
});