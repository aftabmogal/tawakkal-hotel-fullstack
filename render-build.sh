#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip and build tools to avoid source compilation issues
python -m pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

# Run Django commands
python manage.py collectstatic --no-input
python manage.py migrate