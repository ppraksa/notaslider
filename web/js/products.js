const ENV = /(localhost|local)/.test(window.location.host)  ? 'local' : 'production';

let { default: Base } = await import(`./base${ENV === 'production' ? '.min' : ''}.js`);

const stylesCSS = `
    <style>
        .container {
            position: relative;
        }

        .move-button > svg,
        .move-button-prev > svg {
            fill: #fff;
            transition: all .5s ease-in-out;
        }

        .move-button,
        .move-button-prev {
            cursor: pointer;
            background: #000;
            position: absolute;
            left: -50px;
            top: 33%;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem .5rem;
            transition: all .5s ease-in-out;
        }

        @media (min-width: 768px) {
            .move-button:hover,
            .move-button-prev:hover {
                background: #fff;
            }

            .move-button:hover > svg,
            .move-button-prev:hover > svg {
                 fill: #000;
            }
        }

        .move-button {
            left: auto;
            right: -50px;
        }

        @media (max-width: 1440px) {
             .move-button {
                right: 0;
             }
             .move-button-prev {
                left: 0;
             }
        }

        .products-container {
            display: flex;
            gap: 2rem;
            padding: 0;
            margin: 0;
            list-style-type: none;
            overflow-x: scroll;
            width: 100%;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
        }

        .products-container .item {
            flex-basis: calc((100% - 6rem) / 4);
            flex-grow: 0;
            background: #fff;
            font-size: 1.4rem;
            flex-shrink: 0;
            scroll-snap-align: start;
            transition: box-shadow 1s ease-in-out;
        }

        @media (max-width: 967px) {
            .products-container .item {
                flex-basis: calc((100% - 4rem) / 3);
            }
        }

        @media (max-width: 767px) {
            .products-container .item {
                flex-basis: calc((100% - 2rem) / 2);
            }
        }

        @media (max-width: 467px) {
            .products-container .item {
                flex-basis: 100%;
            }
        }

        .products-container .item > div {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
        }

        a.img {
            border-bottom: 1px solid var(--color-4);
            width: 100%;
            text-align: center;
        }

        img {
            max-width: 200px;
            object-fit: contain;
        }

        .title {
            display: flex;
            padding: 2rem 2rem 0;
            color: #5d7379;
            font-weight: 400;
        }

        .btn {
            background: #262a5a;
            border: 2px solid #262a5a;
            border-radius: 3px;
            color: #fff;
            padding: 10px 20px;
            transition: all .2s ease-out;
            font-size: 1.2rem;
            line-height: 2.4rem;
            box-shadow: 0 3px 11px rgb(41,42,101);
            font-weight: 600;
            min-width: 120px;
            width: auto;
            text-decoration: none;
            text-align: center;
            opacity: 0;
        }

        .btn:hover {
            background: #fff;
            border: 2px solid #262a5a;
            color: #262a5a;
        }

        .price-sku-block {
            padding: 2rem;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
        }

        .product-item-sku {
            color: var(--color-3);
        }

        .price {
            color: var(--color-2);
            font-size: 2rem;
            font-weight: 600;
        }

        .action {
            display: flex;
            padding: 2rem;
            justify-content: center;
            align-items: center;
        }

        .products-container .item:hover {
            box-shadow: 0 7px 25px rgba(0, 0, 0, .033);
        }

        .products-container .item:hover .btn {
            opacity: 1;
        }

        .hidden {
            display: none;
        }
    </style>
`;

export default class Products extends Base {
    connectedCallback() {
        this.data = JSON.parse(this.getAttribute('data'));
        this.render();

        this.moveButton = this.shadowRoot.querySelector('div.move-button');
        this.moveButtonPrev = this.shadowRoot.querySelector('div.move-button-prev');
        this.moveButton.addEventListener('click', this.moveTo.bind(this, 'next'));
        this.moveButtonPrev.addEventListener('click', this.moveTo.bind(this, 'prev'));

        this.items = this.shadowRoot.querySelectorAll('.product-item');

        const slides = this.items;

        let visibleSlides = new Set();

        const observerOptions = {
            root: this.shadowRoot.querySelectorAll('.products-container')[0],
            threshold: 1.0 // ensure 100% visibility
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleSlides.add(entry.target);
                } else {
                    visibleSlides.delete(entry.target);
                }

                // Check if the number of visible slides equals the total number of slides
                if (visibleSlides.size === slides.length) {
                    this.moveButton.style.display = 'none';
                    this.moveButtonPrev.style.display = 'none';
                } else {
                    this.moveButton.style.display = 'block';
                    this.moveButtonPrev.style.display = 'block';
                }
            });
        }, observerOptions);

        // Observe each slide
        slides.forEach(slide => {
            observer.observe(slide);
        });
    }

    disconnectedCallback() {
        this.moveButton.removeEventListener('click', this.moveTo);
        this.moveButtonPrev.removeEventListener('click', this.moveTo);
    }

    moveTo(type = 'next') {
        const container = this.shadowRoot.querySelector('.products-container');
        const scrollWidth = this.items.item(0).scrollWidth;

        container.scroll({
            left: container.scrollLeft + (type === 'prev' ? -scrollWidth : scrollWidth),
            behavior: 'smooth'
        });
    }

    render() {
        let items = '';

        Array.prototype.map.call(this.data, (item, index) => {
            let {
                media_gallery,
                url_path,
                url_key,
                url_suffix,
                name,
                sku,
                price
            } = item;
            let url = url_key;
            let formattedPrice = price.regularPrice.amount;
            items += `
                <li data-item="${index}" class="item product product-item product-item-${index}">
                    <div>
                        <a class="img" href="${url}" title="${name}">
                            <img height="250" loading="lazy"
                            src="${media_gallery[0].url}" src="${media_gallery[0].title ? media_gallery[0].title : ''}">
                        </a>
                        <div>
                            <span class="title">${name}</span>
                            <div class="price-sku-block">
                                <span class="price">
                                    ${formattedPrice.value.toFixed(2)} ${formattedPrice.currency === 'PLN' ? 'zł' : formattedPrice.currency}
                                </span>
                            </div>
                            <aside class="action">
                                <a class="btn" href="${url}">${window.i18n['see product']}</a>
                            </aside>
                        </div>
                    </div>
                </li>
            `;
        });

        let template = document.createElement('template');
        template.innerHTML = `
            ${stylesCSS}
            <aside class="container">
                <ul class="products-container">
                    ${items}
                </ul>
                <div class="move-button-prev">
                   <svg height="32" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M30.83 32.67l-9.17-9.17 9.17-9.17-2.83-2.83-12 12 12 12z"/><path d="M0-.5h48v48h-48z" fill="none"/></svg>
                </div>
                <div class="move-button">
                    <svg height="32" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M17.17 32.92l9.17-9.17-9.17-9.17 2.83-2.83 12 12-12 12z"/><path d="M0-.25h48v48h-48z" fill="none"/></svg>
                </div>
            </aside>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('product-items', Products);
