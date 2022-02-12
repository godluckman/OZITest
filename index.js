let count = 0,
    selectArray =[];

const addContainer = () => {
    const container = document.createElement('div')
    container.classList.add('container')
    document.body.insertAdjacentElement('afterbegin', container);
};
addContainer();

class Modal {
    constructor(data) {
        this.data = data;
        this.createModal();
    }

    createModal(){
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
        console.log(optionsArray)
        optionsArray.forEach(option => {
            const element = `<div>${option.text}</div>`
            content.insertAdjacentHTML('beforeend', element);
        })

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
        console.log('data', data)
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
        button.classList.add('button');
        button.innerText = `Показать выбранное (${this.counter})`
        head.append(title, button);
        input.before(head);
        this.addListeners(input, button);
    }

    addListeners(input, button) {
       this.data.addEventListener('change', e => alert(e.target.value));
       input.addEventListener('click', () => new Modal(this.data));
       button.addEventListener('click', () => new Modal(this.data))
    }
}

const initSelectors = () => {
    const selectors = document.querySelectorAll('select');
    selectors.forEach(selector => selectArray.push(new Input(selector, count++)))
}

initSelectors();
