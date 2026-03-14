import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/male-ai.mp4";
import femaleVideo from "../assets/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerURL } from "../App";
import { BsArrowRight } from "react-icons/bs";

const Step2Interview = ({ interviewData, onFinish }) => {
  if (!interviewData) return null;

  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  /* ---------------- VOICE SETUP ---------------- */

  useEffect(() => {
    const loadVoices = () => {
      const Voices = window.speechSynthesis.getVoices();
      if (!Voices.length) return;

      const femaleVoice = Voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = Voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(Voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* ---------------- SPEAK FUNCTION ---------------- */

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) startMic();

        setSubtitle("");
        resolve();
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  /* ---------------- INTRO + QUESTION ---------------- */

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally and take your time. Let's begin."
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (isIntroPhase) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  /* ---------------- SPEECH RECOGNITION ---------------- */

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const stopMic = () => recognitionRef.current?.stop();

  const toggleMic = () => {
    if (isMicOn) stopMic();
    else startMic();

    setIsMicOn(!isMicOn);
  };

  /* ---------------- SUBMIT ANSWER ---------------- */

  const submitAnswer = async () => {
    if (isSubmitting) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        ServerURL + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
    } catch (error) {
      console.log(error);
    }

    setIsSubmitting(false);
  };

  /* ---------------- NEXT QUESTION ---------------- */

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex((prev) => prev + 1);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);

    try {
      const result = await axios.post(
        ServerURL + "/api/interview/finish",
        { interviewId },
        { withCredentials: true }
      );

      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- AUTO SUBMIT ---------------- */

  useEffect(() => {
    if (isIntroPhase) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current?.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-6">

      <div className="w-full max-w-7xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border flex flex-col lg:flex-row overflow-hidden">

        {/* VIDEO SECTION */}

        <div className="lg:w-[35%] flex flex-col items-center p-6 space-y-6 border-r">

          <video
            src={videoSource}
            ref={videoRef}
            muted
            playsInline
            className="rounded-xl shadow-xl"
          />

          {subtitle && (
            <div className="bg-gray-50 border rounded-xl p-4">
              <p className="text-gray-700 text-center">{subtitle}</p>
            </div>
          )}

          <Timer
            timeLeft={timeLeft}
            totalTime={currentQuestion?.timeLimit || 60}
          />

        </div>

        {/* QUESTION SECTION */}

        {!isIntroPhase && (
          <div className="flex-1 flex flex-col p-8">

            <h2 className="text-2xl font-bold text-emerald-600 mb-6">
              AI Smart Interview
            </h2>

            <div className="bg-gray-50 p-6 rounded-2xl border mb-6">
              <p className="text-sm text-gray-400">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <p className="text-lg font-semibold text-gray-800 mt-2">
                {currentQuestion?.question}
              </p>
            </div>

            <textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 bg-gray-100 p-5 rounded-2xl resize-none outline-none border"
            />

            {!feedback ? (
              <div className="flex gap-4 mt-4">

                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                >
                  {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                </motion.button>

                <button
                  onClick={submitAnswer}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl"
                >
                  {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>

              </div>
            ) : (

              <div className="bg-emerald-50 border p-5 rounded-xl mt-4">

                <p className="text-emerald-700 mb-4">{feedback}</p>

                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Next Question <BsArrowRight />
                </button>

              </div>

            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Step2Interview;

