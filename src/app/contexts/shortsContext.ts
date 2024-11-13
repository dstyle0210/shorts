import { createContext, Dispatch, SetStateAction } from "react";
import type Player from 'video.js/dist/types/player';


type T_ShortsContext = {
    data:T_videos,
    setData:Dispatch<SetStateAction<T_videos>>,
    shortsVideo:Player,
    setShortsVideo:Dispatch<SetStateAction<Player>>
};
export const ShortsContext = createContext<T_ShortsContext>(null);