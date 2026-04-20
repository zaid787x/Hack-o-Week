#define PIR1 2
#define PIR2 3
int slots[2] = {0, 0};
int prevState1 = LOW;
int prevState2 = LOW;
void setup() {
  pinMode(PIR1, INPUT);
  pinMode(PIR2, INPUT);
  Serial.begin(9600);
}
void loop() {
  int state1 = digitalRead(PIR1);
  int state2 = digitalRead(PIR2);
  if (state1
      == HIGH && prevState1 == LOW) {
    slots[0] = !slots[0];
    Serial.print("Slot 1: ");
    Serial.println(slots[0] ? "Occupied" : "Empty");
    delay(1000);
  }
  if (state2 == HIGH && prevState2 == LOW) {
    slots[1] = !slots[1];
    Serial.print("Slot 2: ");
    Serial.println(slots[1] ? "Occupied" : "Empty");
    delay(1000);
  }
  prevState1 = state1;
  prevState2 = state2;
  Serial.print("Slots: [");
  Serial.print(slots[0]);
  Serial.print(", ");
  Serial.print(slots[1]);
  Serial.println("]");
  delay(300);
}