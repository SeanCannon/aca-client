import { useEffect, useCallback, useRef } from 'react';

// infinite scrolling with intersection observer
export const useInfiniteScroll = (scrollRef, cb) => {
  const scrollObserver = useCallback(
    node => {
      new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.intersectionRatio > 0) {
            cb();
          }
        });
      }).observe(node);
    },
    [cb]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
};

// lazy load images with intersection observer
export const useLazyLoading = (imgSelector, items) => {
  const imgObserver = useCallback(node => {
    const intObs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target;
          const newImgSrc = currentImg.dataset.src;

          // only swap out the image source if the new url exists
          if (!newImgSrc) {
            // eslint-disable-next-line
            console.error('Image source is invalid');
          } else {
            currentImg.src = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    });
    intObs.observe(node);
  }, []);

  const imagesRef = useRef(null);

  useEffect(() => {
    imagesRef.current = document.querySelectorAll(imgSelector);

    if (imagesRef.current) {
      imagesRef.current.forEach(img => imgObserver(img));
    }
  }, [imgObserver, imagesRef, imgSelector, items]);
};
