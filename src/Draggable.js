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
         * Stop dragg on mouse up
         */
        document.addEventListener('mouseup', this.handleMouseUp);

        /**
         * On mouse move
         */
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    unmountDraggble() {

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
        this.nav.classList.remove('fancy-nav-dragg-active')
        this.disableAnchorsClick(true)
    }

    handleMouseMove(e) {
        if (!this.isMouseDown) return;

        const moved = this.startMouseX - e.pageX;

        if(moved > 50 || moved < 50) {
            this.nav.classList.add('fancy-nav-dragg-active')
            
            this.disableAnchorsClick();
        }
        
        let x = moved + this.startScrollX;

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

export default Draggable