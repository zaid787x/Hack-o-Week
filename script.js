// Advanced SITNAGPUR Chatbot with All 10 Topics
class AdvancedSITNAGPURChatbot {
    constructor() {
        // DOM Elements
        this.messagesArea = document.getElementById('messagesArea');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        // Context Tracking (Topic 7)
        this.conversationContext = {
            lastTopic: null,
            userDetails: {},
            followUpCount: 0,
            entities: { dates: [], courses: [], numbers: [] },
            conversationHistory: [],
            userPreferences: {}
        };
        
        // Analytics (Topic 10)
        this.analytics = {
            totalQueries: 0,
            successfulResponses: 0,
            fallbackCount: 0,
            handoverCount: 0,
            popularTopics: {
                admissions: 0,
                courses: 0,
                fees: 0,
                exams: 0,
                placement: 0,
                contact: 0,
                facilities: 0
            },
            userSatisfaction: [],
            averageResponseTime: 0,
            responseTimes: [],
            sentimentScores: []
        };
        
        // Chat History Management
        this.chatHistory = [];
        this.currentChatId = Date.now();
        this.loadChatHistory();
        
        // Entity Patterns for Extraction (Topic 6)
        this.entityPatterns = {
            dates: [
                /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi,
                /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?\b/gi,
                /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/g,
                /\b(tomorrow|today|next week|next month)\b/gi
            ],
            courses: [
                /b\.?\s*tech|btech|b\.tech|bachelor\s+of\s+technology/gi,
                /m\.?\s*tech|mtech|m\.tech|master\s+of\s+technology/gi,
                /mba|master\s+of\s+business\s+administration/gi,
                /phd|doctor\s+of\s+philosophy/gi,
                /computer\s+science|cse|cs/gi,
                /mechanical|me/gi,
                /electronics|ece|ec/gi,
                /civil|ce/gi,
                /data\s+science|ai|artificial\s+intelligence|ml|machine\s+learning/gi,
                /robotics/gi
            ],
            numbers: [
                /\b(\d+(?:,\d+)?(?:\s?lakh|\s?crore)?)\b/g,
                /\b(\d+(?:\.\d+)?%)\b/g,
                /\b(?:rs\.?|rupees?)\s*(\d+(?:,\d+)?)\b/gi
            ]
        };
        
        // Intent Classification Model (Topic 5)
        this.intentPatterns = {
            admissions: ['admission', 'apply', 'join', 'enroll', 'application', 'eligibility', 'admit', 'register'],
            courses: ['course', 'program', 'branch', 'degree', 'specialization', 'curriculum', 'subject'],
            fees: ['fee', 'cost', 'payment', 'money', 'expense', 'tuition', 'scholarship', 'financial', 'aid'],
            exams: ['exam', 'test', 'schedule', 'result', 'hall ticket', 'admit card', 'practical', 'viva'],
            placement: ['placement', 'job', 'recruit', 'company', 'package', 'salary', 'internship', 'career'],
            contact: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'support', 'helpdesk'],
            facilities: ['facility', 'hostel', 'library', 'sports', 'lab', 'campus', 'gym', 'cafeteria']
        };
        
        // Synonym Mapping (Topic 3)
        this.synonyms = {
            'fee': ['fees', 'cost', 'expense', 'tuition', 'charges', 'payment'],
            'admission': ['admissions', 'apply', 'application', 'enroll', 'enrollment', 'register'],
            'course': ['courses', 'program', 'programs', 'subject', 'curriculum', 'branch'],
            'placement': ['placements', 'job', 'jobs', 'recruitment', 'career', 'opportunity'],
            'exam': ['exams', 'test', 'tests', 'examination', 'assessment'],
            'scholarship': ['scholarships', 'financial aid', 'merit aid', 'stipend'],
            'hostel': ['hostels', 'accommodation', 'dorm', 'dormitory', 'residence']
        };
        
        // FIX: knowledgeBase MUST be assigned before initializeTFIDF() which references it
        // Enhanced Knowledge Base
        this.knowledgeBase = this.initializeKnowledgeBase();
        
        // TF-IDF Vocabulary and Document Vectors (Topic 4) — placed AFTER knowledgeBase
        this.tfidfVocabulary = new Map();
        this.faqDocuments = [];
        this.initializeTFIDF();
        
        // Initialize Chart
        this.topicChart = null;
        
