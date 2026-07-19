import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

type RevealProps = ComponentPropsWithoutRef<'div'>;

export function Reveal({ children, className = '', ...props }: RevealProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const node = nodeRef.current;

    if (!node || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8%', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = ['reveal', isVisible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={nodeRef} className={classes} {...props}>
      {children}
    </div>
  );
}
