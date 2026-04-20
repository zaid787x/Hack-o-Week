void setup()
{ 
  pinMode(6, OUTPUT);
  pinMode(5, OUTPUT);
}

void loop()
{
  long duration,cm;

  pinMode(7, OUTPUT);
  
  digitalWrite(7, HIGH);
  digitalWrite(7, LOW);

  pinMode(7, INPUT);
  duration = pulseIn(7, HIGH);
  cm= duration/29/2;
  if(cm<200)
  {
    digitalWrite(6,HIGH);
    digitalWrite(5,LOW);
  }
  if(cm>200)
  {
    digitalWrite(5,HIGH);
    digitalWrite(6,LOW);
  }
  
}