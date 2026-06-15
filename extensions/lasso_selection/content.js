const script = document.createElement('script');
script.src = (typeof browser !== 'undefined' ? browser : chrome).runtime.getURL('inject.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);
