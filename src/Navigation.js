// isolate the code
(() => {
    /**
     * Makes the navigation draggable
     */
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

            // get current left position
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

        /**
         * On mouse up
         */
        handleMouseUp() {
            this.isMouseDown = false;
            this.nav.classList.remove(this.props.dragActiveClass)
            this.disableAnchorsClick(true)
        }

        /**
         * Handle movement
         */
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
            x = Math.min(x, this.navScrollWidth - this.nav.clientWidth);

            this.anchors.map(anchor => {
                anchor.style.transform = `translateX(-${x}px)`
            })
        }

        /**
         * Disable anchor click while dragging
         * 
         * @param {boolean} removeListener 
         */
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

    /**
     * Adds left and right controls to the navigation
     */
    class Controls extends Draggable {
        constructor(props) {
            super(props);

            this.onLeft = this.onLeft.bind(this);
            this.onRight = this.onRight.bind(this);
            this.move = this.move.bind(this);
            this.getAnchorsWithSection = this.getAnchorsWithSection.bind(this);
        }

        onLeft() {
            const anchors = this.getAnchorsWithSection();

            this.move(anchors.indexOf(this.selectedAnchor) - 1)
        }

        onRight() {
            const anchors = this.getAnchorsWithSection();

            this.move(anchors.indexOf(this.selectedAnchor) + 1)
        }

        getAnchorsWithSection() {
            return this.anchors.filter(anchor => !!anchor.dataset.section)
        }

        move(index) {
            index = Math.max(index, 0)
            index = Math.min(index, this.anchors.length - 1);

            const anchors = this.getAnchorsWithSection();

            this.changeAnchor(anchors[index], true, true)
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
            // navigation selector
            selector: '.fancy-nav',
            // anchors selector (must be inside navigation)
            anchorSelector: '.fancy-nav-anchor',
            // the class that is going to be added when the anchor is selected
            selectedAnchorClass: 'fancy-nav-selected',
            // anchor change - animation easing
            anchorAnimationEasing: 'ease',
            // anchor change - animtion duration
            anchorAnimationDuration: '0.3s',
            // navigation class added while dragging
            dragActiveClass: 'fancy-nav-drag-active',
            dragSpeed: 1,
            leftArrowSelector: '.fancy-nav-left',
            rightArrowSelector: '.fancy-nav-right',
            scrollToSection: (section) => {
                if (!section.scrollIntoView) {
                    document.documentElement.scrollTop = section.offsetTop;
                    return
                }

                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
            onAnchorChange: () => { },
            onMount: () => { },
            onSectionReached: () => { },
        }

        // is the navigation mounted
        mounted = false;

        // navigation achors (array of dom elements)
        anchors = null;

        // nav element
        nav = null;

        // navigation scroll width
        navScrollWidth = 0;

        // 
        initial = true;

        // selected anchor element
        selectedAnchor = null;

        // current section element
        currentSection = null;

        // disable scroll handler (without removing the listener)
        disableScrollHandler = false;

        constructor(props) {
            super(props);

            this.props = {
                ...this.props,
                ...props
            }

            const { anchorSelector, selector } = this.props

            // get all anchors
            const anchors = document.querySelectorAll(`${selector} ${anchorSelector}`);
            this.anchors = anchors.length && [...anchors];
            this.nav = document.querySelector(selector)

            // temp fix of bug
            setTimeout(() => {
                this.navScrollWidth = this.nav.scrollWidth
            }, 0)

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

            this.mounted = true;

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

            this.props.onMount(this);
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

            this.mounted = false;
        }

        /**
         * Handle anchor change
         * 
         * @param {Element} anchor 
         * @param {boolean} withAnimation 
         * @param {boolean} scrollToSection 
         */
        changeAnchor(anchor, withAnimation = !this.initial, scrollToSection = false) {
            if (!anchor || !this.mounted) return;

            const {
                selectedAnchorClass,
                anchorAnimationEasing,
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
                    anchor.style.transition = `transform ${anchorAnimationDuration} ${anchorAnimationEasing}`;
                }

                // set left position
                anchor.style.transform = `translateX(-${left}px)`;
            })

            // add selected class to the new anchor
            anchor.classList.add(selectedAnchorClass)

            this.initial = false

            if (this.selectedAnchor !== anchor)
                onAnchorChange(anchor, this)

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

            const anchors = this.getAnchorsWithSection()

            for (let anchor of anchors) {
                const result = this.detectIfSectionIsInViewport(anchor);

                if (result) {
                    this.changeAnchor(anchor);
                    break;
                }
            }
        }

        /**
         * Scroll to section
         * 
         * @param {Element} section 
         */
        scrollToSection(section) {
            if (!section)
                return

            const { scrollToSection, onSectionReached } = this.props

            this.disableScrollHandler = true;

            let scrollTimeout;

            // detect when the scroll ended
            const checkIfScrollEnded = () => {
                clearTimeout(scrollTimeout);

                scrollTimeout = setTimeout(() => {
                    if (this.currentSection !== section) {
                        onSectionReached(section, this)
                        this.currentSection = section
                    }
                    this.disableScrollHandler = false;
                    window.removeEventListener('scroll', checkIfScrollEnded)
                }, 100);
            }

            window.addEventListener('scroll', checkIfScrollEnded);

            scrollToSection(section)
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
                this.props.onSectionReached(section, this)
            }

            if (result) {
                this.currentSection = section
            }

            return result;
        }
    }
    window.Navigation = Navigation
})()