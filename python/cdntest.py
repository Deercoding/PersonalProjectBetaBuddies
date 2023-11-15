import cv2
import numpy as np
import os
import requests


imageName = "AB wall crop new.jpg_1700043852723.jpg"

cloudfrontUrl = "https://d2mh6uqojgaomb.cloudfront.net/"
cdnTest = cloudfrontUrl + imageName
response = requests.get(cdnTest)
np_arr = np.frombuffer(response.content, np.uint8)

# Read the image
image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

# Convert BGR to HSV
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

color_ranges = {
    'orange': [(10, 151, 151), (19, 225, 225)],
    'brown': [(11, 95, 95), (19, 150, 150)],
    'yellow': [(20, 100, 100), (30, 255, 255)],
    'green': [(40, 40, 40), (80, 255, 255)],
    'light_blue': [(85, 100, 100), (105, 255, 255)],
    'dark_blue': [(108, 100, 100), (120, 255, 255)],
    'purple': [(150, 100, 100), (170, 255, 255)],
}

imageFolder = "output"
os.makedirs(imageFolder, exist_ok=True)

for color_name, (lower_range, upper_range) in color_ranges.items():
    # Create a mask
    mask = cv2.inRange(hsv_image, lower_range, upper_range)

    # find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw detected contour in input image
    for cnt in contours:
        contour_area = cv2.contourArea(cnt)
        if contour_area > 100:
            x, y, w, h = cv2.boundingRect(cnt)
            # add rectangle
            cv2.rectangle(image, (x, y), (x + w, y + h), (255, 255, 255), 2)

    # add lines
    centers = [cv2.minEnclosingCircle(cnt)[0] for cnt in contours if cv2.contourArea(cnt) > 100]
    for i in range(len(centers) - 1):
        cv2.line(image, (int(centers[i][0]), int(centers[i][1])), (int(centers[i + 1][0]), int(centers[i + 1][1])), (255, 255, 255), 2)

    # Save the image
    if(len(centers)>2):
        output_image_path = os.path.join(imageFolder, f'{color_name}_{imageName}')
        cv2.imwrite(output_image_path, image)

    # Reset the image for the next color
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    #save image to s3
    

