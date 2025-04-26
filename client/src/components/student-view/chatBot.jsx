import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setSelectedQuestion(null);
        setShowMore(false);
    };

    const handleQuestionClick = (faq) => {
        setSelectedQuestion(faq);
        setShowMore(true);
    };

    const handleSupportNavigate = () => {
        toggleChat(); // optional: close chatbot
        navigate('/support'); // make sure this route exists
    };

    const faqs = [
        {
            question: 'How do I reset my password?',
            answer: 'To reset your password, go to the login page and click "Forgot Password". Follow the instructions sent to your email.',
        },
        {
            question: 'How do I enroll in a course?',
            answer: 'Go to the Courses page, select a course, and click "Enroll". Follow the payment instructions to complete enrollment.',
        },
        {
            question: 'Where can I download my certificate?',
            answer: 'After completing a course, go to your profile and click the "Download Certificate" button next to the completed course.',
        },
        {
            question: 'How can I contact support?',
            answer: (
                <span>
                    You can reach our support team through the{' '}
                    <button onClick={handleSupportNavigate} className="text-blue-600 underline">
                        support page
                    </button>
                    .
                </span>
            ),
        },
        {
            question: 'How do I change my profile details?',
            answer: 'Go to your profile page, click "Edit", and update your details. Don’t forget to save changes!',
        },
        {
            question: 'How do I connect with other students?',
            answer: 'Visit the Student List page and click "Connect" on any profile. Once accepted, you can start chatting.',
        },

    ];

    return (
        <>


            {!isOpen ?
                <div className="fixed bottom-6 left-6 z-50">
                    <button
                        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
                        onClick={toggleChat}
                    >
                        <MessageSquare size={24} />
                    </button>
                </div>
                : null
            }





            {isOpen && (
                <div className="fixed bottom-20 left-6 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col">

                    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
                                alt="Vimmi"
                                className="w-5 h-5"
                            />
                            <h2 className="font-bold text-sm">Vimmi - LMS Help</h2>
                        </div>
                        <button className='text-black rounded-md' onClick={toggleChat}>
                            <X size={16} />
                        </button>
                    </div>


                    <div className="p-3 overflow-y-auto max-h-96 space-y-2 text-sm">

                        {!selectedQuestion && (
                            <div className="flex flex-col items-center text-center space-y-2">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
                                    alt="Bot"
                                    className="w-16 h-16"
                                />
                                <p className="text-gray-600 text-sm">How can I help you today?</p>

                                <div className="w-full max-h-48 overflow-y-auto space-y-1">
                                    {faqs.map((faq, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuestionClick(faq)}
                                            className="w-full text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                                        >
                                            {faq.question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        {selectedQuestion && (
                            <div className="flex flex-col space-y-2">
                                <div>
                                    <p className="font-semibold">You asked:</p>
                                    <p>{selectedQuestion.question}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Answer:</p>
                                    <p>{selectedQuestion.answer}</p>
                                </div>

                                {showMore && (
                                    <button
                                        className="mt-3 text-blue-600 underline self-start text-sm"
                                        onClick={() => {
                                            setSelectedQuestion(null);
                                            setShowMore(false);
                                        }}
                                    >
                                        Show more questions
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
