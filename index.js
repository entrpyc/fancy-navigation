class Controls {
    constructor() {
        this.onLeft = this.onLeft.bind(this);
        this.onRight = this.onRight.bind(this);
    }

    onLeft() {
        this.changeAnchor(this.selectedAnchor.previousElementSibling)
    }

    onRight() {
        console.log(this.selectedAnchor)
        this.changeAnchor(this.selectedAnchor.nextElementSibling)
    }

    mountControl() {
        document.querySelector('.buttons .left').addEventListener('click', this.onLeft)

        document.querySelector('.buttons .right').addEventListener('click', this.onRight)
    }

    unmountControl() {
        document.querySelector('.buttons .left').removeEventListener('click', this.onLeft)

        document.querySelector('.buttons .right').removeEventListener('click', this.onRight)
    }
}

class Navigation extends Controls {
    props = {
        selector: '.fancy-nav',
        itemSelector: '.fancy-nav-item',
        selectedAnchorClass: 'fancy-nav-selected'
    }

    anchors = null;
    nav = null;
    navScrollWidth = 0;

    initial = true;

    selectedAnchor = null;

    constructor(props) {
        super(props);

        this.props = {
            ...this.props,
            ...props
        }

        const { itemSelector, selector } = this.props

        // get all anchors
        const anchors = document.querySelectorAll(`${selector} ${itemSelector}`);
        this.anchors = anchors.length && [...anchors];
        this.nav = document.querySelector(selector)
        this.navScrollWidth = this.nav.scrollWidth

        // bind 
        this.mount = this.mount.bind(this);
        this.unmount = this.unmount.bind(this);
        this.changeAnchor = this.changeAnchor.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    /**
     * Bind event listeners
     */
    mount() {
        const { withControl } = this.props;

        if (!this.anchors) {
            console.error('Navigation anchors not found');
            return;
        }

        if (withControl) {
            this.mountControl();
        }

        window.addEventListener('scroll', this.handleScroll);
    }

    /**
     * Remove event listeners
     */
    unmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    /**
     * Handle anchor change
     */
    changeAnchor(anchor, withAnimation = !this.initial) {
        if (!anchor) return;

        this.selectedAnchor = anchor

        const { selectedAnchorClass } = this.props

        // get the left position
        let left = anchor.offsetLeft + (anchor.offsetWidth / 2) - (this.nav.offsetWidth / 2);
        left = Math.max(left, 0);
        left = Math.min(left, this.navScrollWidth - this.nav.offsetWidth)

        this.anchors.map(anchor => {
            anchor.classList.remove(selectedAnchorClass)

            // set transition
            if (!withAnimation) {
                anchor.style.transition = '';
            } else {
                anchor.style.transition = 'transform 0.3s ease';
            }

            // set left position
            anchor.style.transform = `translateX(-${left}px)`;
        })

        // add selected class to the new anchor
        anchor.classList.add(selectedAnchorClass)

        this.initial = false 
    }

    /**
     * Handle scroll
     */
    handleScroll() {
        for (let anchor of this.anchors) {
            const result = this.detectIfSectionIsInViewport(anchor);

            if (result) {
                this.changeAnchor(anchor);
                break;
            }
        }
    }

    /**
     * Detect which section is in the viewport
     */
    detectIfSectionIsInViewport(anchor) {
        const _windowHeight = document.documentElement.clientHeight;
        const _windowScrollPosition = document.documentElement.scrollTop;

        const section = document.querySelector(anchor.dataset.section);

        if (!section)
            return console.error('Section not found');

        const sectionTopPosition = section.offsetTop;
        const sectionBottomPosition = sectionTopPosition + section.offsetHeight;

        let checkTopBound = _windowScrollPosition + _windowHeight / 5 > sectionTopPosition;
        let checkBottomBound = _windowScrollPosition + _windowHeight / 3 < sectionBottomPosition;

        return checkTopBound && checkBottomBound;
    }
}

const nav = new Navigation({
    selector: '#navigation',
    itemSelector: '.anchor',
    withControl: true
});

nav.mount();