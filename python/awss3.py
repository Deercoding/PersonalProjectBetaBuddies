import boto3
s3 = boto3.client("s3", aws_access_key_id="AKIAQYMVRYHHB6Y7P27A", aws_secret_access_key="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")
#upload file
with open("output/dark_blue_AB wall crop new.jpg_1700043852723.jpg", "rb") as f:
    s3.upload_fileobj(f,"boulderingproject", "ABwall_dark_blue" )