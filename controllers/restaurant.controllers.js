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

    console.log('Query:', query); // 输出查询语句
    console.log('StartIndex:', startIndex); // 输出起始索引
    
    sql.query(query, [startIndex, 10], (error, results, fields) => {
        if (error) {
            console.log('Error:', error); // 输出错误信息
            throw error;
        }
        console.log('Results:', results); // 输出查询结果
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

