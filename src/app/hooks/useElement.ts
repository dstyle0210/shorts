import { useState, MutableRefObject, useCallback} from "react";
export default function useElement<T>():[T,(node:T)=>void]{
    const [element,setElement] = useState<T>(null);
    const ref = useCallback((node:T):void => {
        if(node!==null) setElement(node);
    },[]);
    return [element,ref];
}