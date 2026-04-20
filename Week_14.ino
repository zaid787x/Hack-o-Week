#include <EEPROM.h>
#define sensorPin 7
#define ledPin 13
long duration;
int distance;
int chocolates;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  chocolates = EEPROM.read(0);
  if (chocolates <= 0 || chocolates > 10) {
    chocolates = 10;
    EEPROM.write(0, chocolates);
  }
}

int getDistance() {
  pinMode(sensorPin, OUTPUT);
  digitalWrite(sensorPin, LOW);
  delayMicroseconds(2);
  digitalWrite(sensorPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(sensorPin, LOW);
  pinMode(sensorPin, INPUT);
  duration = pulseIn(sensorPin, HIGH);
  distance = duration * 0.034 / 2;
  return distance;
}

void loop() {
  distance = getDistance();
  if (distance > 0 && distance < 10 && chocolates > 0) {
    digitalWrite(ledPin, HIGH);
    delay(1000);
    digitalWrite(ledPin, LOW);
    chocolates--;
    EEPROM.write(0, chocolates);
    Serial.print("Dispensed! Remaining: ");
    Serial.println(chocolates);
    delay(3000);
  }
}