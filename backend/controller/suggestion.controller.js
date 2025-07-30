import Product from '../models/products.models.js'; // Notice the .js extension and 'import'

export const getSuggestions = async (req, res) => { // Use 'export const' for named export
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const searchQuery = q.trim();
    const regex = new RegExp(searchQuery, 'i');

    const products = await Product.find({
      $or: [
        { title: regex },
        { category: regex },
        { brand: regex },
        { tags: regex }
      ]
    })
    .select('title category brand tags')
    .limit(20);

    const uniqueSuggestions = new Set();

    products.forEach(product => {
      if (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.title);
      }
      if (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.category);
      }
      if (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
        uniqueSuggestions.add(product.brand);
      }
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
            uniqueSuggestions.add(tag);
          }
        });
      }
    });

    const finalSuggestions = Array.from(uniqueSuggestions)
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const queryLower = searchQuery.toLowerCase();

        if (aLower === queryLower) return -1;
        if (bLower === queryLower) return 1;

        if (aLower.startsWith(queryLower) && !bLower.startsWith(queryLower)) return -1;
        if (!aLower.startsWith(queryLower) && bLower.startsWith(queryLower)) return 1;

        return a.localeCompare(b);
      })
      .slice(0, 7);

    res.json(finalSuggestions);

  } catch (error) {
    console.error('Error in getSuggestions:', error.message);
    res.status(500).json({ message: 'Server error fetching suggestions.' });
  }
};