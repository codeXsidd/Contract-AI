import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  onTranscriptReceived?: (transcript: string) => void;
  textToRead?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscriptReceived, textToRead }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supportSpeech, setSupportSpeech] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupportSpeech(false);
    }
  }, []);

  const toggleListening = () => {
    if (!supportSpeech) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for legal command...');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (onTranscriptReceived) {
          onTranscriptReceived(text);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Voice command failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSpeak = (contentToSpeak?: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = contentToSpeak || textToRead || 'Welcome to Contract AI Voice Legal Assistant. You can ask me about payment clauses, risk levels, or compliance obligations.';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              AI Voice Legal Assistant
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                PRO SPEECH
              </span>
            </h3>
            <p className="text-xs text-slate-400">Ask questions or listen to clauses hands-free</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSpeak()}
            className={`p-3 rounded-xl transition-all flex items-center justify-center ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Read Response Aloud"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all flex items-center justify-center shadow-lg ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/40'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
            title="Speak to Assistant"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {transcript && (
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-sm text-indigo-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="truncate">{transcript}</span>
        </div>
      )}

      {!supportSpeech && (
        <div className="mt-2 text-xs text-amber-400/90 flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Speech Recognition is limited on this browser version. Audio playback remains enabled.</span>
        </div>
      )}
    </div>
  );
};
