#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 26
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define LDR_PIN 35

#define LED1 12
#define LED2 33
#define LED3 14
#define LED4 27
#define LED5 25


const char* ssid = "Muffin";
const char* password = "akobudoyy";
const char* server = "https://v0-piezo-powered-dashboard.vercel.app/";

int ldrThreshold = 2000;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;

void setup() {
  Serial.begin(115200);
  delay(2000);
  dht.begin();

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  pinMode(LED5, OUTPUT);
  // ✅ Initialized LED6

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

  bool isBright = ldrValue >= ldrThreshold;

  int ledState = isBright ? HIGH : LOW;
  digitalWrite(LED1, ledState);
  digitalWrite(LED2, ledState);
  digitalWrite(LED3, ledState);
  digitalWrite(LED4, ledState);
  digitalWrite(LED5, ledState);
 // ✅ LED6 control

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

  delay(100);  // Fast LED reaction
}
