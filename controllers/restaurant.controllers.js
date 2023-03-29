// const sql = require("../module/database.js");
const fs = require('fs');

let restaurantData = null;
const dataPath = 'uiuc_restaurant_data.json';

fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    restaurantData = JSON.parse(data);
});

exports.list = (req, res) => {
    const page = req.query.page || 1;
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
    const rowsPerPage = 10;
  
    const startIndex = (page - 1) * 10;

    console.log('StartIndex:', startIndex); // 输出起始索引

    /**
     * Sort array depends on `comparator`
     * 
     * @param {*} array 
     * @param {*} comparator 
     * @returns 
     */
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    /**
     * `comparator` for stableSort function
     * 
     * @param {*} order asc / desc
     * @param {*} orderBy name of property
     * @returns 
     */
    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    /**
     * 
     * @param {*} a 
     * @param {*} b 
     * @param {*} orderBy name of property
     * 
     * @returns {int} positive when a < b, negative when a > b
     */
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const result = stableSort(restaurantData, getComparator(sortOrder, sortField))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(({ cid, name, full_address, rating, type }) => ({ restaurant_id: cid, restaurant_name: name, restaurant_address: full_address, restaurant_rating: rating, restaurant_type: type }));
    
    const maxPage = Math.ceil(restaurantData.length / rowsPerPage) - 1;

    res.json({
        maxPage,
        data: result,
    });

    console.log('Result:', {
        maxPage,
        data: result,
    }); // 输出结果
};

exports.findById = (req, res) => {
    const restaurantId = parseInt(req.params.id); // 将restaurantId从字符串转换为数字
  
    // 使用Array.find方法查找与restaurantId匹配的对象
    const restaurant = restaurantData.find((r) => r.cid === restaurantId);

    if (restaurant) {
        const mappedRestaurant = {
            restaurant_id: restaurant.cid,
            restaurant_name: restaurant.name,
            restaurant_address: restaurant.full_address,
            restaurant_rating: restaurant.rating,
            restaurant_type: restaurant.type,
            restaurant_site: restaurant.site,
            restaurant_phone: restaurant.phone,
            restaurant_working_hours: restaurant.working_hours,
            restaurant_description: restaurant.description,
            restaurant_booking_appointment_link: restaurant.booking_appointment_link,
            restaurant_range: restaurant.range,
            restaurant_photo: restaurant.photo,
        };
      
        res.json(mappedRestaurant);
    } else {
        res.status(404).json({ message: `Restaurant with id ${restaurantId} not found` }); // 返回404错误
    }
};

/*
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
*/
