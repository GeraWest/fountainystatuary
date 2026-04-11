import os
import json
import base64
from urllib.request import Request, urlopen
from urllib.error import HTTPError

API_KEY = "wHrG847XDz399W93vdYtLxVd7qt6TPcm"
IMAGE_DIR = "img"
EXTENSIONS = {".jpg", ".jpeg", ".png"}

def compress_image(file_path):
    print(f"Compressing: {file_path}...", end=" ", flush=True)
    
    # Prepare auth header
    auth_str = f"api:{API_KEY}"
    encoded_auth = base64.b64encode(auth_str.encode("ascii")).decode("ascii")
    headers = {
        "Authorization": f"Basic {encoded_auth}",
        "Content-Type": "application/octet-stream"
    }

    try:
        # Read the unoptimized image
        with open(file_path, "rb") as f:
            data = f.read()

        # Call Tinify API to shrink
        request = Request("https://api.tinify.com/shrink", data=data, headers=headers, method="POST")
        with urlopen(request) as response:
            result = json.loads(response.read().decode("utf-8"))
            output_url = result["output"]["url"]
            input_size = result["input"]["size"]
            output_size = result["output"]["size"]
            savings = (1 - output_size / input_size) * 100

        # Download the optimized image
        with urlopen(output_url) as response:
            with open(file_path, "wb") as f:
                f.write(response.read())
        
        print(f"Done! ({input_size/1024:.1f}KB -> {output_size/1024:.1f}KB, -{savings:.1f}%)")
        return input_size - output_size

    except HTTPError as e:
        print(f"Error: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {str(e)}")
    return 0

def main():
    total_saved = 0
    count = 0
    
    for root, dirs, files in os.walk(IMAGE_DIR):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                file_path = os.path.join(root, file)
                total_saved += compress_image(file_path)
                count += 1
    
    print(f"\nFinished! Compressed {count} images.")
    print(f"Total space saved: {total_saved / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    main()
