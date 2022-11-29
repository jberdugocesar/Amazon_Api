const Category = require('../models/Category');
const Product = require('../models/Product');

async function changeProductCategory(req, res) {
    const { product_id, category_id } = req.query;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

    console.log(req.query);

    try {

        await Category.findByIdAndUpdate(category_id, { $pull: { 'products': product_id } });

        const category = await Category.findByIdAndUpdate(category_id, { $push: { 'products': product_id } })

        if (category == null) return res.status(400).json({ error: "Category Not founded" });

        await Product.findByIdAndUpdate(product_id, { category: category_id });


        res.json({ category });

    } catch (error) {
        res.status(500).json({ error: 'Invalid category_id or product_id' });
    }

}

async function removeProductInCategory(req, res) {
    const { product_id, category_id } = req.query;

    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

    console.log(req.query);

    try {
        const category = await Category.findByIdAndUpdate(category_id, { $pull: { 'products': product_id } })

        if (category == null) return res.status(400).json({ error: "Category Not founded" });

        Product.findByIdAndUpdate(product_id, { category: "000000000000000000000000" });


        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Invalid category_id or product_id' });
    }


}

async function getCategory(req, res) {
    const { category_id } = req.params;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    try {
        const category = await Category.findById(category_id);
        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Invalid category_id' });
    }

}

async function createCategory(req, res) {
    const { name, } = req.body;
    console.log(req.body);
    if (!name) return res.status(400).json({ error: 'Missing product data' });

    try {
        const category = await Category.create({ name });
        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Invalid product data' });
    }
}

async function updateCategory(req, res) {
    const { category_id } = req.params;
    const { name } = req.body;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });
    if (!name) return res.status(400).json({ error: 'Missing category data' });

    try {
        const category = await Category.findById(category_id);
        const data = {
            name: name || category.name,
        }
        const updatedCategory = await User.findByIdAndUpdate(category_id, data, { new: true });
        res.json({ product: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: 'Invalid category_id or data' });
    }
}

async function deleteCategory(req, res) {
    const { category_id } = req.params;
    console.log(req.params);
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });


    try {
        const category = await Category.findById(category_id);

        category.products.map(async product => await Product.findByIdAndUpdate({ "_id": product }, { category: "000000000000000000000000" }));

        await Category.findByIdAndDelete(category_id);

        res.json({ category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Invalid category_id' });
    }
}


module.exports = { addProductInCategory: changeProductCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory }
