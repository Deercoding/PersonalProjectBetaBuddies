import cv2
import numpy as np

# Read the image
image = cv2.imread('bouldering pics/IJK wall crop.jpg')
hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# change to black write to better get counter
# blurred = cv2.GaussianBlur(hsv_image, (11, 11), 0)
# binaryIMG = cv2.Canny(blurred, 20, 160)
# cv2.imshow("blurred", blurred)
# cv2.imshow("binary",binaryIMG)
# yellow
# lower_range = np.array([20, 100, 100])
# upper_range = np.array([30, 255, 255])
# green
# lower_range = np.array([40, 40, 40])
# upper_range = np.array([80, 255, 255])
# light blue
# lower_range = np.array([85, 100, 100])
# upper_range = np.array([105, 255, 255])
#dark blue
# lower_range = np.array([108, 100, 100])
# upper_range = np.array([130, 255, 255])
# brown
# lower_range = np.array([11, 95, 95])
# upper_range = np.array([20, 150, 150])
# red
# lower_range = np.array([0, 100, 100])
# upper_range = np.array([6, 255, 255])
# black - cannot search black
# lower_range = np.array([0, 30, 30])
# upper_range = np.array([180, 90, 90])
# purple
# lower_range = np.array([150, 100, 100])
# upper_range = np.array([170, 160, 160])
#red
# lower_range = np.array([0, 100, 100])
# upper_range = np.array([10, 225, 225])
# orange
lower_range = np.array([10, 110, 110])
upper_range = np.array([20, 225, 225])


# Create a mask
mask = cv2.inRange(hsv_image, lower_range, upper_range)
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# draw rectangle
contours_red, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for cnt in contours_red:
    contour_area = cv2.contourArea(cnt)
    if contour_area > 100:
        x, y, w, h = cv2.boundingRect(cnt)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

# draw a line
centers = [cv2.minEnclosingCircle(cnt)[0] for cnt in contours_red if cv2.contourArea(cnt) > 100]

for i in range(len(centers) - 1):
    cv2.line(image, (int(centers[i][0]), int(centers[i][1])), (int(centers[i + 1][0]), int(centers[i + 1][1])), (0, 255, 0), 2)


# Display the result
cv2.imshow('Detected Colors', image)
cv2.waitKey(0)
cv2.destroyAllWindows()