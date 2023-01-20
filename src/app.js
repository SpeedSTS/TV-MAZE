import { mapListDOMElements } from './dominteractions.js'
import { getShowsByKey, getShowById } from './request.js'
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
        getShowsByKey(this.selectName).then(shows => this.renderCardOnList(shows))
    }

    renderCardOnList = shows => {
        Array.from(document.querySelectorAll('[data-show-id]')).forEach(btn => btn.removeEventListener('click', this.openDetailsView))
        this.viewElems.showsWrapper.innerHTML = ""

        for(const { show } of shows) {
            const card = this.createShowCard(show)
            this.viewElems.showsWrapper.appendChild(card);
        }
    }

   openDetailsView = event => {
    const { showId } = event.target.dataset
    getShowById(showId).then(show => {
        const card = this.createShowCard(show, true);
        this.viewElems.showPreview.appendChild(card);
        this.viewElems.showPreview.style.display = 'block';
    })
   }

   closeDetailsView = event => {
    const { showId } = event.target.dataset
    const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id="${showId}"]`)
    closeBtn.removeEventListener('click', this.closeDetailsView)
    this.viewElems.showPreview.style.display = 'none';
    this.viewElems.showPreview.innerHTML = '';
   }

    createShowCard = (show, isDetailed) => {
        const divCard = createDOMElem('div', 'card')
        const divCardBody = createDOMElem('div', 'card-body')
        const h5 = createDOMElem('h5', 'card-title', show.name)
        let p;
        const btn = createDOMElem('button', 'btn btn-primary', 'Show details')
        let img;
        if(show.image) 
        {
            if(isDetailed) {
                img = createDOMElem('div', 'card-preview-bg')
                img.style.backgroundImage = `url('${show.image.original}')`
            }
            else {
            img = createDOMElem('img', 'card-img-top', null, show.image.medium)
            }
        }
        else
        {
            img = createDOMElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295')
        }

        if(show.summary)
        {
            if(isDetailed)
            {
                p = createDOMElem('p', 'card-text', show.summary)
            }
            else
            {
                p = createDOMElem('p', 'card-text', `${show.summary.slice(0,80)}...`)
            }
            
        }
        else
        {
            p = createDOMElem('p', 'card-text', 'Tutaj nie ma niestety opisu.')
        }
        btn.dataset.showId = show.id

        if(isDetailed) {
            btn.addEventListener('click', this.closeDetailsView)
        }
        else {
            btn.addEventListener('click', this.openDetailsView)
        }
        

        divCard.appendChild(divCardBody)
        divCardBody.appendChild(img)
        divCardBody.appendChild(h5)
        divCardBody.appendChild(p)
        divCardBody.appendChild(btn)

        return divCard
    }
}

document.addEventListener("DOMContentLoaded", new TvMaze());