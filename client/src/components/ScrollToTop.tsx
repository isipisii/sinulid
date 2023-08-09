import { useEffect, FC, ReactElement } from "react";
import { useLocation } from "react-router";

interface IScrollToTop {
    children?: ReactElement | ReactElement[];
}
// for scrolling back to top whenever the page changes
const ScrollToTop: FC<IScrollToTop> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>
};

export default ScrollToTop;
