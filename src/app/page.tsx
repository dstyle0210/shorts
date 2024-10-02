"use client"; // mp === mabongpapa
import { useRef, useEffect, useState } from "react";
import "./page.scss";
import ActiveShorts from "./components/organism/activeShorts";
export default function MpShortsPage() {
    const [nowPage,setNowPage] = useState([]);
    const [src,setSrc] = useState("");
    const updateData = () => {
        fetch("https://gist.githubusercontent.com/dstyle0210/16d47c8a7ca2d8981329af68cb7a6739/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json")
        .then(async (res) => {
            const origin = await res.json();
            setNowPage([...nowPage,...origin.categories[0].videos]);
        });
    };
    useEffect(()=>{
        updateData();
    },[]);


    let eq = 0;
    const activeVideoRef = useRef({
        src:(src:string)=>{},
        play:()=>{}
    });
    const changeSrc = () => {
        eq++;
        activeVideoRef.current.src(nowPage[eq].sources[0]);
        activeVideoRef.current.play();
    }
    const moveComponent = () => {
        const comp = document.querySelector("#activeVideoPlayer");
        const test = document.querySelector("#test");
        test.appendChild(comp);
    };

    return (
        <div>
            <button onClick={changeSrc}>바꿔요</button>
            <button onClick={moveComponent}>옮겨요</button>
            <div className="p-mpShorts">
                <ActiveShorts ref={activeVideoRef} id="activeVideoPlayer" src={src} width={400} height={200}></ActiveShorts>
            </div>
            ---
            <div className="p-mpShorts" id="test"></div>
        </div>
        
    );
}