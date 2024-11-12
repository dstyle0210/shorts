import { useRef,useEffect, useContext, forwardRef,MutableRefObject} from "react";
import type Player from 'video.js/dist/types/player';
import Swiper from 'swiper';
import 'swiper/css';
import { ShortsContext } from "@/app/contexts/shortsContext";
import useElement from "../../hooks/useElement";
import M_ShortsVideo from "../molecules/ShortsVideo";
import type {ShortsVideoRef} from "../molecules/ShortsVideo";


export default forwardRef(function mpShortsSwiper(props_,ref) {
    // props
    const Props = {
        data:null,
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    // computed
    const data = Props.data ? Props.data : useContext(ShortsContext);
    const [root,rootRef] = useElement<HTMLDivElement>();
    const [greenRoomEl,greenRoomRef] = useElement<HTMLDivElement>();
    const shortsVideoRef = useRef<ShortsVideoRef>(null); // 현재 비디오
    const prevVideoRef = useRef<ShortsVideoRef>(null); // 이전 비디오
    const nextVideoRef = useRef<ShortsVideoRef>(null); // 다음 비디오

    const swiperObj = useRef<Swiper>();
    const swiperIdx = useRef(Props.initIdx);

    const fn = {
        setProps:(defaultProp,paramProp) => { return {...defaultProp,...paramProp}; },
        setSlide(slideProps_:{idx:number,videoRef:MutableRefObject<ShortsVideoRef>,swiper?:Swiper,isAutoplay?:boolean}){
            const {idx,videoRef,swiper,isAutoplay} = fn.setProps({
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
            }else{
                greenRoomEl.append( videoRef.current.video.el_ );
            };
        },
        currentSlide(swiper?:Swiper){
            fn.setSlide({idx:swiperIdx.current,videoRef:shortsVideoRef,swiper,isAutoplay:true});
        },
        prevNextSlide(swiper?:Swiper){
            fn.setSlide({idx:swiperIdx.current+1,videoRef:nextVideoRef,swiper});
            fn.setSlide({idx:swiperIdx.current-1,videoRef:prevVideoRef,swiper});
        }
    }

    useEffect(()=>{
        console.log(data);
        swiperObj.current = new Swiper(root,{
            initialSlide:swiperIdx.current,
            direction:"vertical",
            on:{
                afterInit(swiper) {
                    fn.currentSlide(swiper);
                    fn.prevNextSlide(swiper);
                }
            }
        });
        swiperObj.current.on("slideChangeTransitionEnd",(swiper)=>{
            swiperIdx.current = swiper.realIndex;
            fn.currentSlide(swiper);
            fn.prevNextSlide(swiper);
        });
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
                <M_ShortsVideo ref={prevVideoRef} source={data.length ? data[2].sources[0] : ""} isAutoplay={false} ></M_ShortsVideo>
                <M_ShortsVideo ref={nextVideoRef} source={data.length ? data[1].sources[0] : ""} isAutoplay={false} ></M_ShortsVideo>
            </div>
        </div>
    );
});