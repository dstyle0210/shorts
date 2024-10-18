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
// 3. 화면 터치시 일시정지 버튼 생성 -> 클릭시 일시정지 (완료)

// 4. 데이터 밀어 넣으면 부셨다가 다시 생성하다보니, 비디오 엘리먼트가 사라짐? (완료)
// => 어디 보냈다가 다시 가져와야 할듯.

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식


type T_Video = MutableRefObject<Player>;
type T_SHORTS = {title:string,sources:string[]};

export default forwardRef(function mpShortsVer2(props_:{data:any[]},ref) {
    // props
    const defaultProps = {
        data:[],
        orientation:"portrait-primary"
    };
    const props = {...defaultProps , ...props_}
    
    // computed
    const data = props.data; // 전달받은 전체 데이터
    const swiperIndex = useRef(0);
    const swiper = useRef<Swiper>();
    const shortsVideo = useRef<Player>();
    const prevVideo = useRef<Player>();
    const nextVideo = useRef<Player>();
    const greenRoomRef = useRef<HTMLDivElement>(null);
    const shortsFilmRef = useRef<HTMLDivElement>(null);
    const [orientation, setOrientation] = useState(props.orientation);

    // Shorts Method
    const shortsFn = {
        // video element 및 videojs 생성(대기실에 생성함)
        createVideoJs(videoId:string,videoJsOption_?:{width?:number,height?:number}){
            const videoJsOption = {
                width:window.outerWidth,
                height:window.outerHeight,
                ...videoJsOption_
            };
            greenRoomRef.current.insertAdjacentHTML("beforeend",`<video id=${videoId} class="video-js" preload="auto" playsinline></video>`);
            return videojs(videoId,videoJsOption,function(){
                this.muted(true);
            });
        },
        // 비디오 엘리먼트를 대기실로 이동
        appendGreenRoom(videoRef:T_Video){
            greenRoomRef.current.appendChild(videoRef.current.el_);
        },
        appendVideoToSlide(videoRef:T_Video , slideIndex:number = 0){
            if(!swiper.current || swiper.current.destroyed) return; // 스와이퍼가 없다면, 동작 무의미.

            const slide = swiper.current.slides[slideIndex];
            if(!slide){
                shortsFn.appendGreenRoom(videoRef); // 슬라이드가 없다면, 대기실로 이동
            }else{
                videoRef.current.poster(shortsFn.getVideoPoster(slideIndex));
                slide.appendChild(videoRef.current.el_); // 비디오 넣기
                if(swiperIndex.current==slideIndex) slide.appendChild(shortsFilmRef.current); // 필름넣기
            };
            
        },
        async playShortsVideo(){
            shortsVideo.current.src(shortsFn.getVideoSrc(swiperIndex.current));
            handle.play(); // 현재 숏츠 재생시작
        },
        setShorts:(currentIndex:number) => {
            return new Promise((res,rej)=>{
                setTimeout(()=>{
                    swiperIndex.current = currentIndex; // 인덱스 저장
                    shortsFn.appendVideoToSlide(shortsVideo,swiperIndex.current); // 현재 숏츠
                    shortsFn.appendVideoToSlide(prevVideo,swiperIndex.current-1); // 이전 슬라이드 숏츠
                    shortsFn.appendVideoToSlide(nextVideo,swiperIndex.current+1); // 다음 슬라이드 숏츠
                    console.log("요기");
                    res(this);
                });
            });
        },
        getVideoSrc:(eq:number) => data[eq].sources[0],
        getVideoPoster:(eq:number) => data[eq].thumb
    }

    // Handle Function
    const filmHandle = {
        outTimer:null,
        clear:()=>{ // 필름 초기화
            clearTimeout(filmHandle.outTimer);
            shortsFilmRef.current.classList.remove("-show","-hold");
        },
        show:()=>{ // 필름 보이기
            filmHandle.clear();
            shortsFilmRef.current.classList.add("-show");
            filmHandle.outTimer = setTimeout(filmHandle.clear,3000);
        },
        hold:()=>{ // 필름 고정(일시정지)
            filmHandle.clear();
            shortsFilmRef.current.classList.add("-hold");
        },
        hide:()=>{ // 필름 숨기기
            filmHandle.clear();
        },
        get isShow(){
            return ((cl)=> (cl.contains("-show") || cl.contains("-hold")) )(shortsFilmRef.current.classList);
        }
    };

    const handle = {
        muted:(isMute:boolean) => {
            if(typeof isMute == "boolean"){
                shortsVideo.current.muted( isMute );
            }else{
                return shortsVideo.current.muted();
            };
        },
        pause:()=>{
            shortsVideo.current.pause();
            filmHandle.hold();
        },
        play:()=>{
            shortsVideo.current.play();
            filmHandle.hide();
        }
    };
    useImperativeHandle(ref, () => (handle)); // 부모에게 핸들 전달


    // Event Listener Function
    const onEvents = {
        filmClick:(e) => {
            e.stopPropagation();
            filmHandle[filmHandle.isShow ? "hide" : "show"]();
        },
        pauseBtnClick:(e) => {
            e.stopPropagation();
            handle.pause();
        },
        playBtnClick:(e) => {
            e.stopPropagation();
            handle.play();
        }
    };

    // Hooks
    useEffect(()=>{
        console.log("[orientation] 숏츠 가로세로 설정");
        setTimeout(()=>{ // add Queue
            shortsVideo.current.width(window.outerWidth);
            shortsVideo.current.height(window.outerHeight);
        })
    },[orientation]);

    useEffect(()=>{
        console.log("[data,orientation] swiper 설정");
        setTimeout(()=>{ // add Queue
            swiper.current = new Swiper(".swiper-container",{
                initialSlide:swiperIndex.current,
                direction:"vertical",
                on:{
                    afterInit:async (swiper)=>{
                        console.log("afterInit");
                        await shortsFn.setShorts(swiper.realIndex); // 비디오를 셋팅만 한다.
                    }
                }
            });
            swiper.current.on("slideChangeTransitionEnd",async (swiper)=>{
                await shortsFn.setShorts(swiper.realIndex);
                shortsFn.playShortsVideo();
            });
        });
        
        // CleanUp
        return ()=>{
            console.log("[data,orientation] swiper 설정 클린업");
            shortsFn.appendGreenRoom(shortsVideo);
            shortsFn.appendGreenRoom(prevVideo);
            shortsFn.appendGreenRoom(nextVideo);
            swiper.current.destroy();
        };
    },[data,orientation]);

    // 비디오 오브젝트 셋팅
    useEffect(()=>{
        console.log("[] 비디오셋팅");
        shortsVideo.current = shortsFn.createVideoJs("shorts-video");
        prevVideo.current = shortsFn.createVideoJs("prev-video");
        nextVideo.current = shortsFn.createVideoJs("next-video");
    },[]);

    // 종휭 뷰 설정
    useEffect(() => {
        console.log("[] 종휭 뷰 설정");
        setOrientation(window.screen.orientation.type);
        const handleOrientationChange = () => setOrientation(window.screen.orientation.type);
        window.addEventListener('orientationchange', handleOrientationChange);
        return () => window.removeEventListener('orientationchange', handleOrientationChange);
    }, []);

    useEffect(() => {
        if(data.length && shortsVideo.current.src() == ""){
            shortsFn.playShortsVideo();
        };
    },[data]);

    return (<section className={`t-mpShorts`} id="sample">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide"></article>);
                })}
            </div>
        </div>
        <div ref={shortsFilmRef} className="t-mpShorts__film" onClick={onEvents.filmClick}>
            <button className="pauseBtn" onClick={onEvents.pauseBtnClick}>일시정지</button>
            <button className="playBtn" onClick={onEvents.playBtnClick}>재생</button>
        </div>
        <div ref={greenRoomRef} className="t-mpShorts__greenRoom"></div>
    </section>);
});