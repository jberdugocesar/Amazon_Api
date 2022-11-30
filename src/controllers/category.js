const Category = require('../models/Category');
const Product = require('../models/Product');

async function changeProductCategory(req, res) {
    const { product_id, category_id } = req.query;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

    try {

        await Category.findByIdAndUpdate(category_id, { $pull: { 'products': product_id } });

        const category = await Category.findByIdAndUpdate(category_id, { $push: { 'products': product_id } })

        if (category == undefined) return res.status(500).json({ error: "Category not found" });

        await Product.findByIdAndUpdate(product_id, { category: category_id });


        res.json({ category });

    } catch (error) {
        res.status(400).json({ error: 'Invalid category_id or product_id' });
    }

}

async function removeProductInCategory(req, res) {
    const { product_id, category_id } = req.query;

    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    if (!product_id) return res.status(400).json({ error: 'Missing product_id' });

    try {
        const category = await Category.findByIdAndUpdate(category_id, { $pull: { 'products': product_id } })

        if (category == undefined) return res.status(500).json({ error: "Category not found" });

        //Provisional empty category
        Product.findByIdAndUpdate(product_id, { category: "000000000000000000000000" });

        res.json({ category });
    } catch (error) {
        res.status(400).json({ error: 'Invalid category_id or product_id' });
    }


}

async function getCategory(req, res) {
    const { category_id } = req.params;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });

    try {
        const category = await Category.findById(category_id);
        if (category == undefined) return res.status(500).json({ error: 'Category not found' });

        res.json({ category });
    } catch (error) {
        res.status(400).json({ error: 'Invalid category_id' });
    }

}

async function createCategory(req, res) {
    const { name, } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing category data' });

    try {

        const byName = await Category.findOne({ name });
        if (byName) return res.status(500).json({ error: 'This category already exists' });

        const category = await Category.create({ name });

        res.json({ category });
    } catch (error) {
        res.status(400).json({ error: 'Invalid category data' });
    }
}

async function updateCategory(req, res) {
    const { category_id } = req.params;
    const { name } = req.body;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });
    if (!name) return res.status(400).json({ error: 'Missing category data' });

    try {
        const category = await Category.findById(category_id);
        if (category == undefined) return res.status(500).json({ error: 'Category not found' });

        const data = {
            name: name || category.name,
        }
        const updatedCategory = await Category.findByIdAndUpdate(category_id, data, { new: true });
        res.json({ category: updatedCategory });
    } catch (error) {
        res.status(400).json({ error: 'Invalid category_id or data' });
    }
}

async function deleteCategory(req, res) {
    const { category_id } = req.params;
    if (!category_id) return res.status(400).json({ error: 'Missing category_id' });


    try {
        const category = await Category.findById(category_id);
        if (category == undefined) return res.status(500).json({ error: 'Category not found' });

        await Promise.all(category.products.map(async product => await Product.findByIdAndUpdate({ "_id": product }, { category: "000000000000000000000000" })));

        await Category.findByIdAndDelete(category_id);

        res.json({ category });
    } catch (error) {
        res.status(400).json({ error: 'Invalid category_id' });
    }
}


module.exports = { changeProductCategory, removeProductInCategory, getCategory, createCategory, updateCategory, deleteCategory }
