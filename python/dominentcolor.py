import cv2
import numpy as np

# Read the image
image = cv2.imread('bouldering pics/CD wall crop.png')

# Convert BGR to HSV
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# Define color ranges for different colors (in HSV format)
color_ranges = {
    'red': [(0, 100, 100), (10, 255, 255)],
    'green': [(40, 40, 40), (80, 255, 255)],
    'blue': [(100, 50, 50), (130, 255, 255)],
    'yellow': [(20, 100, 100), (30, 255, 255)],
    'orange': [(10, 100, 100), (20, 255, 255)],
    'purple': [(130, 50, 50), (160, 255, 255)],
    'pink': [(160, 50, 50), (180, 255, 255)],
    'cyan': [(80, 50, 50), (100, 255, 255)],
    'brown': [(0, 40, 20), (20, 255, 120)],
    'gray': [(0, 0, 50), (180, 40, 150)],
    'white': [(0, 0, 200), (180, 20, 255)],
    'black': [(0, 0, 0), (180, 255, 50)],
}

# Detect colors
detected_colors = {}

for color_name, (lower_range, upper_range) in color_ranges.items():
    # Create a mask for the specific color
    color_mask = cv2.inRange(hsv_image, np.array(lower_range), np.array(upper_range))

    # Count the number of non-zero pixels in the mask
    color_pixel_count = np.count_nonzero(color_mask)

    # Store the result in the dictionary
    detected_colors[color_name] = color_pixel_count

sorted_colors = dict(sorted(detected_colors.items(), key=lambda item: item[1], reverse=True))

# Find the color with the maximum pixel count
prominent_color = max(detected_colors, key=detected_colors.get)
print(sorted_colors)
print(f"The prominent color in the image is: {prominent_color}")
