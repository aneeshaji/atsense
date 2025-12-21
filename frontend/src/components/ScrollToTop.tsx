import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component ensures that the window scrolls to the top
 * whenever the location (URL) changes. This is standard behavior for
 * multi-page SPAs where scroll position might otherwise be preserved.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
