import { useState, useEffect, useMemo, useRef,useContext, forwardRef, useImperativeHandle, MutableRefObject, MouseEventHandler, useCallback} from "react";
import { setTimeout, clearTimeout } from "timers";
import "./mpShorts.scss";
import { ShortsContext } from "../../contexts/shortsContext";
import useElement from "../../hooks/useElement";
import O_mpShortsSwiper from "../organisms/mpShortsSwiper";

// 아래 부터는 ver3 로 이관
// 5. seek 기능 생성 + seek 비디오 생성(진행율 확인용)
// => seek 의 길이가 전체 비중이 되어야 함.
// 6. 플레이가 끝나면 다시재생
// 7. 일시 정지인 상황에서 스와이핑 되면 안됨.
// 8. 데이터 로딩 구현
// 9. 데이터 인덱스로 구현 (?idx=4) 같은 식
interface mpShortsVer4Props {
    data:T_videos,
    initIdx?:0,
    orientation?:string,
};
export default function mpShortsVer4(props_:mpShortsVer4Props) {
    // props
    const props = {
        data:[],
        initIdx:0,
        orientation:"portrait-primary",
        ...props_
    };

    // computed
    const [root,rootRef] = useElement<HTMLDivElement>();
    const data = props.data;

    return (
        <ShortsContext.Provider value={data}>
        <section ref={rootRef} className="t-mpShorts">
            <O_mpShortsSwiper></O_mpShortsSwiper>
        </section>
        </ShortsContext.Provider>
    );
}

