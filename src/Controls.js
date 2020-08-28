import Draggable from "./Draggable";

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
        if(!this.selectedAnchor) {
            this.changeAnchor(this.anchors[0])
            return
        }
        
        this.changeAnchor(this.selectedAnchor[prop])
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