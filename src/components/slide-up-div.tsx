import React, { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const SlideUpDiv = ({ children }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={containerRef}
      className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
    >
      {children}
    </div>
  );
};
