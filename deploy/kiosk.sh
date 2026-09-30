#!/bin/bash
# Pandulipi Kiosk Frontend Start Script
# Add this to autostart: @/home/pi/PANDULIPI/deploy/kiosk.sh

# Disable screen blanking
xset s noblank
xset s off
xset -dpms

# Hide mouse cursor
unclutter -idle 0.5 -root &

# Start Chromium in Kiosk mode
chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:5173
