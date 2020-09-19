import "./src/Navigation";

window.nav = new Navigation({
    selector: '#navigation',
    anchorSelector: '.anchor',
    withControl: true,
    withDraggable: true,
    anchorAnimationEase: 'ease',
    anchorAnimationDuration: '0.3s',
    leftArrowSelector: '.buttons .left',
    rightArrowSelector: '.buttons .right',
    onAnchorChange: () => {
        console.log('Anchor Changed')
    },
    onMount: () => {
        console.log('Navigation Mounted')
    },
    onSectionReached: () => {
        console.log('Section Reached')
    },
});

nav.mount();

