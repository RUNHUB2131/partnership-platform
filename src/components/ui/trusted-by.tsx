import { useEffect, useRef } from 'react';

interface Logo {
  id: string;
  name: string;
  url: string;
}

// Placeholder logos - these will be replaced with real logos later
const PLACEHOLDER_LOGOS: Logo[] = [
  { id: '1', name: 'Brand 1', url: 'https://via.placeholder.com/150x50?text=Logo+1' },
  { id: '2', name: 'Brand 2', url: 'https://via.placeholder.com/150x50?text=Logo+2' },
  { id: '3', name: 'Brand 3', url: 'https://via.placeholder.com/150x50?text=Logo+3' },
  { id: '4', name: 'Brand 4', url: 'https://via.placeholder.com/150x50?text=Logo+4' },
  { id: '5', name: 'Brand 5', url: 'https://via.placeholder.com/150x50?text=Logo+5' },
];

export function TrustedBy() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current || !scrollerInnerRef.current) return;

    const scrollerContent = Array.from(scrollerInnerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      if (scrollerInnerRef.current) {
        scrollerInnerRef.current.appendChild(duplicatedItem);
      }
    });

    // Add animation pause on hover
    const scroller = scrollerRef.current;
    const handleHover = () => {
      scroller.style.animationPlayState = 'paused';
    };
    const handleUnhover = () => {
      scroller.style.animationPlayState = 'running';
    };

    scroller.addEventListener('mouseenter', handleHover);
    scroller.addEventListener('mouseleave', handleUnhover);

    return () => {
      scroller.removeEventListener('mouseenter', handleHover);
      scroller.removeEventListener('mouseleave', handleUnhover);
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Trusted by Leading Brands
        </h2>
        
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-40 before:bg-gradient-to-r before:from-gray-50 before:content-[''] after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-40 after:bg-gradient-to-l after:from-gray-50 after:content-['']">
          <div
            ref={scrollerRef}
            className="flex w-max animate-scroll"
          >
            <div
              ref={scrollerInnerRef}
              className="flex items-center justify-around gap-16 py-4"
            >
              {PLACEHOLDER_LOGOS.map((logo) => (
                <div
                  key={logo.id}
                  className="flex items-center justify-center w-[150px] h-[50px]"
                >
                  <img
                    src={logo.url}
                    alt={`${logo.name} logo`}
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}