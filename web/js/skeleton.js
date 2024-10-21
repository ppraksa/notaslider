const ENV = /(localhost|local)/.test(window.location.host)  ? 'local' : 'production';

let { default: Base } = await import(`./base${ENV === 'production' ? '.min' : ''}.js`);

const stylesCSS = `
    <style>
        .skeleton-container {
            display: flex;
            gap: 2rem;
        }

        .skeleton-item {
            flex-basis: 25%;
            flex-shrink: 1;
            flex-grow: 1;
            height: 420px;
            background-color: rgb(218,218,218);
            animation-delay: 2s;
            animation: blink 1.5s infinite;
        }

         @media (max-width: 967px) {
            .skeleton-item:last-child {
                display: none;
            }
        }

        @media (max-width: 767px) {
            .skeleton-item:nth-last-child(2) {
                display: none;
            }
        }

        @media (max-width: 467px) {
            .skeleton-item:nth-last-child(3) {
                display: none;
            }
        }

        @keyframes blink {
            0, 89%, 100% {
                opacity: 1;
            }
            90% {
                opacity: .5;
            }
        }
    </style>
`;

export default class Skeleton extends Base {
    render() {
        let template = document.createElement('template');
        template.innerHTML = `
            ${stylesCSS}
            <div class="skeleton-container">
                <div class="skeleton-item">
                </div>
                <div class="skeleton-item">
                </div>
                <div class="skeleton-item">
                </div>
                <div class="skeleton-item">
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('products-skeleton', Skeleton);
