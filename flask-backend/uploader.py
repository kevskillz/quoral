import requests
import os

# URL of your Flask application
BASE_URL = "http://localhost:5000"  # Change this if your app is running on a different port or host

def test_upload_endpoint():
    # Path to an image file for testing
    image_path = "testimg.jpg"  # Replace with an actual image path
    
    # Ensure the image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file not found at {image_path}")
        return

    # Prepare the data for the POST request
    data = {
        'temperature': 25.5,
        'latitude': 40.7128,
        'longitude': -74.0060,
        'id': 0
    }

    # Prepare the files for the POST request
    files = {
        'image': ('test_image.jpg', open(image_path, 'rb'), 'image/jpeg')
    }

    try:
        # Send the POST request
        response = requests.post(f"{BASE_URL}/upload", data=data, files=files)

        # Check the response
        if response.status_code == 200:
            print("Test successful!")
            print("Response:", response.json())
        else:
            print(f"Test failed with status code: {response.status_code}")
            print("Response:", response.text)
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the file
        files['image'][1].close()

if __name__ == "__main__":
    test_upload_endpoint()