// const sql = require("../module/database.js");
const fs = require('fs');

let restaurantData = null;
let restaurantMenu = null;
const dataPath = 'data/filtered_restaurant_data.json';
const menuPath = 'data/restaurant_menu.json';
const allTypes = ['Chinese restaurant', 'Mexican restaurant', 'Fast food restaurant', 'American restaurant', 'Barbecue restaurant', 'Pizza restaurant', 'Italian restaurant', 'Sandwich shop', 'Other'];


fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    restaurantData = JSON.parse(data);
});

fs.readFile(menuPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    restaurantMenu = JSON.parse(data);
});


exports.list = (req, res) => {
    const page = req.query.page || 1;
    sortField = req.query.sortField || 'cid';
    sortOrder = req.query.sortOrder || 'asc';
    FoodType = req.query.FoodType || 'all';
    const rowsPerPage = 10;

    if (sortField === 'restaurant_name') {
        sortField = 'name';
    }
    if (sortField === 'restaurant_address') {
        sortField = 'full_address';
    }
    if (sortField === 'restaurant_rating') {
        sortField = 'rating';
    }
  
    const startIndex = (page - 1) * 10;

    // console.log('StartIndex:', startIndex); // 输出起始索引

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

    let filteredData = restaurantData;
    
    // if FoodType is not 'all'，则筛选数据
    if (FoodType !== 'all') {
        const types = FoodType.split(',');
        filteredData = restaurantData.filter((restaurant) => {
            if (types.includes(restaurant.type)) {
                return true;
            } else if (types.includes('Other')) {
                // 当选择 "Other" 类型时，筛选出未列出的类型
                return !allTypes.some((listedType) => listedType === restaurant.type);
            } else {
                return false;
            }
        });
    }

    // 使用筛选后的数据进行排序和分页
    const result = stableSort(filteredData, getComparator(sortOrder, sortField))
        .slice(startIndex, startIndex + rowsPerPage)
        .map(({ cid, name, full_address, rating, type }) => ({ restaurant_id: cid, restaurant_name: name, restaurant_address: full_address, restaurant_rating: rating, restaurant_type: type }));

    const maxPage = Math.ceil(filteredData.length / rowsPerPage) - 1;

    res.json({
        maxPage,
        data: result,
    });
     /*
    console.log('Result:', {
        maxPage,
        data: result,
    }); // 输出结果
    // */
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
            restaurant_logo: restaurant.logo,
        };
      
        res.json(mappedRestaurant);
    } else {
        res.status(404).json({ message: `Restaurant with id ${restaurantId} not found` }); // 返回404错误
    }
};

exports.search = (req, res) => {
    searchTerm = req.query.q || '';
    const page = req.query.page || 1;
    sortField = req.query.sortField || 'cid';
    sortOrder = req.query.sortOrder || 'asc';
    FoodType = req.query.FoodType || 'all';
    const rowsPerPage = 10;

    if (sortField === 'restaurant_name') {
        sortField = 'name';
    }
    if (sortField === 'restaurant_address') {
        sortField = 'full_address';
    }
    if (sortField === 'restaurant_rating') {
        sortField = 'rating';
    }
  
    const startIndex = (page - 1) * 10;

    // console.log('StartIndex:', startIndex); // 输出起始索引

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

    let filteredData = restaurantData;
    
    // if FoodType is not 'all'，则筛选数据
    if (FoodType !== 'all') {
        const types = FoodType.split(',');
        filteredData = restaurantData.filter((restaurant) => {
            if (types.includes(restaurant.type)) {
                return true;
            } else if (types.includes('Other')) {
                // 当选择 "Other" 类型时，筛选出未列出的类型
                return !allTypes.some((listedType) => listedType === restaurant.type);
            } else {
                return false;
            }
        });
    }
        
    if (searchTerm !== '') {
        filteredData = filteredData.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.full_address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 使用筛选后的数据进行排序和分页
    const result = stableSort(filteredData, getComparator(sortOrder, sortField))
        .slice(startIndex, startIndex + rowsPerPage)
        .map(({ cid, name, full_address, rating, type }) => ({ restaurant_id: cid, restaurant_name: name, restaurant_address: full_address, restaurant_rating: rating, restaurant_type: type }));

    const maxPage = Math.ceil(filteredData.length / rowsPerPage) - 1;

    res.json({
        maxPage,
        data: result,
    });
    // /*
    console.log('searchTerm:', searchTerm);
    
    console.log('Result:', {
        maxPage,
        data: result,
    }); // 输出结果
    // */
};

exports.getMenu = (req, res) => {
    const restaurantId = parseInt(req.params.id); // 将restaurantId从字符串转换为数字
  
    // 使用Array.find方法查找与restaurantId匹配的对象
    const menuMatch = restaurantMenu.find((r) => r.cid === restaurantId);

    if (menuMatch) {
        res.json(menuMatch.menu);
    } else {
        res.status(404).json({ message: `Menu with id ${restaurantId} not found` }); // 返回404错误
    }
};

exports.rate = (req, res) => {
    const restaurantId = parseInt(req.params.id);
    const { userRate } = req.body;
  
    const restaurant = restaurantData.find((r) => r.cid === restaurantId);
  
    if (!restaurant) {
        res.status(404).json({ message: `Restaurant with id ${restaurantId} not found` });
        return;
    }
  
    // 更新 reviews_per_score 对象
    restaurant.reviews_per_score[userRate]++;
    // 增加总评论数量
    restaurant.reviews++;
  
    // 计算新的平均评分
    let totalScore = 0;
    let totalCount = 0;
  
    for (let i = 1; i <= 5; i++) {
        totalScore += i * restaurant.reviews_per_score[i];
        totalCount += restaurant.reviews_per_score[i];
    }
  
    restaurant.rating = totalScore / totalCount;
  
    // 将更新后的 restaurantData 保存回文件
    fs.writeFile(dataPath, JSON.stringify(restaurantData), "utf8", (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error saving data" });
            return;
        }
    
        // 返回更新后的餐厅评分
        res.json({ rating: restaurant.rating });
    });
};
  
