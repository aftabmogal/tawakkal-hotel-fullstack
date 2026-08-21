from django.core.management.base import BaseCommand

from hotel.models import Facility, Room, RoomImage
from restaurant.models import FoodItem, RestaurantCategory

ROOMS = [
    {
        'name': 'AC Standard Room', 'room_type': 'Standard', 'guests': 2,
        'bed_type': 'Double Bed', 'size': '120 sq ft', 'price_per_night': 1499,
        'amenities': ['Free Wi-Fi', 'Air Conditioning', 'Attached Bathroom', 'TV'],
        'description': 'A compact, comfortable room for a short stay — air-conditioned, '
                        'with an attached bathroom and hot water on request.',
        'image': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'AC Deluxe Room', 'room_type': 'Deluxe', 'guests': 2,
        'bed_type': 'Queen Bed', 'size': '150 sq ft', 'price_per_night': 1899,
        'amenities': ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV', 'Hot Water'],
        'description': 'A little more room to spread out, with a queen bed and '
                        'round-the-clock room service.',
        'image': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'Non-AC Standard Room', 'room_type': 'Standard', 'guests': 2,
        'bed_type': 'Double Bed', 'size': '110 sq ft', 'price_per_night': 999,
        'amenities': ['Free Wi-Fi', 'Attached Bathroom', 'TV'],
        'description': 'Our most budget-friendly room — fan-cooled with an attached '
                        'bathroom, TV, and free Wi-Fi.',
        'image': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'Triple Sharing Room', 'room_type': 'Family', 'guests': 3,
        'bed_type': 'Double + Extra Bed', 'size': '160 sq ft', 'price_per_night': 2199,
        'amenities': ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV'],
        'description': 'Built for three — a double bed plus an extra bed, air-conditioned.',
        'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'AC Family Room', 'room_type': 'Family', 'guests': 4,
        'bed_type': '2 Double Beds', 'size': '200 sq ft', 'price_per_night': 2799,
        'amenities': ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV', 'Hot Water'],
        'description': 'Our largest room, with two double beds for families or small '
                        'groups travelling together.',
        'image': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    },
    {
        'name': 'Executive AC Room', 'room_type': 'Deluxe', 'guests': 2,
        'bed_type': 'Queen Bed', 'size': '170 sq ft', 'price_per_night': 2299,
        'amenities': ['Free Wi-Fi', 'Air Conditioning', 'Ironing Service', 'Room Service', 'TV'],
        'description': 'Our best-appointed room, with ironing service on request.',
        'image': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80',
    },
]

FACILITIES = [
    ('Free Wi-Fi', '📶', 'hotel', 'Complimentary wireless internet throughout the property.'),
    ('AC Rooms', '❄️', 'hotel', 'Air-conditioned rooms with attached bathrooms and hot water.'),
    ('24-Hour Front Desk', '🛎️', 'hotel', 'Check in any time — someone is always at the desk.'),
    ('Room Service', '🧾', 'hotel', 'Order from the restaurant menu straight to your room.'),
    ('Ironing Service', '👔', 'hotel', 'Available on request for a fresh start to the day.'),
    ('TV in Every Room', '📺', 'hotel', 'Satellite channels in every room, standard and deluxe alike.'),
    ('Dine-In Seating', '🍽️', 'restaurant', 'Indoor seating for families and groups, open daily.'),
    ('Home Delivery', '🛵', 'restaurant', 'Order online for delivery across Kurla and Sakinaka.'),
    ('Takeaway', '🥡', 'restaurant', 'Skip the wait — call ahead and pick up your order.'),
    ('Catering', '🎉', 'restaurant', 'Catering available for special occasions and office events.'),
    ('Digital Payments', '💳', 'restaurant', 'Cards and UPI accepted alongside cash.'),
    ('Late Hours', '🕛', 'restaurant', 'Kitchen stays open until 12:30 AM, seven days a week.'),
]

MENU = {
    'Biryani': [
        ('Chicken Biryani', 220), ('Mutton Biryani', 320),
        ('Paneer Biryani', 190), ('Egg Biryani', 160),
    ],
    'Tandoori & Starters': [
        ('Chicken Tikka', 240), ('Tandoori Chicken (Half)', 260),
        ('Seekh Kabab', 220), ('Fried Papad', 40),
    ],
    'North Indian & Mughlai': [
        ('Chicken Masala', 230), ('Mutton Rogan Josh', 340),
        ('Paneer Palak', 200), ('Paneer Matar', 190),
        ('Veg Kolhapuri', 180), ('Dal Khichdi', 150),
    ],
    'Chinese & Sichuan': [
        ('Veg Schezwan Hakka Noodles', 150), ('Chicken Triple Schezwan Rice', 210),
        ('Chilli Chicken', 230), ('Veg Manchurian', 170),
    ],
    'Seafood': [
        ('Prawns Masala', 350), ('Fish Fry', 280),
    ],
    'Breads & Sides': [
        ('Butter Garlic Naan', 60), ('Tandoori Roti', 25), ('Raita', 70),
    ],
    'Beverages': [
        ('Fresh Lime Soda', 70), ('Masala Chai', 30), ('Mango Milkshake', 120),
    ],
}


class Command(BaseCommand):
    help = 'Seed the database with realistic sample data matching the frontend.'

    def handle(self, *args, **options):
        self.seed_rooms()
        self.seed_facilities()
        self.seed_menu()
        self.stdout.write(self.style.SUCCESS('Sample data seeded successfully.'))

    def seed_rooms(self):
        for data in ROOMS:
            image_url = data.pop('image')
            room, created = Room.objects.update_or_create(
                name=data['name'], defaults=data
            )
            if created or not room.images.exists():
                RoomImage.objects.get_or_create(
                    room=room, order=0, defaults={'image_url': image_url, 'alt_text': room.name}
                )
        self.stdout.write(f'  Rooms: {Room.objects.count()}')

    def seed_facilities(self):
        for name, icon, category, description in FACILITIES:
            Facility.objects.update_or_create(
                name=name, defaults={'icon': icon, 'category': category, 'description': description}
            )
        self.stdout.write(f'  Facilities: {Facility.objects.count()}')

    def seed_menu(self):
        for order, (category_name, items) in enumerate(MENU.items()):
            category, _ = RestaurantCategory.objects.update_or_create(
                name=category_name, defaults={'order': order}
            )
            for item_name, price in items:
                FoodItem.objects.update_or_create(
                    category=category, name=item_name, defaults={'price': price}
                )
        self.stdout.write(f'  Menu items: {FoodItem.objects.count()}')
