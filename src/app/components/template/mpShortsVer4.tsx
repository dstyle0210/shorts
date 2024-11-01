import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, MutableRefObject, MouseEventHandler, useCallback} from "react";
import { setTimeout, clearTimeout } from "timers";
import Swiper from 'swiper';
import 'swiper/css';
import videojs from "video.js";
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";
import useElement from "../../hooks/useElement";

type T_Video = MutableRefObject<Player>;
type T_Data = {thumb:string,sources:string[]}[]

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식

export default forwardRef(function mpShortsVer4(props_:{data:T_Data},ref) {
    console.log("----- init -----");
    // props
    const props = {
        data:[],
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    const data = props.data;
    const [root,rootRef] = useElement<HTMLElement>();
    const [type,setType] = useState(100);

    useEffect(()=>{
        if(!root) return;
        console.log(root);
    },[root]);

    useEffect(()=>{
        if(!data.length) return;
        console.log(data);
    },[data]);


    return (<section ref={rootRef}>
        1231213
    </section>);
});

