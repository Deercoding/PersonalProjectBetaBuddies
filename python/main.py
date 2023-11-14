# openai poc
import cv2
import numpy as np

img = cv2.imread("bouldering pics/balance wall.jpg")
# print(img)
# cv2.imshow("balanceWall",img)
# cv2.waitKey(0)
# change to hsv
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)


#  OpenCV use HSV values ranges between (0–180, 0–255, 0–255)
# yellow
# lower_range = np.array([20, 100, 100])
# upper_range = np.array([30, 255, 255])

#green
lower_range = np.array([40, 40, 40])
upper_range = np.array([80, 255, 255])

mask = cv2.inRange(hsv, lower_range, upper_range)
cv2.imshow("image", img)
# cv2.imshow("mask", mask)
color_image = cv2.bitwise_and(img, img, mask=mask)
cv2.imshow('Coloured Image', color_image)

cv2.waitKey(0)
cv2.destroyAllWindows()
