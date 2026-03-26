import re
import csv
from datetime import datetime
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# W5: Initialization
training_sentences = ["schedule", "timings", "fees", "cost", "hostel", "dorm", "exam", "test"]
training_labels = ["Timings", "Timings", "Fees", "Fees", "Hostel", "Hostel", "Exams", "Exams"]

vectorizer = CountVectorizer()
X_train = vectorizer.fit_transform(training_sentences)
classifier = MultinomialNB()
classifier.fit(X_train, training_labels)

faq_database = {
    "Timings": "College timings are 9:00 AM to 5:00 PM.",
    "Fees": "Please contact accounts for fee details.",
    "Hostel": "Hostel applications open in July.",
    "Exams": "End-semester exams are in November."
}

# W7: Global Memory
conversation_state = {"last_intent": None}

# W9: Formatter
def format_for_platform(response, platform):
    if platform == "whatsapp": return f"📱 *Bot:*\n{response}"
    return response

# Week 10: Analytics Logger
def log_analytics(user_query, intent, response):
    with open("chatbot_logs.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), user_query, intent, response])

# Master Pipeline
def master_chatbot(user_input, platform="web"):
    global conversation_state
    original_input = user_input
    
    # W2 & W3: Preprocess & Synonyms
    text = re.sub(r'[^\w\s]', '', user_input.lower())
    synonyms = {"cost": "fees", "tuition": "fees", "dorm": "hostel"}
    clean_query = " ".join([synonyms.get(w, w) for w in text.split()])
    
    # W7: Context Check
    if "yes" in clean_query and conversation_state["last_intent"]:
        response = f"Sending detailed PDF for {conversation_state['last_intent']}..."
        conversation_state["last_intent"] = None
        log_analytics(original_input, "Follow-up", response)
        return format_for_platform(response, platform)
        
    # W5 & W8: Classification & Fallback
    if len(clean_query.strip()) < 2:
        response = "I'm sorry, I didn't catch that. Could you clarify, or email support@institute.edu?"
        intent = "Unknown"
    else:
        try:
            X_test = vectorizer.transform([clean_query])
            intent = classifier.predict(X_test)[0]
            response = faq_database.get(intent)
            conversation_state["last_intent"] = intent
        except:
            response = "Unsure of query. Email support."
            intent = "Unknown"

    # W6: Entity Extraction
    sem_match = re.search(r'sem(?:ester)?\s*(\d)', original_input, re.IGNORECASE)
    course_match = re.search(r'\b(cs|cse|it|mech|civil)\b', original_input, re.IGNORECASE)
    if sem_match or course_match:
        response += f" (Note: Displaying data for {course_match.group(1).upper() if course_match else 'your branch'} Semester {sem_match.group(1) if sem_match else 'X'})."

    # W10: Analytics Call
    log_analytics(original_input, intent, response)
    
    # W9: Formatting Call
    return format_for_platform(response, platform)

if __name__ == "__main__":
    print(master_chatbot("What is the cost of tuition for sem 4 cse?", platform="whatsapp"))
    print(master_chatbot("Yes, please send the document", platform="web"))