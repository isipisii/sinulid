import moment from "moment"
import { useEffect, useState } from "react";

export const useFormatTimeStamp = (date: string): string => {
    const [formattedTimeStamp, setFormattedTimeStamp] = useState<string>("")

    useEffect(() => {
        //calculate the elapsed time
        const timeStamp: string = moment(date).startOf("second").fromNow(true);
        
        //split the formatted time to extract time value and unit
        const time: string = timeStamp.split(" ")[0];
        const finalTime: string = time === "a" || time === "an" ? "1" : time;
    
        //extract the time unit
        const timeUnit: string = timeStamp.split(" ")[1].split("")[0];
        const finalTimeUnit: string = timeUnit === "f" ? "just now" : timeUnit;
    
        //create the final formatted time string
        const finalFormat: string = finalTimeUnit !== timeUnit ? finalTimeUnit : finalTime + finalTimeUnit;
    
        //update the state with the formatted time
        setFormattedTimeStamp(finalFormat);
      }, [date]);

    return formattedTimeStamp 
}