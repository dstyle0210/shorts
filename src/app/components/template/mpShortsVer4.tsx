import { useState, useEffect, useMemo, useRef,useContext, forwardRef, useImperativeHandle, MutableRefObject, MouseEventHandler, useCallback} from "react";
import { setTimeout, clearTimeout } from "timers";
import videojs from "video.js";
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';
import "./mpShorts.scss";
import useElement from "../../hooks/useElement";
import O_mpShortsSwiper from "../organisms/mpShortsSwiper";


type T_Video = MutableRefObject<Player>;
type T_Data = T_videos;

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식

export default forwardRef(function mpShortsVer4({},ref) {
    console.log("--mpShortsVer4--");
    const [root,rootRef] = useElement<HTMLDivElement>();
    console.log(root);
    return (<section ref={rootRef}>
        <O_mpShortsSwiper></O_mpShortsSwiper>
    </section>);
});

