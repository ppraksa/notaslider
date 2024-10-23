# NaS(); - Not a Slider
Magento 2 (not only for Magento2 you can use it on your own way) Products slider without any js library.
## Installation 
Just copy, paste and adjust it for your needs!

## Usage
under MIT License

### HTML
Check [recent_products.phtml](recent_products.phtml) and find line below:
```<products-container products='{}' pageSize="12"></products-container>```

products - JSON object with skus (in case it is a Magento2 see [getProducts.gql.js](web/js/data/getProducts.gql.js))
pageSize - how many products you want to show at once.

for instance:

```<products-container products='{"skus":["24-WG085","24-WG083","24-WG084","24-WG086","24-WG087","24-WG088","24-WG089","24-WG090","24-WG091","24-WG092","24-WG093","24-WG094"]}' pageSize="12"></products-container>```

## Technologies
[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
[CSS: scroll-snap-type](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
[GraphQL](https://graphql.org/)