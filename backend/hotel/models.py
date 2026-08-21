from django.db import models


class Facility(models.Model):
    CATEGORY_CHOICES = [
        ('hotel', 'Hotel'),
        ('restaurant', 'Restaurant'),
    ]

    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, blank=True, help_text='Emoji shown on the site')
    description = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='hotel')

    class Meta:
        verbose_name_plural = 'Facilities'

    def __str__(self):
        return self.name


class Room(models.Model):
    ROOM_TYPES = [
        ('Standard', 'Standard'),
        ('Deluxe', 'Deluxe'),
        ('Suite', 'Suite'),
        ('Family', 'Family'),
    ]

    name = models.CharField(max_length=150)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    description = models.TextField(blank=True)
    guests = models.PositiveSmallIntegerField(default=2)
    bed_type = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=50, blank=True, help_text="e.g. '150 sq ft'")
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    amenities = models.JSONField(default=list, blank=True, help_text='List of amenity strings')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['price_per_night']

    def __str__(self):
        return self.name


class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='rooms/', blank=True, null=True)
    image_url = models.URLField(
        blank=True, help_text='External URL fallback, used for seed/demo data'
    )
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.room.name} — image {self.order}'
