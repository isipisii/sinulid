import { toast } from "react-hot-toast";

export const showToast = (message: string, isError?: boolean) => {

  if (isError) {
    return toast.error(message, {
      duration: 2000,
      style: {
        border: "1px solid #353131f6",
        padding: "12px",
        fontSize: "12px",
        color: "#FFFAEE",
        background: "#101010",
        textAlign: "center"
      },
      iconTheme: {
        primary: "#D00000",
        secondary: "#FFFAEE",
      },
    });
  }

  return toast.success(message, {
    duration: 2000,
    style: {
      border: "1px solid #353131f6",
      padding: "12px",
      fontSize: "12px",
      color: "#FFFAEE",
      background: "#101010",
      textAlign: "center"
    },
    iconTheme: {
      primary: "#38b000",
      secondary: "#101010",
    },
  });
};
