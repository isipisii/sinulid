import moment from "moment"

export const useFormatTimeStamp = (date: string) => {
    const timeStamp: string = moment(date).startOf("second").fromNow(true);

    const time: string = timeStamp.split(" ")[0];
    const finalTime: string = time === "a" || time === "an" ? "1": time

    const timeUnit: string = timeStamp.split(" ")[1].split("")[0];
    const finaltTimeUnit: string  = timeUnit === "f" ? "s" : timeUnit 

    const formattedTimeStamp: string = finalTime + finaltTimeUnit;
    
    return { formattedTimeStamp }
}