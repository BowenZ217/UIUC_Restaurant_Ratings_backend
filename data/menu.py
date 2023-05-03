import json
import random
from faker import Faker
from faker_food import FoodProvider

fake = Faker()
fake.add_provider(FoodProvider)

def generate_random_menu(cid):
    menu_items_min = 5
    menu_items_max = 10
    menu_item_price_min = 10
    menu_item_price_max = 50
    menu = []

    for j in range(random.randint(menu_items_min, menu_items_max)):
        menu_item_id = j
        menu_item = {
            'dish_id': menu_item_id,
            'dish_name': fake.dish(),
            'dish_price': round(random.uniform(menu_item_price_min, menu_item_price_max), 2),
            'recommand_numebr': round(random.uniform(1, 5), 1)
        }
        menu.append(menu_item)

    return {"cid": cid, "menu": menu}

def generate_menus_for_restaurants(restaurant_data):
    restaurant_menus = []
    
    for restaurant in restaurant_data:
        cid = restaurant["cid"]
        restaurant_menus.append(generate_random_menu(cid))
    
    return restaurant_menus

# Load restaurant_data.json
with open("uiuc_restaurant_data.json", "r") as infile:
    restaurant_data = json.load(infile)

restaurant_menus = generate_menus_for_restaurants(restaurant_data)

with open('restaurant_menu.json', 'w') as outfile:
    json.dump(restaurant_menus, outfile, indent=2)
