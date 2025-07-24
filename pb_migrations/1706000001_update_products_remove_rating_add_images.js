// Update products collection - remove rating field and add base64 images
migrate((app) => {
    // Get the existing products collection
    const collection = app.findCollectionByNameOrId("products")

    if (collection) {
        // Remove the rating field
        collection.fields = collection.fields.filter(field => field.name !== "rating")

        // Save the updated collection schema
        app.save(collection)

        // Clear existing products
        const existingRecords = app.findRecordsByFilter("products", "")
        existingRecords.forEach(record => {
            app.delete(record)
        })

        // Insert updated product data with base64 images (small colored squares)
        const productsData = [
            {
                name: 'Laptop Pro',
                category: 'electronics',
                price: 1299,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            },
            {
                name: 'Cotton T-Shirt',
                category: 'clothing',
                price: 29,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
            },
            {
                name: 'JavaScript Guide',
                category: 'books',
                price: 39,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4849a0AAAABJRU5ErkJggg=='
            },
            {
                name: 'Garden Tools Set',
                category: 'home',
                price: 89,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+fAQAEhAGAhKmMIQAAAABJRU5ErkJggg=='
            },
            {
                name: 'Soccer Ball',
                category: 'sports',
                price: 25,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4/58BAQAEhAGAWjR9awAAAABJRU5ErkJggg=='
            },
            {
                name: 'Gaming Console',
                category: 'toys',
                price: 499,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
            },
            {
                name: 'Lipstick Set',
                category: 'beauty',
                price: 45,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+BAQAEhAGAWjR9awAAAABJRU5ErkJggg=='
            },
            {
                name: 'Car Accessories',
                category: 'automotive',
                price: 129,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            },
            {
                name: 'Smartphone',
                category: 'electronics',
                price: 799,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+fAQAEhAGAhKmMIQAAAABJRU5ErkJggg=='
            },
            {
                name: 'Jeans',
                category: 'clothing',
                price: 79,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAQAEhAGAWjR9awAAAABJRU5ErkJggg=='
            },
            {
                name: 'Cookbook',
                category: 'books',
                price: 24,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4849a0AAAABJRU5ErkJggg=='
            },
            {
                name: 'Plant Pot',
                category: 'home',
                price: 19,
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            }
        ]

        // Insert each product with new data
        productsData.forEach(productData => {
            const record = new Record(collection, productData)
            app.save(record)
        })
    }

}, (app) => {
    // Revert operation - restore rating field and emoji images
    const collection = app.findCollectionByNameOrId("products")

    if (collection) {
        // Add back the rating field
        collection.fields.push({
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
        })

        app.save(collection)

        // Clear existing products
        const existingRecords = app.findRecordsByFilter("products", "")
        existingRecords.forEach(record => {
            app.delete(record)
        })

        // Restore original data with emojis and ratings
        const originalData = [
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

        originalData.forEach(productData => {
            const record = new Record(collection, productData)
            app.save(record)
        })
    }
})