import React, { useEffect, useRef } from "react";

function InfiniteScrolll({ query, lastKey, children }) {
    const container = useRef();

    useEffect(() => {
        function handleFetch() {
            const { clientHeight, scrollTop, scrollHeight } = container.current;
            if (scrollTop + clientHeight == scrollHeight) {
                query(lastKey);
            }
        }
        container.current.addEventListener("scroll", handleFetch);

        return () => container.current.removeEventListener("scroll", handleFetch);
    }, []);

    return (
        <div ref={container} className="scroll" style={{ maxHeight: 300 }}>
            {children}
        </div>
    );
}

export default InfiniteScrolll;
