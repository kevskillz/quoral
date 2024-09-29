from flask import Flask, request, jsonify
app = Flask(__name__)
import pickle as pkl
import json
import cv2
from sklearn.cluster import KMeans
import numpy as np
from PIL import Image
from inference_sdk import InferenceHTTPClient, InferenceConfiguration
import sqlite3
import matplotlib.pyplot as plt
IDX = 0

# Static methods
def palette(clusters):
    width=300
    palette = np.zeros((50, width, 3), np.uint8)
    steps = width/clusters.cluster_centers_.shape[0]
    for idx, centers in enumerate(clusters.cluster_centers_): 
        palette[:, int(idx*steps):(int((idx+1)*steps)), :] = centers
    return palette

def extract_bounding_box(image_array, detection_results):
    
    # Get image dimensions
    img_height, img_width = image_array.shape[:2]
    boxes = []
    # Extract bounding box information
    for prediction in detection_results['predictions']:
        x = int(prediction['x'])
        y = int(prediction['y'])
        width = int(prediction['width'])
        height = int(prediction['height'])
        
        # Calculate box coordinates
        left = max(0, int(x - width / 2))
        top = max(0, int(y - height / 2))
        right = min(img_width, int(x + width / 2))
        bottom = min(img_height, int(y + height / 2))
        
        # Extract the subarray
        boxes.append(image_array[top:bottom, left:right].copy())
        
    return boxes
    
def visualize_bounding_boxes(image_array, detection_results):
  
    # Define colors for different classes (you can expand this)
    colors = {
        "Healthy coral": (0, 255, 0),  # Green for healthy coral (in BGR format)
    }

    # Draw bounding boxes
    for prediction in detection_results['predictions']:
        x = int(prediction['x'])
        y = int(prediction['y'])
        width = int(prediction['width'])
        height = int(prediction['height'])
        label = prediction['class']
        confidence = prediction['confidence']

        # Calculate box coordinates
        left = int(x - width / 2)
        top = int(y - height / 2)
        right = int(x + width / 2)
        bottom = int(y + height / 2)

        # Draw rectangle
        color = colors.get(label, (0, 0, 255))  # Default to red if class not in colors
        cv2.rectangle(image_array, (left, top), (right, bottom), color, 2)

        # Draw label
        text = f"{label}: {confidence:.2f}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.5
        font_thickness = 1
        text_size = cv2.getTextSize(text, font, font_scale, font_thickness)[0]

        # Draw filled rectangle for text background
        cv2.rectangle(image_array, (left, top - text_size[1] - 5), (left + text_size[0], top), color, -1)

        # Put text on the image
        cv2.putText(image_array, text, (left, top - 5), font, font_scale, (255, 255, 255), font_thickness)

    return image_array

def get_preds_for_image(frame):
    custom_configuration = InferenceConfiguration(confidence_threshold=0.25)
# Replace ROBOFLOW_API_KEY with your Roboflow API Key
    CLIENT = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="waYPLS320ZHlgmQzFfYN"
    )
    with CLIENT.use_configuration(custom_configuration):
        result = CLIENT.infer(frame, model_id="coralreef-uazzj/4")
    return result


def show_img_compar(img_1, img_2 ):
    f, ax = plt.subplots(1, 2, figsize=(10,10))
    ax[0].imshow(img_1)
    ax[1].imshow(img_2)
    ax[0].axis('off') #hide the axis
    ax[1].axis('off')
    f.tight_layout()
    plt.savefig('comparison.jpg')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    temperature = request.form.get('temperature', type=float)
    latitude = request.form.get('latitude', type=float)
    longitude = request.form.get('longitude', type=float)
    id = request.form.get('id', type=int)

    image = Image.open(image.stream)
    image_array = np.array(image)

    result = get_preds_for_image(image_array)
    box_subarrays = extract_bounding_box(image_array, result)
    image_with_boxes = visualize_bounding_boxes(image_array, result)

    image_with_boxes = cv2.cvtColor(image_with_boxes, cv2.COLOR_BGR2RGB)
    box_subarrays = [cv2.cvtColor(box, cv2.COLOR_BGR2RGB) for box in box_subarrays]

    if not len(box_subarrays):
        return jsonify({"message": "File and measurements received successfully"}), 200
    
    

    b_avg = 0
    total = 0
    for box in box_subarrays:
        clt_3 = KMeans(n_clusters=5)
        clt_3.fit(box.reshape(-1, 3))
        clt_3_centroids = clt_3.cluster_centers_
        # Sort centroids by their distance to white (255, 255, 255)
        sorted_centroids = sorted(clt_3_centroids, key=lambda c: np.linalg.norm(c - np.array([255, 255, 255])))
        bleaching = np.asarray(sorted_centroids[:3]).sum()
        b_avg += bleaching
        total += 1
    bleach = b_avg/total
    # Connect to the database (or create it if it doesn't exist)
    conn = sqlite3.connect('measurements.db')
    fp = f'images/{IDX}.jpg'
    cv2.imwrite(fp, image_with_boxes)
    cursor = conn.cursor()    
    # Insert the new measurement
    cursor.execute('''
        SELECT MAX(timestep) FROM measurements WHERE id = ?
    ''', (id,))
    max_timestep = cursor.fetchone()[0]
    if max_timestep is None:
        max_timestep = -1
    cursor.execute('''
        INSERT INTO measurements (id, temperature, latitude, longitude, bleaching, timestep, filename)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (id, temperature, latitude, longitude, bleach, max_timestep + 1, fp))

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()
        
    # Process the image and measurements here
    # For now, we'll just return a success message

@app.route('/get_at_location', methods=['GET'])
def get_at_location():
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    # Retrieve data based on latitude and longitude
    # For now, we'll just return a dummy response
    return jsonify({"message": f"Data for location ({latitude}, {longitude})"}), 200

@app.route('/alerts', methods=['GET'])
def alerts():
    # Retrieve alerts
    # For now, we'll just return a dummy response
    return jsonify({"alerts": "No alerts at the moment"}), 200

if __name__ == '__main__':
    app.run(debug=True)