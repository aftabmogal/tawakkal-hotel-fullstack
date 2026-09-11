from django.core.management.base import BaseCommand
from hotel.models import Room, Facility  # Adjust model imports if needed

class Command(BaseCommand):
    help = "Seed initial rooms and facilities"

    def handle(self, *args, **kwargs):
        # Create default facility if none exist
        if not Facility.objects.exists():
            Facility.objects.create(name="Free Wi-Fi", icon="wifi")
            Facility.objects.create(name="AC", icon="snowflake")
            self.stdout.write(self.style.SUCCESS("Facilities created!"))

        # Create default room if none exist
        if not Room.objects.exists():
            Room.objects.create(
                name="Deluxe Suite",
                price=2500,
                description="Spacious room with air conditioning and premium amenities.",
                is_available=True
            )
            self.stdout.write(self.style.SUCCESS("Rooms created!"))