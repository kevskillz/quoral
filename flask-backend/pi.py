import time
from picamera import PiCamera
import Adafruit_DHT

import RPi.GPIO as GPIO

# Setup for the stepper motor
DIR = 20   # Direction GPIO Pin
STEP = 21  # Step GPIO Pin
CW = 1     # Clockwise Rotation
CCW = 0    # Counterclockwise Rotation
SPR = 200  # Steps per Revolution (360 / 1.8)

GPIO.setmode(GPIO.BCM)
GPIO.setup(DIR, GPIO.OUT)
GPIO.setup(STEP, GPIO.OUT)
GPIO.output(DIR, CW)

# Setup for the camera
camera = PiCamera()

# Setup for the temperature sensor
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4

# Function to read temperature
def read_temperature():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        print(f"Temp={temperature:0.1f}C  Humidity={humidity:0.1f}%")
    else:
        print("Failed to retrieve data from humidity sensor")

# Function to rotate the motor
def rotate_motor():
    delay = 10 / SPR / 2  # 10 seconds per revolution
    for _ in range(SPR):
        GPIO.output(STEP, GPIO.HIGH)
        time.sleep(delay)
        GPIO.output(STEP, GPIO.LOW)
        time.sleep(delay)

try:
    while True:
        read_temperature()
        camera.capture('/home/pi/image.jpg')
        rotate_motor()
        GPIO.output(DIR, CCW)
        rotate_motor()
        GPIO.output(DIR, CW)
        time.sleep(1)
        

except KeyboardInterrupt:
    print("Program stopped")

finally:
    GPIO.cleanup()