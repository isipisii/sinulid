
export function bubbleStyleUserImageWhoReplied(idx: number, imageUrls: string[]): string {
  let style = "";

  if (imageUrls.length === 1) {
    style = "h-[20px] w-[20px]";
  }

  if (imageUrls.length === 2) {
    switch (idx) {
      case 0:
        style = "absolute top-0 right-1 h-[20px] w-[20px] z-10";
        break;
      case 1:
        style = "absolute top-0 left-0 h-[20px] w-[20px]";
        break;
    }
  }

  if (imageUrls.length > 2) {
    switch (idx) {
      case 0:
        style = "absolute bottom-4 right-0 h-[18px] w-[18px]";
        break;
      case 1:
        style = "absolute bottom-3 left-1 h-[15px] w-[15px]";
        break;
      case 2:
        style = "absolute bottom-0 right-2  h-[14px] w-[14px]";
        break;
    }
  }
  return style
}