        // Start the chatbot
        this.init();
        this.displayWelcomeMessage();
        this.updateAnalyticsDisplay();
    }
    
    initializeKnowledgeBase() {
        return {
            admissions: {
                title: "Admissions 2026",
                keywords: ['admission', 'apply', 'join', 'enroll', 'application', 'eligibility'],
                response: `**🎓 Admissions Open for 2026-27 Academic Year**\n\n` +
                    `**📋 Eligibility Criteria:**\n` +
                    `• B.Tech: 60% in 10+2 with PCM (65% for CSE/AI/DS)\n` +
                    `• M.Tech: 60% in B.Tech + Valid GATE score\n` +
                    `• MBA: 60% in graduation + CAT/MAT/XAT score (min 70 percentile)\n` +
                    `• PhD: Master's degree with 60% + Entrance Test/Interview\n\n` +
                    `**📅 Important Dates:**\n` +
                    `• Application Start: January 15, 2026\n` +
                    `• Last Date: March 31, 2026\n` +
                    `• Entrance Test: April 15, 2026\n` +
                    `• Result Declaration: May 10, 2026\n` +
                    `• Counseling: May 20-30, 2026\n` +
                    `• Commencement of Classes: July 1, 2026\n\n` +
                    `**📄 Required Documents:**\n` +
                    `• 10th & 12th Mark Sheets\n` +
                    `• Graduation Certificates (for PG)\n` +
                    `• Entrance Exam Score Card\n` +
                    `• ID Proof (Aadhar/PAN/Passport)\n` +
                    `• 4 Passport Size Photographs\n` +
                    `• Caste Certificate (if applicable)\n\n` +
                    `**💰 Application Fee:**\n` +
                    `• General/OBC: ₹1200\n` +
                    `• SC/ST/PH: ₹600\n\n` +
                    `**💡 Scholarship Opportunities:**\n` +
                    `• Merit-based: Up to 100% tuition waiver\n` +
                    `• Need-based: Up to 50% concession\n` +
                    `• Sports quota: Up to 75% concession\n\n` +
                    `Would you like to know about specific programs or check your eligibility?`
            },
            courses: {
                title: "Courses Offered",
                keywords: ['course', 'program', 'branch', 'degree', 'specialization'],
                response: `**📚 Academic Programs at SITNAGPUR**\n\n` +
                    `**🎓 Undergraduate Programs (B.Tech - 4 Years):**\n` +
                    `1. Computer Science & Engineering (Intake: 180)\n` +
                    `2. Artificial Intelligence & Machine Learning (Intake: 120)\n` +
                    `3. Data Science (Intake: 120)\n` +
                    `4. Electronics & Communication (Intake: 120)\n` +
                    `5. Mechanical Engineering (Intake: 120)\n` +
                    `6. Civil Engineering (Intake: 90)\n` +
                    `7. Electrical Engineering (Intake: 90)\n` +
                    `8. Robotics & Automation (Intake: 60)\n\n` +
                    `**📖 Postgraduate Programs (M.Tech - 2 Years):**\n` +
                    `• AI & Machine Learning\n` +
                    `• VLSI Design\n` +
                    `• Structural Engineering\n` +
                    `• Thermal Engineering\n` +
                    `• Computer Science & Engineering\n\n` +
                    `**💼 Management Programs:**\n` +
                    `• MBA in Technology Management\n` +
                    `• MBA in Business Analytics\n` +
                    `• Executive MBA (Weekend Program)\n\n` +
                    `**🔬 Doctoral Programs (PhD):**\n` +
                    `• Engineering & Technology\n` +
                    `• Management Studies\n` +
                    `• Applied Sciences\n` +
                    `• Humanities & Social Sciences\n\n` +
                    `**✨ Special Features:**\n` +
                    `• Industry-integrated curriculum\n` +
                    `• Choice-based credit system\n` +
                    `• Minor specializations available\n` +
                    `• Dual degree options (B.Tech + M.Tech in 5 years)\n\n` +
                    `Which program interests you? I can provide detailed curriculum and career prospects!`
            },
            fees: {
                title: "Fee Structure",
                keywords: ['fee', 'cost', 'payment', 'expense', 'tuition'],
                response: `**💰 Fee Structure for Academic Year 2026-27**\n\n` +
                    `**📊 Tuition Fees (Per Year):**\n` +
                    `• B.Tech (CSE/AI/DS): ₹1,50,000\n` +
                    `• B.Tech (Other Branches): ₹1,25,000\n` +
                    `• M.Tech: ₹1,00,000\n` +
                    `• MBA: ₹1,50,000\n` +
                    `• PhD: ₹75,000 (First 2 years)\n\n` +
                    `**🏠 Hostel & Accommodation:**\n` +
                    `• Single Room (AC): ₹85,000/year\n` +
                    `• Double Room (AC): ₹70,000/year\n` +
                    `• Triple Room (Non-AC): ₹60,000/year\n` +
                    `• Mess (Mandatory): ₹36,000/year\n\n` +
                    `**📚 Additional Fees (One-time):**\n` +
                    `• Admission Fee: ₹10,000\n` +
                    `• Caution Deposit (Refundable): ₹5,000\n` +
                    `• Library Fee: ₹5,000/year\n` +
                    `• Laboratory Fee: ₹8,000/year\n` +
                    `• Sports & Activities: ₹2,000/year\n` +
                    `• Alumni Fee: ₹2,000\n\n` +
                    `**🎓 Total Estimated Cost (1st Year):**\n` +
                    `• B.Tech (with Hostel): ₹2,50,000 - ₹3,00,000\n` +
                    `• B.Tech (Day Scholar): ₹1,60,000 - ₹1,85,000\n\n` +
                    `**💰 Scholarships Available:**\n` +
                    `• Merit Scholarship: 100% waiver for top 5% students\n` +
                    `• Merit-cum-Means: 50% waiver for economically weaker sections\n` +
                    `• Girl Child Scholarship: 10% discount on tuition\n` +
                    `• Sports Excellence: Up to 75% waiver\n` +
                    `• SC/ST Scholarship: Full tuition fee reimbursement\n\n` +
                    `**🏦 Education Loans:**\n` +
                    `We have tie-ups with SBI, Bank of Baroda, and Canara Bank for education loans.\n\n` +
                    `Need help calculating your total expenses or exploring scholarship options?`
            },
            exams: {
                title: "Examination Schedule",
                keywords: ['exam', 'test', 'schedule', 'result', 'timetable'],
                response: `**📝 Examination Schedule 2026**\n\n` +
                    `**📅 Even Semester (Jan-May):**\n` +
                    `• Mid-Term Exams: March 10-20, 2026\n` +
                    `• Practical Exams: April 15-30, 2026\n` +
                    `• Final Theory Exams: May 5-25, 2026\n` +
                    `• Result Declaration: June 10, 2026\n\n` +
                    `**📅 Odd Semester (July-Nov):**\n` +
                    `• Mid-Term Exams: September 15-25, 2026\n` +
                    `• Practical Exams: November 5-15, 2026\n` +
                    `• Final Theory Exams: November 20 - December 10, 2026\n` +
                    `• Result Declaration: December 20, 2026\n\n` +
                    `**⚠️ Supplementary Examinations:**\n` +
                    `• Even Semester: July 10-20, 2026\n` +
                    `• Odd Semester: January 10-20, 2027\n` +
                    `• Registration Deadline: 15 days before exams\n\n` +
                    `**📋 Important Guidelines:**\n` +
                    `• Minimum 75% attendance required to appear for exams\n` +
                    `• Hall tickets available 7 days before exams\n` +
                    `• Results declared within 15 days of last exam\n` +
                    `• Revaluation window: 7 days after results\n` +
                    `• Photocopy of answer sheets available on request\n\n` +
                    `**🎯 Grade System:**\n` +
                    `• O (Outstanding): 90%+\n` +
                    `• A+ (Excellent): 80-89%\n` +
                    `• A (Very Good): 70-79%\n` +
                    `• B+ (Good): 60-69%\n` +
                    `• B (Average): 50-59%\n` +
                    `• C (Pass): 40-49%\n` +
                    `• F (Fail): Below 40%\n\n` +
                    `Would you like to check your specific exam timetable or know about exam rules?`
            },
            placement: {
                title: "Placement Statistics",
                keywords: ['placement', 'job', 'recruit', 'package', 'salary'],
                response: `**💼 Placement Highlights 2025-26**\n\n` +
                    `**📊 Overall Statistics:**\n` +
                    `• Placement Rate: 92.5%\n` +
                    `• Average Package: ₹8.5 LPA\n` +
                    `• Highest Package: ₹32 LPA (Microsoft)\n` +
                    `• Median Package: ₹7.2 LPA\n` +
                    `• Top 10% Average: ₹18.5 LPA\n` +
                    `• Total Offers: 487\n` +
                    `• Total Students Placed: 423\n` +
                    `• International Offers: 12\n\n` +
                    `**🏢 Top Recruiters:**\n` +
                    `• Microsoft - 15 offers (₹32 LPA)\n` +
                    `• Google - 10 offers (₹28 LPA)\n` +
                    `• Amazon - 28 offers (₹24 LPA)\n` +
                    `• Goldman Sachs - 18 offers (₹20 LPA)\n` +
                    `• Tata Motors - 35 offers (₹12 LPA)\n` +
                    `• Infosys - 52 offers (₹8 LPA)\n` +
                    `• TCS - 68 offers (₹7.5 LPA)\n` +
                    `• L&T - 42 offers (₹9 LPA)\n` +
                    `• Accenture - 45 offers (₹8 LPA)\n` +
                    `• Deloitte - 25 offers (₹12 LPA)\n\n` +
                    `**🎯 Branch-wise Placement:**\n` +
                    `• CSE/AI/DS: 98% | Avg: ₹12.5 LPA\n` +
                    `• ECE: 94% | Avg: ₹8.5 LPA\n` +
                    `• Mechanical: 91% | Avg: ₹7.8 LPA\n` +
                    `• Civil: 88% | Avg: ₹6.5 LPA\n` +
                    `• MBA: 95% | Avg: ₹9.5 LPA\n\n` +
                    `**📈 Internship Opportunities:**\n` +
                    `• 87% students got internships\n` +
                    `• Average stipend: ₹25,000/month\n` +
                    `• International internships: 28 students\n` +
                    `• PPO received: 45%\n\n` +
                    `**🚀 Upcoming Drives (March 2026):**\n` +
                    `• March 7: Microsoft\n` +
                    `• March 10: Amazon\n` +
                    `• March 15: Google\n` +
                    `• March 20: Intel\n` +
                    `• March 25: NVIDIA\n\n` +
                    `Need help with placement preparation, resume review, or want company-wise details?`
            },
            contact: {
                title: "Contact Information",
                keywords: ['contact', 'phone', 'email', 'address', 'reach'],
                response: `**📞 SITNAGPUR Contact Details**\n\n` +
                    `**🏛️ Main Campus:**\n` +
                    `📍 Address: SIT Nagpur, MIDC Area, Nagpur - 440001, Maharashtra\n` +
                    `📞 Phone: +91 712 280 1234\n` +
                    `📧 Email: info@sitnagpur.edu.in\n\n` +
                    `**📋 Admissions Office:**\n` +
                    `📞 Direct: +91 712 280 5678\n` +
                    `📧 Email: admissions@sitnagpur.edu.in\n` +
                    `🕒 Hours: Mon-Fri, 9:00 AM - 5:00 PM\n` +
                    `🕒 Saturday: 10:00 AM - 2:00 PM\n\n` +
                    `**📚 Academic Office:**\n` +
                    `📞 Phone: +91 712 280 9101\n` +
                    `📧 Email: academics@sitnagpur.edu.in\n\n` +
                    `**💼 Placement Cell:**\n` +
                    `📞 Phone: +91 712 280 1122\n` +
                    `📧 Email: placement@sitnagpur.edu.in\n` +
                    `👨‍💼 TPO: Dr. Rajesh Kumar\n\n` +
                    `**🌍 International Relations:**\n` +
                    `📞 Phone: +91 712 280 3344\n` +
                    `📧 Email: international@sitnagpur.edu.in\n\n` +
                    `**🏥 Emergency Contact:**\n` +
                    `🚑 24/7 Helpline: +91 712 280 9999\n` +
                    `🚨 Security Control Room: +91 712 280 1001\n` +
                    `🏥 Medical Center: +91 712 280 1002\n\n` +
                    `**📱 Social Media:**\n` +
                    `• Instagram: @sitnagpur_official\n` +
                    `• LinkedIn: SIT Nagpur\n` +
                    `• Twitter: @SITNagpur\n` +
                    `• Facebook: /SITNagpur\n` +
                    `• YouTube: SIT Nagpur Official\n\n` +
                    `Would you like directions to campus, schedule a visit, or need specific department contact?`
            },
            facilities: {
                title: "Campus Facilities",
                keywords: ['facility', 'hostel', 'library', 'sports', 'lab', 'campus'],
                response: `**🏛️ SITNAGPUR Campus Facilities**\n\n` +
                    `**📚 Academic Facilities:**\n` +
                    `• Smart Classrooms with IoT-enabled boards\n` +
                    `• 35+ Advanced Laboratories\n` +
                    `• Central Library: 75,000+ books, 500+ journals\n` +
                    `• Digital Learning Center with 200+ computers\n` +
                    `• Research & Innovation Hub\n` +
                    `• Language Lab\n` +
                    `• Virtual Reality Lab\n\n` +
                    `**🏠 Hostel Facilities:**\n` +
                    `• Separate hostels for boys & girls (4 blocks each)\n` +
                    `• Wi-Fi enabled campus (100 Mbps)\n` +
                    `• 24/7 power backup\n` +
                    `• Gymnasium & Fitness Center\n` +
                    `• Common rooms with Smart TV\n` +
                    `• Laundry services\n` +
                    `• Vegetarian & Non-vegetarian mess\n` +
                    `• 24/7 security with CCTV surveillance\n\n` +
                    `**⚽ Sports Complex:**\n` +
                    `• Olympic size swimming pool\n` +
                    `• Basketball & Tennis courts (floodlit)\n` +
                    `• FIFA standard football ground\n` +
                    `• Indoor badminton courts\n` +
                    `• Table tennis & chess rooms\n` +
                    `• Yoga & Meditation Center\n` +
                    `• Cricket ground with nets\n\n` +
                    `**🍽️ Other Amenities:**\n` +
                    `• Medical center with ambulance (24/7)\n` +
                    `• Cafeteria & Food court (6 outlets)\n` +
                    `• Banking & ATM services (SBI, HDFC)\n` +
                    `• Stationery store\n` +
                    `• Transportation services (20 buses)\n` +
                    `• Salon & Grooming services\n` +
                    `• Amphi-theater for cultural events\n\n` +
                    `**🚀 Upcoming Facilities (2027):**\n` +
                    `• Innovation Incubation Center\n` +
                    `• E-Sports Arena\n` +
                    `• Advanced Research Center\n` +
                    `• Green Energy Park\n\n` +
                    `Want to know more about any specific facility or take a virtual tour?`
            }
        };
    }
    
    // Topic 4: TF-IDF Implementation
    initializeTFIDF() {
        // Prepare FAQ documents for TF-IDF
        const faqs = [
            { question: "How to apply for admission?", answer: this.knowledgeBase.admissions.response },
            { question: "What courses are available?", answer: this.knowledgeBase.courses.response },
            { question: "What is the fee structure?", answer: this.knowledgeBase.fees.response },
            { question: "When are exams conducted?", answer: this.knowledgeBase.exams.response },
            { question: "What are placement statistics?", answer: this.knowledgeBase.placement.response },
            { question: "How to contact the institute?", answer: this.knowledgeBase.contact.response },
            { question: "What facilities are available?", answer: this.knowledgeBase.facilities.response }
        ];
        
        // Build vocabulary
        faqs.forEach(faq => {
            const words = this.tokenize(faq.question);
            words.forEach(word => {
                if (!this.tfidfVocabulary.has(word)) {
                    this.tfidfVocabulary.set(word, this.tfidfVocabulary.size);
                }
            });
        });
        
        // Store documents
        this.faqDocuments = faqs;
    }
    
    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }
    
    calculateTFIDF(query) {
        const queryTokens = this.tokenize(query);
        const scores = [];
        
        this.faqDocuments.forEach((doc, idx) => {
            const docTokens = this.tokenize(doc.question);
            let score = 0;
            
            queryTokens.forEach(queryToken => {
                const tf = docTokens.filter(t => t === queryToken).length / docTokens.length;
                const idf = Math.log(this.faqDocuments.length / 
                    (this.faqDocuments.filter(d => this.tokenize(d.question).includes(queryToken)).length + 1));
                score += tf * idf;
            });
            
            scores.push({ idx, score, answer: doc.answer });
        });
        
        return scores.sort((a, b) => b.score - a.score);
    }
    
    // Topic 3: Synonym-Aware Processing
    expandSynonyms(text) {
        let expanded = text;
        for (const [key, synonyms] of Object.entries(this.synonyms)) {
            for (const synonym of synonyms) {
                const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
                if (regex.test(text)) {
                    expanded += ` ${key}`;
                }
            }
        }
        return expanded;
    }
    
    // Topic 5: Intent Classification
    classifyIntent(message) {
        const messageLower = message.toLowerCase();
        const scores = {};
        
        for (const [intent, keywords] of Object.entries(this.intentPatterns)) {
            let score = 0;
            for (const keyword of keywords) {
                if (messageLower.includes(keyword)) {
                    score += 2;
                }
                // Check synonyms
                for (const [_, synonyms] of Object.entries(this.synonyms)) {
                    if (synonyms.includes(keyword) && messageLower.includes(keyword)) {
                        score += 1;
                    }
                }
            }
            scores[intent] = score;
        }
        
        // Get top intent
        const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
        return topIntent[1] > 0 ? topIntent[0] : 'general';
    }
    
    // Topic 6: Entity Extraction
    extractEntities(message) {
        const entities = {
            dates: [],
            courses: [],
            numbers: [],
            locations: []
        };
        
        // Extract dates
        this.entityPatterns.dates.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                entities.dates.push(match[0]);
            }
        });
        
        // Extract courses
        this.entityPatterns.courses.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                entities.courses.push(match[0]);
            }
        });
        
        // Extract numbers
        this.entityPatterns.numbers.forEach(pattern => {
            const matches = message.matchAll(pattern);
            for (const match of matches) {
                entities.numbers.push(match[0]);
            }
        });
        
        return entities;
    }
    
    // Topic 7: Context-Aware Responses
    detectFollowUp(message) {
        const followUpIndicators = [
            'what about', 'tell me more', 'explain', 'elaborate',
            'and', 'also', 'how about', 'what else', 'more details',
            'can you', 'could you', 'please explain', 'clarify',
            'follow up', 'regarding', 'about that', 'on that'
        ];
        
        return followUpIndicators.some(indicator => 
            message.toLowerCase().includes(indicator)
        ) || this.conversationContext.followUpCount > 0;
    }
    
    handleFollowUp(message, lastTopic, entities) {
        this.conversationContext.followUpCount++;
        
        switch(lastTopic) {
            case 'admissions':
                if (entities.dates.length > 0) {
                    return `Regarding admission dates: Applications are open from Jan 15 to Mar 31, 2026. ` +
                        `You mentioned ${entities.dates.join(', ')}. Would you like to know about the specific ` +
                        `deadline for your program or the counseling schedule?`;
                } else if (message.includes('fee') || message.includes('cost')) {
                    return `The application fee is ₹1200 for general category and ₹600 for SC/ST. ` +
                        `For tuition fees, B.Tech programs range from ₹1.25L to ₹1.5L per year. ` +
                        `Would you like to know about scholarship opportunities to reduce the cost?`;
                } else if (message.includes('documents') || message.includes('required')) {
                    return `Required documents include: 10th & 12th mark sheets, graduation certificates (for PG), ` +
                        `entrance exam score card, ID proof, and photographs. Would you like the complete checklist?`;
                }
                break;
                
            case 'fees':
                if (entities.courses.length > 0) {
                    return `For ${entities.courses.join(', ')}, the fee structure varies. ` +
                        `B.Tech CSE/AI/DS is ₹1.5L/year, other B.Tech branches are ₹1.25L/year, ` +
                        `M.Tech is ₹1L/year, and MBA is ₹1.5L/year. Which specific program are you interested in?`;
                } else if (message.includes('scholarship') || message.includes('financial')) {
                    return `We offer various scholarships:\n` +
                        `• Merit-based: Up to 100% tuition waiver for top performers\n` +
                        `• Need-based: Up to 50% concession for economically weaker sections\n` +
                        `• Sports quota: Up to 75% concession for national level players\n` +
                        `• Girl child scholarship: 10% additional discount\n\n` +
                        `Would you like to know the eligibility criteria for any specific scholarship?`;
                }
                break;
                
            case 'placement':
                if (message.includes('company') || message.includes('recruiter')) {
                    return `Top recruiters include:\n` +
                        `• Microsoft - 15 offers (₹32 LPA)\n` +
                        `• Google - 10 offers (₹28 LPA)\n` +
                        `• Amazon - 28 offers (₹24 LPA)\n` +
                        `• Goldman Sachs - 18 offers (₹20 LPA)\n` +
                        `• Tata Motors - 35 offers (₹12 LPA)\n\n` +
                        `Would you like to see placement statistics for a specific company or branch?`;
                } else if (message.includes('package') || message.includes('salary')) {
                    return `Placement packages:\n` +
                        `• Highest Package: ₹32 LPA (Microsoft)\n` +
                        `• Average Package: ₹8.5 LPA\n` +
                        `• Top 10% Average: ₹18.5 LPA\n` +
                        `• Branch-wise: CSE/AI/DS avg ₹12.5 LPA, ECE avg ₹8.5 LPA\n\n` +
                        `Would you like branch-wise detailed statistics?`;
                }
                break;
        }
        
        return `Following up on ${lastTopic}: ${this.knowledgeBase[lastTopic]?.response.substring(0, 150)}...\n\n` +
            `Would you like more specific information or have any particular aspect you'd like to explore further?`;
    }
    
    // Topic 8: Fallback and Handover
    checkForHandover(message) {
        const complexQueries = [
            'complaint', 'problem', 'issue', 'urgent', 'emergency',
            'talk to human', 'speak to agent', 'customer service', 'human agent',
            'not working', 'help me now', 'facing issue', 'technical problem',
            'grievance', 'appeal', 'dispute', 'refund', 'withdrawal'
        ];
        
        if (complexQueries.some(q => message.toLowerCase().includes(q))) {
            this.analytics.handoverCount++;
            this.analytics.fallbackCount++;
            return {
                handover: true,
                message: "🤝 **Human Support Required**\n\n" +
                    "I understand this might require human assistance. Let me connect you with our support team.\n\n" +
                    "**📞 Priority Support:**\n" +
                    "• Helpline: +91 712 280 1234\n" +
                    "• Email: support@sitnagpur.edu.in\n" +
                    "• WhatsApp: +91 98765 43210\n\n" +
                    "**⏱️ Estimated Response Time:**\n" +
                    "• Phone: Immediate (9 AM - 6 PM)\n" +
                    "• Email: Within 2 hours\n" +
                    "• WhatsApp: Within 1 hour\n\n" +
                    "**💡 While you wait:**\n" +
                    "Please share your query details and contact number, and our team will get back to you shortly.\n\n" +
                    "Is there anything else I can help you with while you wait for human assistance?"
            };
        }
        return { handover: false };
    }
    
    // Topic 9: Multichannel Mockup
    getChannelResponse(channel = 'web') {
        const channels = {
            web: "💬 You're chatting via **Web Chat** - Full features available",
            whatsapp: "📱 Connected via **WhatsApp** - Quick responses for mobile users",
            facebook: "📘 Connected via **Facebook Messenger** - Share media and stickers",
            slack: "💼 Connected via **Slack** - Workplace integration active",
            email: "📧 Connected via **Email** - Expect responses within 2 hours"
        };
        return channels[channel] || channels.web;
    }
    
    // Topic 10: Analytics and Tracking
    trackAnalytics(query, response, intent, responseTime) {
        this.analytics.totalQueries++;
        this.analytics.responseTimes.push(responseTime);
        
        // Update average response time
        const totalTime = this.analytics.responseTimes.reduce((a, b) => a + b, 0);
        this.analytics.averageResponseTime = totalTime / this.analytics.responseTimes.length;
        
        // Track successful responses
        if (!response.includes("I'm not sure I understand") && !response.includes("Human Support Required")) {
            this.analytics.successfulResponses++;
        }
        
        // Track topic popularity
        if (this.analytics.popularTopics[intent] !== undefined) {
            this.analytics.popularTopics[intent]++;
        }
        
        // Track sentiment based on query
        const sentiment = this.analyzeSentiment(query);
        this.analytics.sentimentScores.push(sentiment);
        
        // Log analytics (for debugging)
        console.log('📊 Analytics Update:', {
            totalQueries: this.analytics.totalQueries,
            successRate: ((this.analytics.successfulResponses / this.analytics.totalQueries) * 100).toFixed(2) + '%',
            popularTopics: this.analytics.popularTopics,
            fallbacks: this.analytics.fallbackCount,
            avgResponseTime: this.analytics.averageResponseTime.toFixed(2) + 'ms'
        });
        
        // Update UI
        this.updateAnalyticsDisplay();
        this.updateTopicChart();
    }
    
    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'thanks', 'thank', 'helpful', 'best'];
        const negativeWords = ['bad', 'poor', 'worst', 'terrible', 'useless', 'waste', 'issue', 'problem'];
        
        let score = 0;
        const words = text.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score++;
            if (negativeWords.includes(word)) score--;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
    
    updateAnalyticsDisplay() {
        const successRate = this.analytics.totalQueries > 0 
            ? ((this.analytics.successfulResponses / this.analytics.totalQueries) * 100).toFixed(1)
            : 0;
        
        document.getElementById('totalQueries').textContent = this.analytics.totalQueries;
        document.getElementById('successRate').textContent = `${successRate}%`;
        
        // Get top topic
        const topTopic = Object.entries(this.analytics.popularTopics)
            .sort((a, b) => b[1] - a[1])[0];
        document.getElementById('topTopic').textContent = topTopic ? topTopic[0].toUpperCase() : '-';
        
        // Get average sentiment
        const sentiments = this.analytics.sentimentScores;
        if (sentiments.length > 0) {
            const positiveCount = sentiments.filter(s => s === 'positive').length;
            const avgSentiment = (positiveCount / sentiments.length * 100).toFixed(0);
            document.getElementById('avgSentiment').textContent = `${avgSentiment}% Positive`;
        }
    }
    
    updateTopicChart() {
        const ctx = document.getElementById('topicChart');
        if (!ctx) return;
        
        if (this.topicChart) {
            this.topicChart.destroy();
        }
        
        const labels = Object.keys(this.analytics.popularTopics).map(t => t.toUpperCase());
        const data = Object.values(this.analytics.popularTopics);
        
        this.topicChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                        '#8b5cf6', '#ec489a', '#06b6d4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10 } } }
                }
            }
        });
    }
    
    // Main message processing — rule-based with knowledge base
    async processMessage(message) {
        const startTime = Date.now();

        // Preprocessing
        let processedMessage = message.toLowerCase().trim();

        // Synonym expansion
        processedMessage = this.expandSynonyms(processedMessage);

        // Check for handover first
        const handoverCheck = this.checkForHandover(processedMessage);
        if (handoverCheck.handover) {
            this.trackAnalytics(message, handoverCheck.message, 'handover', Date.now() - startTime);
            return handoverCheck.message;
        }

        // Extract entities
        const entities = this.extractEntities(processedMessage);
        this.conversationContext.entities = entities;

        // Intent classification
        const intent = this.classifyIntent(processedMessage);

        // Context-aware handling
        const isFollowUp = this.detectFollowUp(processedMessage);
        let response = '';

        if (isFollowUp && this.conversationContext.lastTopic) {
            response = this.handleFollowUp(processedMessage, this.conversationContext.lastTopic, entities);
        } else {
            if (intent === 'general') {
                const tfidfResults = this.calculateTFIDF(processedMessage);
                if (tfidfResults[0] && tfidfResults[0].score > 0.1) {
                    response = this.formatResponseWithEntities(tfidfResults[0].answer, entities);
                    this.conversationContext.lastTopic = Object.keys(this.knowledgeBase)[tfidfResults[0].idx];
                } else {
                    response = this.getFallbackResponse(entities);
                    this.analytics.fallbackCount++;
                }
            } else {
                if (this.knowledgeBase[intent]) {
                    response = this.formatResponseWithEntities(this.knowledgeBase[intent].response, entities);
                    this.conversationContext.lastTopic = intent;
                } else {
                    response = this.getFallbackResponse(entities);
                    this.analytics.fallbackCount++;
                }
            }
        }

        // Update context
        if (intent !== 'general') {
            this.conversationContext.lastTopic = intent;
        }
        this.conversationContext.followUpCount = isFollowUp
            ? this.conversationContext.followUpCount + 1 : 0;

        this.saveToHistory(message, response);
        this.trackAnalytics(message, response, intent, Date.now() - startTime);

        return response;
    }
    
    formatResponseWithEntities(response, entities) {
        let formatted = response;
        
        if (entities.dates.length > 0) {
            formatted += `\n\n📅 **I noticed you mentioned dates:** ${entities.dates.join(', ')}. Would you like me to provide more details about these dates?`;
        }
        
        if (entities.courses.length > 0) {
            formatted += `\n\n🎓 **Regarding ${entities.courses.join(', ')}:** I can provide more detailed curriculum information if you're interested.`;
        }
        
        if (entities.numbers.length > 0) {
            formatted += `\n\n💰 **You mentioned ${entities.numbers.join(', ')}.** Would you like me to explain the fee structure or scholarship options in detail?`;
        }
        
        return formatted;
    }
    
    getFallbackResponse(entities) {
        let response = "I'm here to help! I can assist you with information about:\n\n" +
            "• 📋 Admissions 2026 - Eligibility, dates, documents\n" +
            "• 🎓 Courses & Programs - B.Tech, M.Tech, MBA, PhD\n" +
            "• 💰 Fee Structure & Scholarships\n" +
            "• 📝 Examination Schedule & Results\n" +
            "• 💼 Placements & Internships\n" +
            "• 🏛️ Campus Facilities & Hostels\n" +
            "• 📞 Contact Information\n\n";
        
        if (entities.dates.length > 0 || entities.courses.length > 0) {
            response += "Could you please rephrase your question? For example:\n" +
                "• 'What are the admission requirements for B.Tech?'\n" +
                "• 'When are the exams scheduled?'\n" +
                "• 'What is the fee structure for CSE?'\n" +
                "• 'Tell me about placement statistics'\n\n" +
                "Or you can select one of the quick action buttons below! 😊";
        } else {
            response += "Could you please specify what you'd like to know? Try using keywords like 'admission', 'courses', 'fees', 'exams', 'placement', or 'contact'.\n\n" +
                "You can also click on the quick action buttons below for instant information! 🚀";
        }
        
        return response;
    }
    
    saveToHistory(query, response) {
        this.chatHistory.unshift({
            id: Date.now(),
            query: query.substring(0, 50),
            timestamp: new Date().toISOString(),
            preview: response.substring(0, 80)
        });
        
        // Keep only last 50 chats
        if (this.chatHistory.length > 50) {
            this.chatHistory.pop();
        }
        
        // FIX: localStorage can throw SecurityError in private/incognito mode
        try {
            localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        } catch (e) {
            console.warn('Chat history could not be saved to localStorage:', e);
        }
        this.updateChatList();
    }
    
    loadChatHistory() {
        // FIX: Wrap in try/catch to handle private browsing / storage access denied
        try {
            const saved = localStorage.getItem('chatHistory');
            if (saved) {
                this.chatHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Chat history could not be loaded from localStorage:', e);
            this.chatHistory = [];
        }
        this.updateChatList();
    }
    
    updateChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        chatList.innerHTML = '';
        
        this.chatHistory.slice(0, 5).forEach((chat, index) => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-list-item ${index === 0 ? 'active' : ''}`;
            chatItem.innerHTML = `
                <div class="chat-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="chat-details">
                    <h4>${chat.query}</h4>
                    <p>${chat.preview}</p>
                    <span class="chat-time">${this.formatTime(chat.timestamp)}</span>
                </div>
                ${index === 0 ? '<span class="unread-badge">New</span>' : ''}
            `;
            chatItem.addEventListener('click', () => this.loadChat(chat.id));
            chatList.appendChild(chatItem);
        });
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString();
    }
    
    loadChat(chatId) {
        // Implement chat loading
        console.log('Loading chat:', chatId);
    }
    
    // UI Methods
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        document.getElementById('newChatBtn')?.addEventListener('click', () => this.newChat());
        document.getElementById('searchChats')?.addEventListener('input', (e) => this.searchChats(e.target.value));
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.currentTarget.dataset.query;
                this.handleQuickAction(query);
            });
        });
        
        // Quick links
        document.querySelectorAll('[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickLink(e.currentTarget.dataset.link);
            });
        });
    }
    
    displayWelcomeMessage() {
        const welcomeMessage = "👋 **Welcome to SITNAGPUR Advanced AI Assistant!**\n\n" +
            "I'm powered by advanced AI with features including:\n" +
            "✅ **Context-Aware Conversations** - I remember our discussion\n" +
            "✅ **Entity Recognition** - I understand dates, courses, and numbers\n" +
            "✅ **Intelligent Search** - TF-IDF powered information retrieval\n" +
            "✅ **Synonym Understanding** - I understand different ways to ask\n" +
            "✅ **Sentiment Analysis** - I adapt to your needs\n" +
            "✅ **Analytics Dashboard** - Live statistics tracking\n\n" +
            "**How can I assist you today?** Try asking about:\n" +
            "• Admissions for B.Tech CSE\n" +
            "• Fee structure with scholarship details\n" +
            "• Placement statistics for 2026\n" +
            "• Exam schedule for next semester\n\n" +
            "Or click any quick action button below! 🚀";
        
        this.addMessage(welcomeMessage, 'bot');
    }
    
    async sendMessage() {
        const message = this.userInput.value.trim();
        if (message === '') return;

        this.addMessage(message, 'user');
        this.userInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.processMessage(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (err) {
            console.error('sendMessage error:', err);
            this.hideTypingIndicator();
            this.addMessage('⚠️ Something went wrong. Please try again.', 'bot');
        }
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        messageDiv.appendChild(avatarDiv);
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content-wrapper';
        
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = sender === 'bot' ? 'SITNAGPUR AI Assistant' : 'You';
        contentWrapper.appendChild(senderDiv);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        // Format message with markdown
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
        formattedText = formattedText.replace(/•/g, '•');
        bubbleDiv.innerHTML = formattedText;
        contentWrapper.appendChild(bubbleDiv);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        contentWrapper.appendChild(timeSpan);
        
        messageDiv.appendChild(contentWrapper);
        this.messagesArea.appendChild(messageDiv);
        
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }
    
    handleQuickAction(query) {
        let message = '';
        switch(query) {
            case 'admissions': message = 'Tell me about admissions for 2026'; break;
            case 'courses': message = 'What courses are offered?'; break;
            case 'fees': message = 'What is the fee structure with scholarships?'; break;
            case 'exams': message = 'When are the exams scheduled?'; break;
            case 'placement': message = 'Show me placement statistics'; break;
            case 'contact': message = 'How can I contact the institute?'; break;
        }
        this.userInput.value = message;
        this.sendMessage();
    }
    
    handleQuickLink(link) {
        let message = '';
        switch(link) {
            case 'prospectus': message = 'Can I get the prospectus for 2026?'; break;
            case 'calendar': message = 'Show me the academic calendar'; break;
            case 'achievements': message = 'Tell me about institute achievements'; break;
        }
        this.userInput.value = message;
        this.sendMessage();
    }
    
    newChat() {
        this.messagesArea.innerHTML = '';
        this.conversationContext = {
            lastTopic: null,
            userDetails: {},
            followUpCount: 0,
            entities: { dates: [], courses: [], numbers: [] },
            conversationHistory: [],
            userPreferences: {}
        };
        this.displayWelcomeMessage();
        this.currentChatId = Date.now();
    }
    
    searchChats(query) {
        if (!query.trim()) {
            this.updateChatList();
            return;
        }
        
        const filtered = this.chatHistory.filter(chat => 
            chat.query.toLowerCase().includes(query.toLowerCase())
        );
        
        const chatList = document.getElementById('chatList');
        if (chatList) {
            chatList.innerHTML = '';
            filtered.forEach(chat => {
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-list-item';
                chatItem.innerHTML = `
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-details">
                        <h4>${chat.query}</h4>
                        <p>${chat.preview}</p>
                        <span class="chat-time">${this.formatTime(chat.timestamp)}</span>
                    </div>
                `;
                chatList.appendChild(chatItem);
            });
        }
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedSITNAGPURChatbot();
});