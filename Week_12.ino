#define sensorPin 9

#define motorEnable 5
#define motorIn1 6
#define motorIn2 7

#define buzzer 8

long duration;
float distance;

void setup() {
  pinMode(sensorPin, OUTPUT);

  pinMode(motorEnable, OUTPUT);
  pinMode(motorIn1, OUTPUT);
  pinMode(motorIn2, OUTPUT);

  pinMode(buzzer, OUTPUT);

  Serial.begin(9600);
  digitalWrite(motorIn1, HIGH);
  digitalWrite(motorIn2, LOW);
  analogWrite(motorEnable, 200);
}

void loop() {
  pinMode(sensorPin, OUTPUT);
  digitalWrite(sensorPin, LOW);
  delayMicroseconds(2);
  digitalWrite(sensorPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(sensorPin, LOW);

  pinMode(sensorPin, INPUT);
  duration = pulseIn(sensorPin, HIGH);

  distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.println(distance);

  if (distance > 0 && distance <= 152) {
    analogWrite(motorEnable, 0);
    digitalWrite(buzzer, HIGH);
  } else {
    analogWrite(motorEnable, 200);
    digitalWrite(buzzer, LOW);
  }

  delay(200);
}