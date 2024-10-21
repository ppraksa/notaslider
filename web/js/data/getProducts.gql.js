export default function(skus, pageSize = 24, currentPage = 1, sort = `{ name: DESC }`) {
    skus = skus || [];
    const skusString = skus.map(sku => `"${sku}"`).join(", ");

    const filter = skus.length > 0 ? `
        {
            sku: {
                in: [${skusString}]
            }
        }
    ` : `{}`;

    return `query Products {
                products(
                    pageSize: ${pageSize}
                    currentPage: ${currentPage}
                    sort: ${sort}
                    filter: ${filter}
                ) {
                    items {
                        name
                        id
                        url_path
                        url_key
                        url_suffix
                        sku
                        media_gallery {
                            label
                            url
                        }
                        special_price
                        price {
                            regularPrice {
                                amount {
                                    currency
                                    value
                                }
                            }
                        }
                    }
                }
            }`;
}
