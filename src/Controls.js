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

export default Controls