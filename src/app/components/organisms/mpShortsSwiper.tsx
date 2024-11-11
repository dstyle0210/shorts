import { useRef,useEffect, useContext, forwardRef,MutableRefObject} from "react";
import type Player from 'video.js/dist/types/player';
import Swiper from 'swiper';
import 'swiper/css';
import { ShortsContext } from "@/app/contexts/shortsContext";
import useElement from "../../hooks/useElement";
import M_ShortsVideo from "../molecules/ShortsVideo";

export default forwardRef(function mpShortsSwiper(props_,ref) {
    // props
    const props = {
        data:null,
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    // computed
    const data = props.data ? props.data : useContext(ShortsContext);
    const [root,rootRef] = useElement<HTMLDivElement>();
    const [greenRoomEl,greenRoomRef] = useElement<HTMLDivElement>();
    const shortsVideoRef = useRef<Player>(null); // 현재 비디오
    const prevVideoRef = useRef<Player>(null); // 이전 비디오
    const nextVideoRef = useRef<Player>(null); // 다음 비디오

    const swiperObj = useRef<Swiper>();
    const swiperIdx = useRef(props.initIdx);

    const fn = {
        setSlide({idx,videoRef,swiper}:{idx:number,videoRef:MutableRefObject<Player>,swiper:Swiper}){
            const slide = (swiper ?? swiperObj.current).slides[idx];
            slide.append( videoRef.current.el );
        },
        currentSlide(swiper?:Swiper){
            fn.setSlide({
                idx:swiperIdx.current,
                videoRef:shortsVideoRef,
                swiper:(swiper ?? swiperObj.current)
            })
        }
    }

    useEffect(()=>{
        console.log(data);
        swiperObj.current = new Swiper(root,{
            initialSlide:swiperIdx.current,
            direction:"vertical",
            on:{
                afterInit(swiper) {
                    const target = swiper.slides[swiperIdx.current];
                    target.append( shortsVideoRef.current.el );
                }
            }
        });
        swiperObj.current.on("slideChangeTransitionEnd",(swiper)=>{
            swiperIdx.current = swiper.realIndex;

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