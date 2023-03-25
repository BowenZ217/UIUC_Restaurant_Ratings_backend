const sql = require("../module/database.js");

exports.list = (req, res) => {
    const queryIds = 'SELECT id FROM restaurant_list LIMIT 10';
  
    console.log('Query IDs:', queryIds);
  
    sql.query(queryIds, (error, results, fields) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Error retrieving restaurant list' });
        return;
      }
  
      const ids = results.map(result => result.id);
  
      const queryInfo =
        'SELECT id, name, full_address, rating, type FROM restaurant_list WHERE id IN (?)';
  
      console.log('Query Info:', queryInfo);
  
      sql.query(queryInfo, [ids], (error, results, fields) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send({ message: 'Error retrieving restaurant list' });
          return;
        }
  
        res.json(results);
      });
    });
  };

/*
exports.list = (req, res) => {
    const page = req.query.page || 1;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
  
    const startIndex = (page - 1) * 10;
  
    const sortClause =
        sortField === 'name' || sortField === 'address' || sortField === 'rating'
            ? `ORDER BY ${sortField} ${sortOrder}`
            : '';
  
    const queryIds =
        'SELECT id FROM restaurant_list ' + sortClause + ' LIMIT ?, ?';
  
    console.log('Query IDs:', queryIds); // 输出查询语句
    console.log('StartIndex:', startIndex); // 输出起始索引
  
    sql.query(queryIds, [startIndex, 10], (error, ids, fields) => {
        if (error) {
            console.log('Error:', error); // 输出错误信息
            throw error;
        }
        console.log('IDs:', ids); // 输出查询到的ID
    
        const idList = ids.map(row => row.id);
    
        if (idList.length === 0) {
            res.json([]);
            return;
        }
    
        const queryDetails =
            'SELECT id, name, full_address, rating, type FROM restaurant_list WHERE id IN (?)';
    
        console.log('Query Details:', queryDetails);
        console.log('ID List:', idList);
    
        sql.query(queryDetails, [idList], (error, results, fields) => {
            if (error) {
            console.log('Error:', error); // 输出错误信息
            throw error;
            }
            console.log('Results:', results); // 输出查询结果
            res.json(results);
        });
    });
};  
*/

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

