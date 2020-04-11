const scrollToTop = (el, scrollDuration) => {
  if (el) {
    const scrollHeight = el.clientHeight / 2,
          scrollStep   = Math.PI / ( scrollDuration / 15 ),
          cosParameter = scrollHeight / 2;

    el.scrollTop = cosParameter;

    let scrollCount    = 0,
        scrollMargin,
        scrollInterval = setInterval(() => {
          if (el.scrollTop !== 0) {
            scrollCount  = scrollCount + 1;
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            el.scrollTo(0, ( scrollHeight - scrollMargin ));
          }
          else clearInterval(scrollInterval);
        }, 15);
  }
};

export default scrollToTop;
