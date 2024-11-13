import { useRef,useEffect, useContext, forwardRef,MutableRefObject} from "react";
import Swiper from 'swiper';
import 'swiper/css';
import { ShortsContext } from "@/app/contexts/shortsContext";
import useElement from "../../hooks/useElement";
import M_ShortsVideo , {I_ShortsVideoRef} from "../molecules/ShortsVideo";
import M_mpShortsFilm , {I_mpShortsFilmRef} from "../molecules/mpShortsFilm";

export default forwardRef(function mpShortsSwiper(props_,ref) {
    // props
    const Props = {
        data:null,
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    // computed
    const shortsContext = useContext(ShortsContext);
    const data = Props.data ? Props.data : shortsContext.data;
    const [root,rootRef] = useElement<HTMLElement>();
    const [greenRoomEl,greenRoomRef] = useElement<HTMLElement>();
    const shortsVideoRef = useRef<I_ShortsVideoRef>(null); // 현재 비디오
    const prevVideoRef = useRef<I_ShortsVideoRef>(null); // 이전 비디오
    const nextVideoRef = useRef<I_ShortsVideoRef>(null); // 다음 비디오
    const filmRef = useRef<I_mpShortsFilmRef>(null); // 필름

    const swiperObj = useRef<Swiper>();
    const swiperIdx = useRef(Props.initIdx);

    type fn_setSlideProps = {idx:number,videoRef:MutableRefObject<I_ShortsVideoRef>,swiper?:Swiper,isAutoplay?:boolean};
    const fn = {
        setProps:(defaultProp,paramProp) => { return {...defaultProp,...paramProp}; },
        setSlide(slideProps_:fn_setSlideProps){
            const {idx,videoRef,swiper,isAutoplay}:fn_setSlideProps = fn.setProps({
                swiper:swiperObj.current,
                isAutoplay:false
            },slideProps_);

            const source = data[idx]?.sources[0];
            const poster = data[idx]?.thumb;
            const slide = swiper.slides[idx];
            const isContinue = !!source && !!slide;

            if(isContinue){
                slide.append( videoRef.current.video.el_ );
                videoRef.current.src(source);
                videoRef.current.poster(poster);
                if(isAutoplay) videoRef.current.play();
                return slide;
            }else{
                greenRoomEl.append( videoRef.current.video.el_ );
                return greenRoomEl;
            };
        },
        currentSlide(swiper?:Swiper){
            fn.setSlide({idx:swiperIdx.current,videoRef:shortsVideoRef,swiper,isAutoplay:true}).append(filmRef.current.el);
        },
        prevNextSlide(swiper?:Swiper){
            fn.setSlide({idx:swiperIdx.current+1,videoRef:nextVideoRef,swiper});
            fn.setSlide({idx:swiperIdx.current-1,videoRef:prevVideoRef,swiper});
        }
    };

    const handle = {
        pause(){
            shortsVideoRef.current.pause();
        },
        play(){
            shortsVideoRef.current.play();
        }
    }

    useEffect(()=>{
        if(!data.length) return;
        swiperObj.current = new Swiper(root,{
            initialSlide:swiperIdx.current,
            direction:"vertical",
            on:{
                afterInit(swiper) {
                    console.log(filmRef.current.el);
                }
            }
        });
        swiperObj.current.on("slideChangeTransitionEnd",(swiper)=>{
            swiperIdx.current = swiper.realIndex;
            fn.currentSlide(swiper);
            fn.prevNextSlide(swiper);
        });

        fn.currentSlide(swiperObj.current);
        fn.prevNextSlide(swiperObj.current);

        if( shortsVideoRef.current ) {
            shortsContext.setShortsVideo(shortsVideoRef.current.video);
        };

        return () => {
            swiperObj.current.destroy();
        };
    },[data]);

    return (
        <div ref={rootRef} className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts,idx)=>{
                    return (<article key={idx} className="swiper-slide"></article>);
                })}
            </div>
            <div ref={greenRoomRef} style={{"display":"none"}}>
                <M_ShortsVideo ref={shortsVideoRef} source={data.length ? data[0].sources[0] : ""} isAutoplay={true} ></M_ShortsVideo>
                <M_ShortsVideo ref={prevVideoRef} isAutoplay={false} ></M_ShortsVideo>
                <M_ShortsVideo ref={nextVideoRef} isAutoplay={false} ></M_ShortsVideo>
                <M_mpShortsFilm 
                    ref={filmRef}
                    video={shortsVideoRef.current?.video}
                    onPause={handle.pause}
                    onPlay={handle.play}
                ></M_mpShortsFilm>
            </div>
            <div style={{"position":"fixed","bottom":"0","left":"0","zIndex":"10000"}}>
                <button onClick={handle.pause}>멈춤</button>
            </div>
        </div>
    );
});