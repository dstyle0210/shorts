"use client"; // mp === mabongpapa
import { useEffect, useState } from "react";
import "./page.scss";
export default function MpShortsPage() {
    const [data,setData] = useState([]);
    useEffect(()=>{
        fetch("https://gist.githubusercontent.com/dstyle0210/16d47c8a7ca2d8981329af68cb7a6739/raw/28c4094ae48892efb71d5122c1fd72904088439b/media.json")
        .then(async (res) => {
            const origin = await res.json();
            setData(origin.categories[0].videos);
        });
    },[]);

    return (
        <div className="p-mpShorts">
            <section className="p-mpShorts__player t-mpShorts">
                <div className="t-mpShorts__list swiper-container">
                    <div className="swiper-wrapper">
                        {data.map((shorts:{title:string,sources:string[]},idx)=>{
                            return (<article key={idx} className="swiper-slide m-mpShorts">
                                {shorts.title}
                                {shorts.sources[0]}
                            </article>);
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}