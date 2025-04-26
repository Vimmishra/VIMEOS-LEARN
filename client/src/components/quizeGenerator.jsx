

import axios from "axios";
import { useState } from "react";

export default function QuizGenerator() {
    const [topic, setTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [quiz, setQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);

    const optionLetters = ["A", "B", "C", "D"];

    const handleGenerateQuiz = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/quiz/generate`, {
                topic,
                numQuestions,
            });

            console.log("Quiz data from server:", res.data.quiz);

            setQuiz(res.data.quiz);
            setCurrentQuestionIndex(0);
            setSelectedOptions({});
            setScore(null);
        } catch (err) {
            console.error(err);
            alert("Failed to generate quiz");
        }
        setLoading(false);
    };

    const handleOptionSelect = (letter) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [currentQuestionIndex]: letter,
        }));
    };

    const handleNext = () => {
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const handleSubmit = () => {
        let correct = 0;

        quiz.forEach((q, i) => {
            const selected = selectedOptions[i];
            const answer = q.correctAnswer;

            console.log(`Q${i + 1}: selected=${selected}, correct=${answer}`);
            if (selected === answer) {
                correct++;
            }
        });

        setScore(correct);
    };

    const currentQuestion = quiz[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.length - 1;
    const selectedOption = selectedOptions[currentQuestionIndex];

    return (
        <div className="p-6 mt-20 mb-16 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800"> Create Your Custom Quiz With{" "}
                <span className="relative text-blue-500 font-bold shine-text">AI</span></h2>
            <p className="text-center text-gray-600 mb-6">Generate your own quiz by typing the topic you want to take a quiz on!</p>


            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter topic (e.g., React)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6">
                <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="20"
                />
                <span className="block text-sm text-gray-500 mt-2">Enter the number of questions (1-20)</span>
            </div>

            <div className="text-center mb-6">
                <button
                    onClick={handleGenerateQuiz}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>
            </div>

            {quiz.length > 0 && score === null && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3 text-center">
                        Question {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-lg text-center mb-4">{currentQuestion.question}</p>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, i) => {
                            const letter = optionLetters[i];
                            return (
                                <div key={letter} className="flex items-center justify-start space-x-2">
                                    <input
                                        type="radio"
                                        name={`q${currentQuestionIndex}`}
                                        value={letter}
                                        checked={selectedOption === letter}
                                        onChange={() => handleOptionSelect(letter)}
                                        className="cursor-pointer"
                                    />
                                    <label htmlFor={`option-${letter}`} className="text-lg">
                                        {letter}. {opt}
                                    </label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 text-center">
                        {isLastQuestion ? (
                            <button
                                onClick={handleSubmit}
                                className={`py-2 px-6 rounded-lg text-white ${selectedOption ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                                disabled={!selectedOption}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className={`py-2 px-6 rounded-lg text-white ${selectedOption ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                                disabled={!selectedOption}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}


            {score !== null && (
                <div className="mt-6 p-6 bg-green-100 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-3">Your Result</h3>
                    <p className="text-lg">
                        You scored <strong>{score}</strong> out of <strong>{quiz.length}</strong> correct!
                    </p>
                </div>
            )}
        </div>
    );
}
