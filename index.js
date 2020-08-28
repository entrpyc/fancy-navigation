import Navigation from "./src/Navigation";

const nav = new Navigation({
    selector: '#navigation',
    itemSelector: '.anchor',
    withControl: true,
    withDraggable: true,
    anchorAnimationEase: 'ease',
    anchorAnimationDuration: '0.3s'
});

nav.mount();