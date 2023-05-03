
const fs = require('fs');

let restaurantReviews = null;
const reviewPath = 'data/restaurant_reviews.json';

fs.readFile(reviewPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    restaurantReviews = JSON.parse(data);
});


exports.getComments = (req, res) => {
    const restaurantId = parseInt(req.params.id); // 将restaurantId从字符串转换为数字
  
    // 使用Array.find方法查找与restaurantId匹配的对象
    const commentsMatch = restaurantReviews.find((r) => r.cid === restaurantId);

    if (commentsMatch) {
        res.json(commentsMatch.reviews);
    } else {
        res.status(404).json({ message: `Comments with id ${restaurantId} not found` }); // 返回404错误
    }
};

exports.rateComment = (req, res) => {
    const restaurantId = parseInt(req.params.id);
    const commentsID = parseInt(req.params.commentsID);
    const action = req.body.action;
  
    // 在 restaurantReviews 中查找匹配的 restaurant
    const restaurant = restaurantReviews.find((r) => r.cid === restaurantId);
  
    if (!restaurant) {
        res.status(404).json({ message: `Comments with id ${restaurantId} not found` });
        return;
    }
  
    // 在找到的评论中，查找 commentsID 匹配的评论
    const comment = restaurant.reviews.find((c) => c.commits_id === commentsID);
  
    if (!comment) {
        res.status(404).json({ message: `Comment with id ${commentsID} not found` });
        return;
    }
  
    // 根据请求的操作（like 或 dislike），更新评论的 score
    if (action === "like") {
        comment.score++;
    } else if (action === "dislike") {
        comment.score--;
    } else {
        res.status(400).json({ message: "Invalid action" });
        return;
    }
  
    // 将更新后的 restaurantReviews 保存回文件
    fs.writeFile(reviewPath, JSON.stringify(restaurantReviews), "utf8", (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error saving data" });
            return;
        }
    
        // 返回更新后的评论
        res.json(comment);
    });
};

const saveRestaurantReviews = () => {
    fs.writeFile(reviewPath, JSON.stringify(restaurantReviews), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    });
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

exports.addComment = (req, res) => {
    const restaurantId = parseInt(req.params.id);
    const { user, userRate, currentComment } = req.body;

    // 在 restaurantReviews 中查找匹配的餐厅
    const restaurant = restaurantReviews.find((r) => r.cid === restaurantId);

    if (!restaurant) {
        res.status(404).json({ message: `Restaurant with id ${restaurantId} not found` });
        return;
    }

    // 创建新评论并添加到餐厅的评论列表中
    const newComment = {
        commits_id: Date.now(),
        username: user.name,
        createdAt: formatDate(new Date()),
        user_rate: userRate,
        score: 0,
        user_avatar: user.avatar,
        detail: currentComment,
    };
    restaurant.reviews.push(newComment);

    // 保存更新后的 restaurantReviews 到 JSON 文件
    saveRestaurantReviews();

    // 返回新评论的信息
    res.json(newComment);
};

