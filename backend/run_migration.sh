#!/bin/bash
# Run this script to apply the database migration
cd "$(dirname "$0")"
python -m alembic upgrade head
