const ENV = /(localhost|local)/.test(window.location.host)  ? 'local' : 'production';

let { default: Base } = await import(`./base${ENV === 'production' ? '.min' : ''}.js`);
let { default: getProducts } = await import(`./data/getProducts.gql${ENV === 'production' ? '.min' : ''}.js`);
let { default: Skeleton } = await import(`./skeleton${ENV === 'production' ? '.min' : ''}.js`);
let { default: Products } = await import(`./products${ENV === 'production' ? '.min' : ''}.js`);

const stylesCSS = `
    <style>
        :host {
            margin-top: 3rem;
            display: block;
        }
    </style>
`;

class Container extends Base {
    #skeleton = true;

    connectedCallback() {
        this.render();
        this.products = JSON.parse(this.getAttribute('products'));
        this.pageSize = JSON.parse(this.getAttribute('pageSize')) || 24;

        fetch('/graphql', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: getProducts(Object.keys(this.products), this.pageSize)
            })
        }).then(response => response.json()).then(response => {
            if (response.data?.products?.items) {
                this.#skeleton = false;
                this.render(response.data.products.items);
            }
        });
    }

    render() {
        const items = arguments[0];

        let template = document.createElement('template');
        let children = this.#skeleton ?
            '<products-skeleton></products-skeleton>' :
            `<product-items data='${typeof items !== "undefined" ? JSON.stringify(items) : ''}'></product-items>`;

        template.innerHTML = `
            ${stylesCSS}
            ${children}
        `;

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('products-container', Container);
