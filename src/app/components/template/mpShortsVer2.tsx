import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, MutableRefObject} from "react";
import { setTimeout, clearTimeout } from "timers";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";

// TODO
// 1. 화면 회전 구현(완료)
// 2. 음소거 처리(완료)
// 3. 화면 터치시 일시정지 버튼 생성 -> 클릭시 일시정지
// => 필름에서 스와이핑 할경우 안움직인가?

type T_Video = MutableRefObject<Player>;
type T_SHORTS = {title:string,sources:string[]};

export default forwardRef(function mpShortsVer2(props:{data:any[]},ref) {
    const {data} = props;
    const swiperIndex = useRef(0);
    const swiper = useRef<Swiper>();
    const shortsVideo = useRef<Player>();
    const prevVideo = useRef<Player>();
    const nextVideo = useRef<Player>();
    const greenRoomRef = useRef<HTMLDivElement>(null);
    const shortsFilmRef = useRef<HTMLDivElement>(null);
    const [orientation, setOrientation] = useState("portrait-primary");

    // 비디오 생성하고, 대기실로 이동
    const createVideoJs = (id:string,options?:{width?:number,height?:number}) => {
        const videoJsOption = Object.assign({width:window.outerWidth,height:window.outerHeight},options);
        greenRoomRef.current.insertAdjacentHTML("beforeend",`<video id=${id} class="video-js" preload="auto" playsinline></video>`);
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
        greenRoomRef.current.appendChild(videoRef.current.el_);
    };

    // 슬라이드에 비디오 넣기 + 동영상주소 및 포스터 셋팅
    const setVideoToSlide = (videoRef:T_Video , slideIndex:number = 0) => {
        if(swiper.current.destroyed) return;
        const slide = swiper.current.slides[slideIndex];
        if(!slide) return appendGreenRoom(videoRef); // 슬라이드가 없다면, 대기실로 이동
        videoRef.current.poster(getVideoPoster(slideIndex));
        videoRef.current.src(getVideoSrc(slideIndex));
        slide.appendChild(videoRef.current.el_); // 비디오 넣기
        if(swiperIndex.current==slideIndex) slide.appendChild(shortsFilmRef.current); // 필름넣기
    };

    // 전체숏츠 셋팅
    const setShorts = (currentIndex:number) => {
        setTimeout( ()=> { // add Queue
            swiperIndex.current = currentIndex; // 인덱스 저장
            setVideoToSlide(shortsVideo,swiperIndex.current); // 현재 숏츠
            setVideoToSlide(prevVideo,swiperIndex.current-1); // 이전 슬라이드 숏츠
            setVideoToSlide(nextVideo,swiperIndex.current+1); // 다음 슬라이드 숏츠
            shortsVideo.current.play(); // 현재 숏츠 재생시작
        });
    };

    const filmFn = {
        outTimer:null,
        classChange:(methodName:"show"|"hold"|"hide",tokens:string[])=>{
            shortsFilmRef.current.classList[methodName](...tokens);
        },
        show:()=>{
            shortsFilmRef.current.classList.add("-show");
            filmFn.outTimer = setTimeout(()=>{
                shortsFilmRef.current.classList.remove("-show");
            },3000);
        },
        hold:()=>{
            shortsFilmRef.current.classList.add("-hold");
        },
        hide:()=>{
            clearTimeout(filmFn.outTimer);
            shortsFilmRef.current.classList.remove("-show","-hold");
        }
    }



    const fn = {
        muted:(isMute:boolean) => {
            if(typeof isMute == "boolean"){
                shortsVideo.current.muted( isMute );
            }else{
                return shortsVideo.current.muted();
            };
        },
        pause:()=>{
            shortsVideo.current.pause();
            filmFn.hide();
            filmFn.hold();
        },
        play:()=>{
            shortsVideo.current.play();
            filmFn.hide();
        }
    }


    // Render Function
    const filmToggle = (e) => {
        e.stopPropagation();
        filmFn.show();
    };
    const pause = (e) => {
        e.stopPropagation();
        fn.pause();
    };
    const play = (e) => {
        e.stopPropagation();
        fn.play();
    };

    // Hooks
    useEffect(()=>{
        setTimeout(()=>{ // add Queue
            shortsVideo.current.width(window.outerWidth);
            shortsVideo.current.height(window.outerHeight);
        })
    },[orientation]);

    useEffect(()=>{
        setTimeout(()=>{ // add Queue
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
        })
        
        // CleanUp
        return ()=>{
            appendGreenRoom(shortsVideo);
            appendGreenRoom(prevVideo);
            appendGreenRoom(nextVideo);
            swiper.current.destroy();
        };
    },[data,orientation]);

    useEffect(()=>{
        // 비디오 오브젝트 셋팅
        shortsVideo.current = shortsVideo.current ?? createVideoJs("shorts-video");
        prevVideo.current = prevVideo.current ?? createVideoJs("prev-video");
        nextVideo.current = nextVideo.current ?? createVideoJs("next-video");
    },[]);

    useEffect(() => {
        setOrientation(window.screen.orientation.type);
        const handleOrientationChange = () => setOrientation(window.screen.orientation.type);
        window.addEventListener('orientationchange', handleOrientationChange);
        return () => window.removeEventListener('orientationchange', handleOrientationChange);
    }, []);

    // 부모에게 메소드 전달
    useImperativeHandle(ref, () => ({muted:fn.muted}));

    return (<section className={`t-mpShorts`} id="sample">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide"></article>);
                })}
            </div>
        </div>
        <div ref={shortsFilmRef} className="t-mpShorts__film" onClick={filmToggle}>
            <button className="pauseBtn" onClick={pause}>일시정지</button>
            <button className="playBtn" onClick={play}>재생</button>
        </div>
        <div ref={greenRoomRef}></div>
    </section>);
});