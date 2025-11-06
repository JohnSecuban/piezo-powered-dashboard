// ESP32 Code Example for Piezo Power System
// Upload this to your ESP32 board

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* dashboardURL = "http://YOUR_DASHBOARD_URL/api/sensors";
const char* controlsURL = "http://YOUR_DASHBOARD_URL/api/controls";

// Sensor pins
#define DHTPIN 4
#define DHTTYPE DHT22
#define SOLAR_PIN 34      // ADC pin for solar panel
#define PIEZO_PIN 35      // ADC pin for piezo disc
#define BATTERY_PIN 36    // ADC pin for battery voltage
#define LED_PIN 5         // GPIO pin for LED control

DHT dht(DHTPIN, DHTTYPE);
HTTPClient http;

// Calibration values (adjust based on your sensors)
const float SOLAR_MAX_VOLTAGE = 5.0;
const float PIEZO_MAX_VOLTAGE = 5.0;
const float BATTERY_MAX_VOLTAGE = 4.2;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize sensors
  dht.begin();
  pinMode(LED_PIN, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.connected()) {
    // Read sensors
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    
    // Read energy sources (convert ADC to voltage)
    float solarVoltage = (analogRead(SOLAR_PIN) / 4095.0) * 5.0;
    float piezoVoltage = (analogRead(PIEZO_PIN) / 4095.0) * 5.0;
    float batteryVoltage = (analogRead(BATTERY_PIN) / 4095.0) * 5.0;
    
    // Convert voltage to watts (example: 1V = 50W for solar, 1V = 30W for piezo)
    float solarEnergy = solarVoltage * 50.0;
    float piezoEnergy = piezoVoltage * 30.0;
    
    // Convert battery voltage to mAh (example calibration)
    float energyStored = (batteryVoltage / BATTERY_MAX_VOLTAGE) * 1000.0;
    
    // Send data to dashboard
    sendSensorData(solarEnergy, piezoEnergy, temperature, humidity, energyStored);
    
    // Check for LED control commands (would need separate endpoint or MQTT for bi-directional)
    // For now, this is a placeholder
  }
  
  delay(2000); // Send data every 2 seconds
}

void sendSensorData(float solar, float piezo, float temp, float humidity, float stored) {
  http.begin(dashboardURL);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"solarEnergy\":" + String(solar) + 
                   ",\"piezoEnergy\":" + String(piezo) + 
                   ",\"temperature\":" + String(temp) + 
                   ",\"humidity\":" + String(humidity) + 
                   ",\"energyStored\":" + String(stored) + "}";
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.println("Data sent successfully!");
  } else {
    Serial.print("Error sending data: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
