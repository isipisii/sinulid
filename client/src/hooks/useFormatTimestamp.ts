import moment from "moment"
import { useEffect, useState } from "react";

export const useFormatTimeStamp = (date: string): string => {
    const [formattedTimeStamp, setFormattedTimeStamp] = useState<string>("")

    useEffect(() => {
        const timeStamp: string = moment(date).startOf("second").fromNow(true);

        const time: string = timeStamp.split(" ")[0];
        const finalTime: string = time === "a" || time === "an" ? "1": time
    
        const timeUnit: string = timeStamp.split(" ")[1].split("")[0];
        const finalTimeUnit: string  = timeUnit === "f" ? "just now" : timeUnit 
    
        const finalFormat: string = finalTimeUnit !== timeUnit ? finalTimeUnit : (finalTime + finalTimeUnit);
        setFormattedTimeStamp(finalFormat)
    },[date])

    
    return formattedTimeStamp 
}