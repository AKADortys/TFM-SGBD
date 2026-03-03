const Product = require("../../models/Product");

const getByIds = async (ids) => {
    try {
        const products = await Product.find({ _id: { $in: ids } });
        return products;
    } catch (error) {
        console.error("Erreur lors de la récupération multiple des produits par id:", error);
        return [];
    }
};

module.exports = getByIds;
