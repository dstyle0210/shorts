import { useRef,useEffect, useContext, forwardRef} from "react";
import Swiper from 'swiper';
import 'swiper/css';
import 'video.js/dist/video-js.css';
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
    const [greenRoom,greenRoomRef] = useElement<HTMLDivElement>();
    const shortsVideoRef = useRef(null); // 현재 비디오
    const nextVideoRef = useRef(null); // 다음 비디오

    const swiperObj = useRef<Swiper>();
    const swiperIdx = useRef(props.initIdx);

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
                    return (<article key={idx} className="swiper-slide">
                        
                    </article>);
                })}
            </div>
            <div ref={greenRoomRef} style={{"display":"none"}}>
                <M_ShortsVideo ref={shortsVideoRef} source={data.length ? data[0].sources[0] : ""} isAutoplay={true} ></M_ShortsVideo>
                <M_ShortsVideo ref={nextVideoRef} source={data.length ? data[1].sources[0] : ""} isAutoplay={false} ></M_ShortsVideo>
            </div>
        </div>
    );
});