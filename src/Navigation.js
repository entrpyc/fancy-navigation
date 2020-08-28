class Draggable {
    isMouseDown = null;
    startMouseX;
    startScrollX;

    constructor() {
        this.mountDraggble = this.mountDraggble.bind(this)
        this.unmountDraggble = this.unmountDraggble.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.disableAnchorsClick = this.disableAnchorsClick.bind(this)
    }

    mountDraggble() {
        this.nav.addEventListener('mousedown', this.handleMouseDown);

        /**
         * Stop scroll on mouse leave
         */
        this.nav.addEventListener('mouseleave', this.handleMouseLeave);

        /**
         * Stop drag on mouse up
         */
        document.addEventListener('mouseup', this.handleMouseUp);

        /**
         * On mouse move
         */
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    unmountDraggble() {
        this.nav.removeEventListener('mousedown', this.handleMouseDown);
        this.nav.removeEventListener('mouseleave', this.handleMouseLeave);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    handleMouseDown(e) {
        this.isMouseDown = true

        this.anchors.map(anchor => {
            anchor.style.transition = ''
        })

        const anchor = this.anchors[0];

        let left = anchor.style.transform;

        if (left) {
            left = left.replace('translateX(0px)', '0')
            left = left.replace('translateX(-0px)', '0')
            left = left.replace('translateX(-', '')
            left = left.replace('px)', '')
        }

        this.startScrollX = +left || 0
        this.startMouseX = e.pageX;
    }

    handleMouseUp() {
        this.isMouseDown = false;
        this.nav.classList.remove(this.props.dragActiveClass)
        this.disableAnchorsClick(true)
    }

    handleMouseMove(e) {
        if (!this.isMouseDown) return;

        const { dragSpeed, dragActiveClass } = this.props

        const moved = this.startMouseX - e.pageX;

        if (moved > 50 || moved < 50) {
            this.nav.classList.add(dragActiveClass)

            this.disableAnchorsClick();
        }

        let x = moved + this.startScrollX;
        x = x * dragSpeed;

        x = Math.max(x, 0);
        x = Math.min(x, this.navScrollWidth - this.nav.offsetWidth);

        this.anchors.map(anchor => {
            anchor.style.transform = `translateX(-${x}px)`
        })
    }

    disableAnchorsClick(removeListener = false) {
        this.anchors.forEach(anchor => {
            if (removeListener) {
                anchor.style.pointerEvents = 'all'
                return
            }

            anchor.style.pointerEvents = 'none'
        })
    }
}

class Controls extends Draggable {
    constructor(props) {
        super(props);
        this.onLeft = this.onLeft.bind(this);
        this.onRight = this.onRight.bind(this);
    }

    onLeft() {
        this.move('previousElementSibling')
    }

    onRight() {
        this.move('nextElementSibling')
    }

    move(prop) {
        if (!this.selectedAnchor) {
            this.changeAnchor(this.anchors[0])
            return
        }

        this.changeAnchor(this.selectedAnchor[prop], true, true)
    }

    mountControl() {
        const { leftArrowSelector, rightArrowSelector } = this.props

        document.querySelector(leftArrowSelector).addEventListener('click', this.onLeft)
        document.querySelector(rightArrowSelector).addEventListener('click', this.onRight)
    }

    unmountControl() {
        const { leftArrowSelector, rightArrowSelector } = this.props

        document.querySelector(leftArrowSelector).removeEventListener('click', this.onLeft)
        document.querySelector(rightArrowSelector).removeEventListener('click', this.onRight)
    }
}

class Navigation extends Controls {
    props = {
        selector: '.fancy-nav',
        itemSelector: '.fancy-nav-item',
        selectedAnchorClass: 'fancy-nav-selected',
        anchorAnimationEase: 'ease',
        anchorAnimationDuration: '0.3s',
        dragActiveClass: 'fancy-nav-drag-active',
        dragSpeed: 1,
        leftArrowSelector: '.fancy-nav-left',
        rightArrowSelector: '.fancy-nav-right',
        scrollToSection: false,
        onAnchorChange: () => { },
        onMount: () => { },
        onSectionReached: () => { },
    }

    anchors = null;
    nav = null;
    navScrollWidth = 0;

    initial = true;

    selectedAnchor = null;

    currentSection = null;

    disableScrollHandler = false;

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
        const { withControl, withDraggable } = this.props;

        if (!this.anchors) {
            console.error('Navigation anchors not found');
            return;
        }

        if (withControl) {
            this.mountControl();
        }

        if (withDraggable) {
            this.mountDraggble();
        }

        this.anchors.map(anchor => {
            anchor.addEventListener('click', () => this.changeAnchor(anchor, true, true))
        })

        window.addEventListener('scroll', this.handleScroll);

        this.props.onMount();
    }

    /**
     * Remove event listeners
     */
    unmount() {
        const { withControl, withDraggable } = this.props;

        window.removeEventListener('scroll', this.handleScroll)

        if (withControl) {
            this.unmountControl();
        }

        if (withDraggable) {
            this.unmountDraggble();
        }
    }

    /**
     * Handle anchor change
     */
    changeAnchor(anchor, withAnimation = !this.initial, scrollToSection = false) {
        if (!anchor) return;

        const {
            selectedAnchorClass,
            anchorAnimationEase,
            anchorAnimationDuration,
            onAnchorChange
        } = this.props

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
                anchor.style.transition = `transform ${anchorAnimationDuration} ${anchorAnimationEase}`;
            }

            // set left position
            anchor.style.transform = `translateX(-${left}px)`;
        })

        // add selected class to the new anchor
        anchor.classList.add(selectedAnchorClass)

        this.initial = false

        if (this.selectedAnchor !== anchor)
            onAnchorChange(anchor)

        this.selectedAnchor = anchor

        if (scrollToSection) {
            const section = document.querySelector(anchor.dataset.section);
            this.scrollToSection(section);
        }
    }

    /**
     * Handle scroll
     */
    handleScroll() {
        if (this.disableScrollHandler) return;

        for (let anchor of this.anchors) {
            const result = this.detectIfSectionIsInViewport(anchor);

            if (result) {
                this.changeAnchor(anchor);
                break;
            }
        }
    }

    scrollToSection(section) {
        if (!section)
            return

        this.disableScrollHandler = true;

        let scrollTimeout;

        const checkIfScrollEnded = () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                if (this.currentSection !== section) {
                    this.props.onSectionReached(section)
                    this.currentSection = section
                }
                this.disableScrollHandler = false;
                window.removeEventListener('scroll', checkIfScrollEnded)
            }, 100);
        }

        window.addEventListener('scroll', checkIfScrollEnded);

        if (this.props.scrollToSection) {
            this.props.scrollToSection(this, section)
            return
        }
        
        if (!section.scrollIntoView) {
            document.documentElement.scrollTop = section.offsetTop;
            return
        }

        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        const result = checkTopBound && checkBottomBound;

        if (result && this.currentSection !== section) {
            this.props.onSectionReached(section)
        }

        if (result) {
            this.currentSection = section
        }

        return result;
    }
}

window.Navigation = Navigation