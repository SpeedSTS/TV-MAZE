import { mapListDOMElements } from './dominteractions.js'
import { getShowsByKey } from './request.js'
import { createDOMElem } from './dominteractions.js'
class TvMaze {
    constructor() {
        this.viewElems = {}
        this.showNameButtons = {}
        this.selectName = "harry"
        this.initializeApp()
    }


    initializeApp = () => {
        this.connectDomElements()
        this.setupListeners()
        this.fetchAndDisplayShows()
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
        this.fetchAndDisplayShows()
    }

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectName).then(shows => this.renderCard(shows))
    }

    renderCard = shows => {
        this.viewElems.showsWrapper.innerHTML = ""

        for(const { show } of shows) {
            this.createShowCard(show)
        }
    }

    createShowCard = show => {
        const divCard = createDOMElem('div', 'card')
        const divCardBody = createDOMElem('div', 'card-body')
        const h5 = createDOMElem('h5', 'card-title', show.name)
        let p;
        const btn = createDOMElem('button', 'btn btn-primary', 'Show details')
        let img;
        if(show.image) 
        {
            img = createDOMElem('img', 'card-img-top', null, show.image.medium)
        }
        else
        {
            img = createDOMElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295')
        }

        if(show.summary)
        {
            p = createDOMElem('p', 'card-text', `${show.summary.slice(0,80)}...`)
        }
        else
        {
            p = createDOMElem('p', 'card-text', 'Tutaj nie ma niestety opisu.')
        }

        divCard.appendChild(divCardBody)
        divCardBody.appendChild(img)
        divCardBody.appendChild(h5)
        divCardBody.appendChild(p)
        divCardBody.appendChild(btn)

        this.viewElems.showsWrapper.appendChild(divCard);
    }
}

document.addEventListener("DOMContentLoaded", new TvMaze());