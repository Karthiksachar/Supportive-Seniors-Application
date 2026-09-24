
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface VoiceNavigationProps {
  onCommand: (command: string) => void;
}

const COMMANDS = [
  "home", "health", "emergency", "social", "help",
  "medication", "contacts", "call emergency"
];

const VoiceNavigation = ({ onCommand }: VoiceNavigationProps) => {
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [muted, setMuted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for SpeechRecognition support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      setSpeechEnabled(true);

      // Set up event handlers
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        // Check for commands
        const lowerText = transcriptText.toLowerCase().trim();
        COMMANDS.forEach(cmd => {
          if (lowerText.includes(cmd)) {
            onCommand(cmd);
            speak(`Navigating to ${cmd}`);
          }
        });
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        if (isListening) {
          setIsListening(false);
          toast({
            title: "Voice recognition stopped",
            description: `Error: ${event.error}. Tap the microphone to try again.`,
            variant: "destructive"
          });
        }
      };
    }

    // Check for speech synthesis support
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!speechEnabled) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      speak("Voice navigation paused");
    } else {
      try {
        recognitionRef.current.start();
        speak("Voice navigation active. What would you like to do?");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          title: "Couldn't start voice recognition",
          description: "Please try again or refresh the page.",
          variant: "destructive"
        });
      }
    }
    setIsListening(!isListening);
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (!muted) {
      if (synthRef.current) synthRef.current.cancel();
      toast({ title: "Voice feedback muted" });
    } else {
      speak("Voice feedback enabled");
    }
  };

  const speak = (text: string) => {
    if (muted || !synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower speech rate
    utterance.pitch = 1;
    utterance.volume = 1;

    synthRef.current.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card shadow-md border border-border">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Voice Assistant</h3>
          <div className="flex space-x-2">
            <Button
              variant={muted ? "destructive" : "outline"}
              size="icon"
              className="large-target"
              onClick={toggleMute}
              aria-label={muted ? "Enable voice feedback" : "Mute voice feedback"}
            >
              {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </Button>
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              className={`large-target ${isListening ? 'animate-pulse-gentle' : ''}`}
              onClick={toggleListening}
              aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
            >
              {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </Button>
          </div>
        </div>
        
        {isListening && (
          <div className="mt-4">
            <p className="text-lg font-medium">Listening...</p>
            {transcript && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="italic">"{transcript}"</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Available commands:</p>
          <div className="voice-commands flex flex-wrap gap-2 overflow-x-auto pb-2">
            {COMMANDS.map((cmd) => (
              <span key={cmd} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                {cmd}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VoiceNavigation;
