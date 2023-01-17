import { mapListDOMElements } from './dominteractions.js'
class TvMaze {
    constructor() {
        this.viewElems = {}
        this.showNameButtons = {}
        this.selectName = "harry"
        this.initializeApp()
        this.setupListeners()
    }


    initializeApp = () => {
        this.connectDomElements()

    }

    connectDomElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);

        const listOfShowName = Array.from(document.querySelectorAll('[data-show-name]')).map(elem => elem.dataset.showName);
        
        this.viewElems = mapListDOMElements(listOfIds, 'id')
        this.showNameButtons = mapListDOMElements(listOfShowName, 'data-show-name')
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter)
        })
    }

    setCurrentNameFilter = () => {
        this.selectName = event.target.dataset.showName
    }
}

document.addEventListener("DOMContentLoaded", new TvMaze());