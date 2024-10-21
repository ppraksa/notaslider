export default class Base extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}
