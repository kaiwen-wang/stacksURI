// Create products collection with sample data
migrate((app) => {
    // Create the products collection
    const collection = new Collection({
        name: "products",
        type: "base",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
        fields: [
            {
                name: "name",
                type: "text",
                required: true,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: "category",
                type: "text",
                required: true,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: "price",
                type: "number",
                required: true,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    noDecimal: false
                }
            },
            {
                name: "image",
                type: "text",
                required: true,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    pattern: ""
                }
            },
            {
                name: "rating",
                type: "number",
                required: true,
                presentable: false,
                unique: false,
                options: {
                    min: null,
                    max: null,
                    noDecimal: false
                }
            }
        ],
        indexes: [
            "CREATE INDEX `idx_products_category` ON `products` (`category`)",
            "CREATE INDEX `idx_products_price` ON `products` (`price`)"
        ]
    })

    // Save the collection
    app.save(collection)

    // Insert sample product data
    const productsData = [
        { name: 'Laptop Pro', category: 'electronics', price: 1299, image: '💻', rating: 4.5 },
        { name: 'Cotton T-Shirt', category: 'clothing', price: 29, image: '👕', rating: 4.2 },
        { name: 'JavaScript Guide', category: 'books', price: 39, image: '📚', rating: 4.8 },
        { name: 'Garden Tools Set', category: 'home', price: 89, image: '🏠', rating: 4.3 },
        { name: 'Soccer Ball', category: 'sports', price: 25, image: '⚽', rating: 4.1 },
        { name: 'Gaming Console', category: 'toys', price: 499, image: '🎮', rating: 4.7 },
        { name: 'Lipstick Set', category: 'beauty', price: 45, image: '💄', rating: 4.4 },
        { name: 'Car Accessories', category: 'automotive', price: 129, image: '🚗', rating: 4.0 },
        { name: 'Smartphone', category: 'electronics', price: 799, image: '📱', rating: 4.6 },
        { name: 'Jeans', category: 'clothing', price: 79, image: '👖', rating: 4.3 },
        { name: 'Cookbook', category: 'books', price: 24, image: '📖', rating: 4.5 },
        { name: 'Plant Pot', category: 'home', price: 19, image: '🪴', rating: 4.2 }
    ]

    // Insert each product
    productsData.forEach(productData => {
        const record = new Record(collection, productData)
        app.save(record)
    })

}, (app) => {
    // Revert operation - delete the products collection
    const collection = app.findCollectionByNameOrId("products")
    if (collection) {
        app.delete(collection)
    }
})