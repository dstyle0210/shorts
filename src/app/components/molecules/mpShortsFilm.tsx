import {forwardRef,useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";

type T_mpShortsFilmProps = {
    onPause():void
}
export default forwardRef(function mpShortsFilm(props_:T_mpShortsFilmProps,ref){
    const [rootEl,rootRef] = useElement<HTMLDivElement>();
    const {onPause} = props_;
    useImperativeHandle(ref, () => ({
        get el(){
            return rootEl;
        }
    }));
    return (<div ref={rootRef} className="t-mpShorts__film">
        <div className="m-mpShortsControl">
            <button className="pauseBtn" onClick={onPause}>일시정지</button>
        </div>
    </div>);
});
