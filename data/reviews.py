import json
import random
import datetime

review_id_counter = 0

def generate_random_review(cid, review_id_counter):
    male_names = ["Bob", "Charlie", "David", "George", "Jack"]
    female_names = ["Alice", "Eva", "Fiona", "Hannah", "Iris"]
    male_avatar = "/static/images/avatar/Default.jpeg"
    female_avatar = "/static/images/avatar/Default-2.jpeg"
    
    good_reviews = [
        "Great restaurant, highly recommended!",
        "Delicious food, elegant atmosphere, and attentive service.",
        "The dishes here are very fresh and generously portioned.",
        "This restaurant is a bit pricey, but the taste is great.",
        "Fantastic place with an amazing ambiance and tasty menu options.",
        "The service was impeccable, and the food was to die for!",
        "One of the best dining experiences I've had in a long time.",
        "Incredible flavors and beautiful presentation.",
        "The chef really knows how to create unique and delicious dishes.",
        "Loved the creative cocktails and the extensive wine list.",
        "Cozy atmosphere and top-notch service.",
        "We had a wonderful evening and will definitely be back.",
        "The dessert menu is absolutely divine.",
        "A hidden gem with exceptional food and service.",
        "Perfect place for a romantic dinner or special occasion.",
        "Every dish we tried was a pleasant surprise.",
    ]
    
    average_reviews = [
        "This restaurant is average, nothing special.",
        "The food was okay, but I've had better elsewhere.",
        "Decent place, but it didn't really stand out.",
        "The service was fine, but the food was just average.",
        "Not a bad experience, but I probably won't return.",
        "The atmosphere was nice, but the food was lacking.",
        "Some dishes were good, others not so much.",
        "A bit overpriced for the quality of the food.",
        "Good for a quick meal, but not for a special occasion.",
        "The appetizers were great, but the main courses fell short.",
    ]
    
    bad_reviews = [
        "The food is not good, and the service is poor. Not recommended.",
        "I think this restaurant is quite ordinary, I won't come back again.",
        "Very disappointed with the quality of the food and slow service.",
        "The portions were small, and the taste was bland.",
        "The noise level was unbearable, making it difficult to enjoy our meal.",
        "The staff seemed disinterested and unhelpful.",
        "Overcooked food and cold when it arrived at the table.",
        "The menu is limited and lacks creativity.",
        "Very long wait times, even with a reservation.",
        "The cleanliness of the restaurant was questionable.",
        "We had high expectations, but left feeling disappointed.",
        "The food was too salty, and the presentation was sloppy.",
        "The prices were high for the mediocre quality of the dishes.",
        "The service was slow, and the staff was not attentive.",
        "The food was not fresh, and the taste was unimpressive.",
    ]

    if random.random() < 0.5:
        name = random.choice(male_names)
        user_avatar = male_avatar
    else:
        name = random.choice(female_names)
        user_avatar = female_avatar
    rate = round(random.uniform(2, 5), 1)
    # Generate a random date within the past 30 days
    days_ago = random.randint(1, 30)
    date = datetime.datetime.now() - datetime.timedelta(days=days_ago)
    createdAt = date.strftime("%Y/%m/%d")
    
    score = random.randint(1, 20)

    if rate < 3:
        review = random.choice(bad_reviews)
    elif rate < 4:
        review = random.choice(average_reviews)
    else:
        review = random.choice(good_reviews)
    
    return {"commits_id": review_id_counter, "username": name, "createdAt": createdAt, "user_rate": rate, "score": score, "user_avatar": user_avatar, "detail": review}


def generate_reviews_for_restaurants(restaurant_data):
    global review_id_counter
    restaurant_reviews = []
    
    for restaurant in restaurant_data:
        cid = restaurant["cid"]
        num_reviews = random.randint(2, 5)
        reviews = []
        
        for _ in range(num_reviews):
            reviews.append(generate_random_review(cid, review_id_counter))
            review_id_counter += 1
        
        restaurant_reviews.append({"cid": cid, "reviews": reviews})
    
    return restaurant_reviews

with open("uiuc_restaurant_data.json", "r") as f:
    restaurant_data = json.load(f)

restaurant_reviews = generate_reviews_for_restaurants(restaurant_data)

with open("restaurant_reviews.json", "w") as f:
    json.dump(restaurant_reviews, f)

