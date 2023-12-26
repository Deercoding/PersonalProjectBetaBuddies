import json
import cv2
import boto3
import numpy as np
import urllib
import os
import requests

s3_client = boto3.client("s3")


def lambda_handler(event, context):
    try:
        print('lambda function is triggered')
        # get object
        bucket = event["Records"][0]["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
        print(bucket)
        print(key)

        # # write opencv
        response = s3_client.get_object(Bucket=bucket, Key=key)
        img = response['Body'].read()

        np_array = np.fromstring(img, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        # change to hsv
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

        image_folder = "/tmp"
        result_url = []

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

            centers = [cv2.minEnclosingCircle(cnt)[0] for cnt in contours if cv2.contourArea(cnt) > 100]
            for i in range(len(centers) - 1):
                cv2.line(image, (int(centers[i][0]), int(centers[i][1])), (int(centers[i + 1][0]), int(centers[i + 1][1])),
                        (255, 255, 255), 2)

            if len(centers) > 2:
                output_image_path = os.path.join(image_folder, f'{color_name}_{key}')
                cv2.imwrite(output_image_path, image)
                print(f'{color_name}_{key}')
                result_url.append(f'{color_name}_{key}')
                # Body accept byte
                s3_client.put_object(Bucket="imageprocessresult", Key=f'{color_name}_{key}',
                                Body=open(output_image_path, "rb").read())

            image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        print(result_url)
        # response to Node.js
        url = 'http://13.55.105.122:3000/api/wallupload/response'
        myobj = {'imageNames': result_url}
        x = requests.post(url, json=myobj)
        x.raise_for_status()  # Raise an HTTPError if the HTTP request returned an unsuccessful status code
        print(x)

        # if os.path.exists("/tmp"):
        #     os.remove("/tmp")

        return {
            "statusCode": 200,
            "body": json.dumps("Success ")
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps(f"Error: {str(e)}")
        }
