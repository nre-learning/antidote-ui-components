// this modules defines the VisualViewport height as a CSS variable to allow it's use in styles.
// specifically, this enables us to accurately size the labs terminals on iOS so no part of the terminal
// is obscured when the keyboard is shown - or when any other piece of browser "chrome"  might
// reduce the size of the visual area without changing window.innerHeight

if (window.visualViewport) {
  let updatePending = false;
  window.visualViewport.addEventListener('resize', () => {
    if (!updatePending) {
      updatePending = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--vv-height',
          `${window.visualViewport.height}px`
        );
        updatePending = false;
      });
    }
  });
}
