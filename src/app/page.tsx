"use client"; // mp === mabongpapa
import { useEffect, useState } from "react";
import "./page.scss";
import T_mpShorts from "./components/template/mpShorts";
export default function MpShortsPage() {
    const [nowPage,setNowPage] = useState([]);
    useEffect(()=>{
        fetch("https://gist.githubusercontent.com/dstyle0210/16d47c8a7ca2d8981329af68cb7a6739/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json")
        .then(async (res) => {
            const origin = await res.json();
            setNowPage(origin.categories[0].videos);
        });
    },[]);

    return (
        <div className="p-mpShorts">
            <T_mpShorts data={nowPage}></T_mpShorts>
        </div>
    );
}