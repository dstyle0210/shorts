import {forwardRef,useImperativeHandle} from "react";
import useElement from "../../hooks/useElement";
export default forwardRef(function mpShortsFilm(props_:{},ref){
    const [rootEl,rootRef] = useElement<HTMLDivElement>();
    useImperativeHandle(ref, () => ({
        get el(){
            return rootEl;
        }
    }));
    return (<div ref={rootRef} className="t-mpShorts__film">필름</div>);
});
