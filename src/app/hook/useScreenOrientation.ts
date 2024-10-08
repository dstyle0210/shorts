"use client";
// example : https://stackoverflow.com/questions/58398109/useeffect-hook-not-firing-on-orientation-change
import { useState, useEffect } from "react";
export default function useScreenOrientation() {
    if(window !== undefined){
        const [orientation, setOrientation] = useState(window.screen.orientation.type);

        useEffect(() => {
            const handleOrientationChange = () => setOrientation(window.screen.orientation.type);
            window.addEventListener('orientationchange', handleOrientationChange);
            return () => window.removeEventListener('orientationchange', handleOrientationChange);
        }, []);
    
        return orientation;
    }
}