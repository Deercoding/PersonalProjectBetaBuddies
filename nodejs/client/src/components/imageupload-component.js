import React, { useState } from "react";

const ImageuploadComponent = () => {
  const [fileList, setFileList] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const updateList = (event) => {
    const input = event.target;
    const newFileList = [];
    const newImagePreviews = [];

    for (let i = 0; i < input.files.length; ++i) {
      newFileList.push(input.files.item(i).name);

      const reader = new FileReader();

      reader.onload = function (e) {
        newImagePreviews.push(e.target.result);
        setImagePreviews([...newImagePreviews]); // Update image previews state
      };

      reader.readAsDataURL(input.files[i]);
    }

    setFileList(newFileList);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Image upload</title>
      </head>
      <body>
        <div>
          <form
            action="http://localhost:8080/api/wallupload"
            method="post"
            encType="multipart/form-data"
          >
            <label htmlFor="file">Upload 1 image</label>
            <input
              id="file"
              type="file"
              name="file"
              onChange={updateList}
              multiple
            />
            <div id="fileList">
              <ul>
                {fileList.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
            <br />
            <div id="preview">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ maxWidth: "200px", marginRight: "10px" }}
                />
              ))}
            </div>
            <br />
            <button type="submit">Send</button>
          </form>
        </div>
        <div id="header"></div>
      </body>
    </html>
  );
};

export default ImageuploadComponent;
