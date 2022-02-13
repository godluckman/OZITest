let count = 0;
const selectArray =[],
      openSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 5L5.92468 8L9 5" stroke="black" stroke-linejoin="round"/>
                 </svg>`,
      closeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
                    <path d="M1 4L3.92468 1L7 4" stroke="black" stroke-linejoin="round"/>
                  </svg>`;           

const addContainer = () => {
    const container = document.createElement('div')
    container.classList.add('container')
    document.body.insertAdjacentElement('afterbegin', container);
};
addContainer();

class Modal {
    constructor(data, num) {
        this.num = num;
        this.data = data;
        this.createModal();
    }

    createModal() {
        const container = document.querySelector('.container');
        const modalHeader = `<div id="myModal" class="modal">
                                <div class="modal-content">
                                    <span class="close">
                                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2.68524L3 11.8787M3 11.8787L10 21.0721M3 11.8787H18" stroke="black" stroke-width="1.5" stroke-linejoin="round"></path>
                                        </svg>
                                    </span>
                                    <p class="modal-title">Реализуемые товары</p>
                                    <input class="modal-input">
                                </div>
                            </div>`;
        container.insertAdjacentHTML('afterbegin', modalHeader);
        const modal = document.getElementById("myModal");
        const span = document.getElementsByClassName("close")[0];
        const content = document.querySelector('.modal-content');
        this.createSelect(content);
        this.createFooter(modal);

        span.onclick = function() {
            modal.parentNode.removeChild(modal);

        }
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.parentNode.removeChild(modal);
            }
        }
    }

    createSelect (content) {
        const optionsArray = [...this.data]
        optionsArray.forEach(option => {
            const check = option.selected && 'checked' || '';
            const level = option.dataset.level && ` style="margin-left:${option.dataset.level}em"` || '';
            const display =  option.dataset.level && 'style="display:none"' || '';
            const element = `<div class='option-container' ${display} data-level="${option.dataset.level || 1}">   
                                <input type="checkbox" class="checkbox" id="${option.value}" ${check}>
                                <div class="drop"> 
                                <p ${level}>${option.text}</p>
                                </div>
                             </div>`
            content.insertAdjacentHTML('beforeend', element);
        });
        this.addDropDown()
        this.handleInput(optionsArray);
    }

    addDropDown () {
        const options = document.querySelectorAll('.option-container');
        options.forEach(o => {
            if(o.nextSibling?.style.display === 'none' && o.nextSibling?.dataset.level > o.dataset.level){
                const element = `<div class="open">${openSVG}</div>`
                o.lastElementChild.insertAdjacentHTML('beforeend', element);
            }
        });
        const dropdowns = document.querySelectorAll('.open');
        dropdowns.forEach(e => {
            e.addEventListener('click', (e) => {
                let nextSib = e.currentTarget.parentNode.parentNode.nextSibling;
                const dataLevel = Number(e.currentTarget.parentNode.parentNode.dataset.level);
                function RecursiveOpen(sibling, level){
                    if (sibling.dataset.level <= level){
                        return;
                    }
                    else if (sibling.dataset.level == level + 1){
                        sibling.removeAttribute('style');
                        if(sibling.nextSibling){
                        return RecursiveOpen(sibling.nextSibling, level);
                        }
                        return;
                    }
                    else if(sibling.nextSibling){
                        return RecursiveOpen(sibling.nextSibling, level);
                    }
                }
                function RecursiveClose(sibling, level){
                    if (sibling.dataset.level <= level){
                        return;
                    }
                    else if(sibling.nextSibling){
                        console.log(sibling);
                        sibling.setAttribute('style', 'display:none')
                        return RecursiveClose(sibling.nextSibling, level);
                    }
                }
                if (e.currentTarget.className === 'open'){
                e.currentTarget.className = 'close';
                e.currentTarget.innerHTML = closeSVG;
                RecursiveOpen(nextSib, dataLevel);
                } else {
                e.currentTarget.className = 'open';
                e.currentTarget.innerHTML = openSVG;
                RecursiveClose(nextSib, dataLevel);
                }
            })
        })
    }

    createFooter(modal) {
        const footer = `<div class="modal-footer" data-level="1">
                            <button class="apply-button">Применить</button>
                            <button class="clear-button">Очистить</button>
                        </div>`;
        modal.insertAdjacentHTML('beforeend', footer);
        this.handleApply();
        this.handleClear();
    }

    handleInput (optionsArray) {
        const inputs = document.querySelectorAll('input[id]');
        // console.log('inppppp', [...inputs]);
        // console.log(optionsArray);
        [...inputs].forEach(input => input.addEventListener('click', (e) => {
            if (e.target.hasAttribute('checked')){
                e.target.removeAttribute('checked')
            } else {
            e.target.setAttribute('checked', 'checked')
            }
        }))
    }

    handleApply () {
        const apply = document.querySelector('.apply-button');
        apply.addEventListener('click', ()=>{
            const checkedId = [...document.querySelectorAll('input[checked]')].map(input => input.id);
            const selectedNumber = checkedId.length
            const input = document.querySelector(`.input${this.num}`);         
            const button = document.querySelector(`.button${this.num}`);
            button.innerText = `Показать выбранное (${selectedNumber})`;
            [...this.data].map(o => {
                if (o.hasAttribute('selected') && checkedId.indexOf(o.value) === -1) {
                    o.removeAttribute('selected')
                } else if (checkedId.indexOf(o.value) !== -1) {
                o.setAttribute('selected', 'selected')
                }
            });
            const selectedString = [...this.data.selectedOptions].map(option => option.text).join(', ');
            selectedString ? input.value = selectedString : input.value = '';
        })
    }

    handleClear () {
        const clear = document.querySelector('.clear-button');
        clear.addEventListener('click', ()=> [...document.querySelectorAll('input[checked]')].forEach(e => e.removeAttribute('checked')))
    }

}

class Input {
    constructor(data, num) {
        this.data = data;
        this.num = num;
        this.createInput(data);
        this.counter = 0;
    }

    createInput(data) {
        const container = document.querySelector('.container');
        const selected = this.getSelected(data)
        const sample = `<input class="input input${this.num}" placeholder="Код ОКРБ или наименование закупаемой продукции" readonly>`;
        container.insertAdjacentHTML("beforeend", sample);
        const input = document.querySelector(`.input${this.num}`)
        if(selected) { input.value = selected }
        this.addHeader(input);
    }

    getSelected (data) {
        this.counter = data.selectedOptions.length
        return [...data.selectedOptions].map(option => option.text).join(', ');
    }

    addHeader(input) {
        const head = document.createElement('div');
        head.classList.add('head');
        const title = document.createElement('p');
        title.classList.add('title');
        title.textContent = 'Тендеры в роли Заказчика';
        const button = document.createElement('button');
        button.classList.add('button', `button${this.num}`);
        button.innerText = `Показать выбранное (${this.counter})`
        head.append(title, button);
        input.before(head);
        this.addListeners(input, button);
    }

    addListeners(input, button) {
       this.data.addEventListener('change', e => alert(e.target.value));
       input.addEventListener('click', () => new Modal(this.data, this.num));
       button.addEventListener('click', () => new Modal(this.data, this.num));
    }
}

const initSelectors = () => {
    const selectors = document.querySelectorAll('select');
    selectors.forEach(selector => selectArray.push(new Input(selector, count++)))
}

initSelectors();
