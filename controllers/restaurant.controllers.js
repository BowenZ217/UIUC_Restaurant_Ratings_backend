const sql = require("../module/database.js");

exports.list = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
  
    const startIndex = (page - 1) * 10;
  
    const sortClause =
        sortField === 'name' || sortField === 'full_address' || sortField === 'rating' || sortField === 'type'
            ? `ORDER BY ${sortField} ${sortOrder}`
            : '';
  
    const query =
        'SELECT id, name, full_address, rating, type FROM restaurant_list ' +
        sortClause +
        ' LIMIT ?, ?';
  
    sql.query(query, [startIndex, 10], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
  };

exports.findById = (req, res) => {
    const restaurantId = req.params.id;
  
    const query = 'SELECT * FROM restaurant_list WHERE id = ?';
  
    sql.query(query, [restaurantId], (error, results) => {
        if (error) throw error;
    
        if (results.length === 0) {
            res.status(404).send({ message: 'Restaurant not found' });
        } else {
            res.json(results[0]);
        }
    });
};

exports.search = (req, res) => {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
  
    const startIndex = (page - 1) * 10;
  
    const sortClause =
        sortField === 'name' || sortField === 'full_address' || sortField === 'rating' || sortField === 'type'
            ? `ORDER BY ${sortField} ${sortOrder}`
            : '';
  
    const query =
        'SELECT id, name, full_address, rating, type FROM restaurant_list ' +
        'WHERE name LIKE ? ' +
        sortClause +
        ' LIMIT ?, ?';
  
    sql.query(query, [`%${searchTerm}%`, startIndex, 10], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

