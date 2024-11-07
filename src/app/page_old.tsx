"use client"; // mp === mabongpapa
import { useRef, useEffect, useState, MutableRefObject } from "react";
import "./page.scss";
import T_mpShorts from "./components/template/mpShortsVer4";
import { ShortsContext } from "./contexts/shortsContext";

export default function MpShortsPage() {
    const [nowPage,setNowPage] = useState([]);
    // let soundText = "켜기";
    const [soundText,setSoundText] = useState("켜기");
    const mpShortsRef:MutableRefObject<any> = useRef();
    const updateData = () => {
        fetch("https://gist.githubusercontent.com/dstyle0210/16d47c8a7ca2d8981329af68cb7a6739/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json")
        .then(async (res) => {
            const origin = await res.json();
            setNowPage([...nowPage,...origin.categories[0].videos]);
        });
    };

    const muted = () => {
        const isMuted = mpShortsRef.current.isMuted;
        mpShortsRef.current.muted( !isMuted );
        setSoundText(!isMuted ? "켜기" : "끄기");
    };

    useEffect(()=>{
        setTimeout(()=>{
            updateData();
        },500); // 임의로 2초 설정 함. (즉시 실행해도 됨)
    },[]);

    useEffect(()=>{
        if(nowPage.length == 0) return;
    },[nowPage]);

    return (
        <div className="p-mpShorts">
            <T_mpShorts ref={mpShortsRef} data={nowPage}></T_mpShorts>
            <div className="p-mpShorts__tools">
                <button onClick={updateData}>데이터 밀어넣기</button>
                <button onClick={muted}>소리{soundText}</button>
            </div>
        </div>
    );
}