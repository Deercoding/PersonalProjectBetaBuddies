import numpy as np
import cv2

color = np.uint8([[[107, 108, 252]]]) # Here insert the BGR values which you want to convert to HSV
hsvColor= cv2.cvtColor(color, cv2.COLOR_BGR2HSV)
print(hsvColor)

lowerLimit = hsvColor[0][0][0] - 10, 100, 100
upperLimit = hsvColor[0][0][0] + 10, 255, 255

print(upperLimit)
print(lowerLimit)

