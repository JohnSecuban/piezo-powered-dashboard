#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 26
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define LDR_PIN 35

#define LED1 13
#define LED2 12
#define LED3 14
#define LED4 27

const char* ssid = "Muffin";
const char* password = "akobudoyy";
const char* server = "https://v0-piezo-powered-dashboard.vercel.app/"; // Replace with your actual endpoint

int ldrThreshold = 2000;  // Adjust based on your environment
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;  // Dashboard update every 5 seconds

void setup() {
  Serial.begin(115200);
  delay(2000);
  dht.begin();

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  unsigned long startAttemptTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi.");
  }
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int ldrValue = analogRead(LDR_PIN);

  if (isnan(temp) || isnan(hum)) {
    Serial.println("DHT sensor error!");
    delay(100);
    return;
  }

  // LED control based on LDR
  bool isBright = ldrValue >= ldrThreshold;

  if (isBright) {
    digitalWrite(LED1, HIGH);
    digitalWrite(LED2, HIGH);
    digitalWrite(LED3, HIGH);
    digitalWrite(LED4, HIGH);
  } else {
    digitalWrite(LED1, LOW);
    digitalWrite(LED2, LOW);
    digitalWrite(LED3, LOW);
    digitalWrite(LED4, LOW);
  }

  // Serial output
  Serial.print("Raw LDR value: ");
  Serial.println(ldrValue);
  Serial.print("LDR: ");
  Serial.print(ldrValue);
  Serial.print(" | Temp: ");
  Serial.print(temp);
  Serial.print(" °C | Humidity: ");
  Serial.print(hum);
  Serial.print(" % | Lights: ");
  Serial.println(isBright ? "ON" : "OFF");

  // Send to IoT dashboard every 5 seconds
  if (millis() - lastSendTime >= sendInterval && WiFi.status() == WL_CONNECTED) {
    lastSendTime = millis();

    HTTPClient http;
    http.begin(server);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"temperature\":" + String(temp, 2) +
                     ",\"humidity\":" + String(hum, 2) +
                     ",\"light\":" + String(ldrValue) +
                     ",\"lights_on\":" + (isBright ? "true" : "false") + "}";

    int httpResponseCode = http.POST(payload);
    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);
    http.end();
  }

  delay(100);  // Fast LED reaction time
}
