
export function bubbleStyleUserImageWhoReplied(idx: number, imageUrls: string[]): string {
  let style = "";

  if (imageUrls.length === 1) {
    style = "h-[18px] w-[18px]";
  }

  if (imageUrls.length === 2) {
    switch (idx) {
      case 0:
        style = "absolute top-0 right-1 h-[18px] w-[18px] z-10";
        break;
      case 1:
        style = "absolute top-0 left-0 h-[18px] w-[18px]";
        break;
    }
  }

  if (imageUrls.length > 2) {
    switch (idx) {
      case 0:
        style = "absolute bottom-4 right-0 h-[19px] w-[19px]";
        break;
      case 1:
        style = "absolute bottom-3 left-1 h-[15px] w-[15px]";
        break;
      case 2:
        style = "absolute bottom-1 right-3  h-[10px] w-[10px]";
        break;
    }
  }
  return style
}
