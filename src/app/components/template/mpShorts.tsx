import { useEffect } from "react";

type T_SHORTS = {title:string,sources:string[]};

export default function T_mpShorts({data}:{data:T_SHORTS[]}) {
    useEffect(()=>{
        // 그린룸 생성
    },[])
    return (<section className="p-mpShorts__player t-mpShorts" id="mpShorts">
        <div className="t-mpShorts__list swiper-container">
            <div className="swiper-wrapper">
                {data.map((shorts:T_SHORTS,idx)=>{
                    return (<article key={idx} className="swiper-slide m-mpShorts">
                        {shorts.title}
                        {shorts.sources[0]}
                    </article>);
                })}
            </div>
        </div>
    </section>);
}