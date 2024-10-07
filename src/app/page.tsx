"use client"; // mp === mabongpapa
import { useRef, useEffect, useState } from "react";
import "./page.scss";
import T_mpShorts from "./components/template/mpShortsVer2";
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

    useEffect(()=>{
        if(nowPage.length == 0) return;
    },[nowPage]);

    return (
        <div className="p-mpShorts">
            <T_mpShorts data={nowPage}></T_mpShorts>
            <div className="p-mpShorts__tools">
                <button onClick={updateData}>데이터 밀어넣기</button>
            </div>
        </div>
    );
}