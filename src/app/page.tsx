"use client"; // mp === mabongpapa
import { useRef, useEffect, useState, MutableRefObject } from "react";
import "./page.scss";
import T_mpShorts from "./components/template/mpShortsVer4";
import { ShortsContext } from "./contexts/shortsContext";

export default function MpShortsPage() {
    console.log("--page--");
    const [shorts,setShorts] = useState([]);

    const updateData = () => {
        fetch("https://gist.githubusercontent.com/dstyle0210/16d47c8a7ca2d8981329af68cb7a6739/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json")
        .then(async (res) => {
            const origin = await res.json();
            setShorts([...shorts,...origin.categories[0].videos]);
        });
    };

    useEffect(()=>{
        updateData();
    },[]);

    return (
        <ShortsContext.Provider value={shorts}>
        <div className="p-mpShorts">
            <T_mpShorts ></T_mpShorts>
            <div className="p-mpShorts__tools">
                <button onClick={updateData}>데이터 밀어넣기</button>
            </div>
        </div>
        </ShortsContext.Provider>
    );
}