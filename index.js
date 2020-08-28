import "./src/Navigation";

const nav = new Navigation({
    selector: '#navigation',
    itemSelector: '.anchor',
    withControl: true,
    withDraggable: true,
    anchorAnimationEase: 'ease',
    anchorAnimationDuration: '0.3s',
    onAnchorChange: (anchor) => {
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