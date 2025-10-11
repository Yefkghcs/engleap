import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Eye, EyeOff, ThumbsDown, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CelebrationEffect from "@/components/CelebrationEffect";

interface Word {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
}

type WordStatus = "unmarked" | "known" | "unknown";

const LearnCards = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const words = (location.state?.words as Word[]) || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [wordStatuses, setWordStatuses] = useState<Record<number, WordStatus>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Load word statuses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('vocabulary_word_statuses');
    if (stored) {
      try {
        const statuses: Record<number, WordStatus> = JSON.parse(stored);
        setWordStatuses(statuses);
        
        // Count known and unknown from stored statuses for current words
        let known = 0;
        let unknown = 0;
        words.forEach(word => {
          if (statuses[word.id] === "known") known++;
          if (statuses[word.id] === "unknown") unknown++;
        });
        setKnownCount(known);
        setUnknownCount(unknown);
      } catch (e) {
        console.error('Failed to load word statuses:', e);
      }
    }
  }, [words]);

  useEffect(() => {
    if (words.length === 0) {
      toast({
        title: "没有单词",
        description: "请返回词汇书选择要学习的单词",
        variant: "destructive",
      });
      navigate(`/vocabulary/${bookId}`);
    }
  }, [words, navigate, bookId]);

  // Auto-play when word changes
  useEffect(() => {
    if (currentWord && !hasPlayedAudio) {
      playAudio(currentWord.word);
      setHasPlayedAudio(true);
    }
  }, [currentIndex, hasPlayedAudio]);

  const currentWord = words[currentIndex];

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const highlightWord = (text: string, word: string) => {
    if (!text || !word) return text;
    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <strong key={index} className="font-bold text-primary">{part}</strong> : part
    );
  };

  const updateWordStatus = (wordId: number, status: "known" | "unknown") => {
    // Update local state
    setWordStatuses(prev => {
      const updated = { ...prev, [wordId]: status };
      // Save to localStorage
      localStorage.setItem('vocabulary_word_statuses', JSON.stringify(updated));
      return updated;
    });
  };

  const handleKnown = () => {
    const previousStatus = wordStatuses[currentWord.id];
    
    // Only increment if this word wasn't already marked as known
    if (previousStatus !== "known") {
      if (previousStatus === "unknown") {
        setUnknownCount(prev => prev - 1);
      }
      setKnownCount(prev => prev + 1);
    }
    
    updateWordStatus(currentWord.id, "known");
    
    // Auto advance to next word or complete
    if (currentIndex < words.length - 1) {
      setTimeout(() => goToNextWord(), 300);
    } else {
      setTimeout(() => handleComplete(), 300);
    }
  };

  const handleUnknown = () => {
    const previousStatus = wordStatuses[currentWord.id];
    
    // Only increment if this word wasn't already marked as unknown
    if (previousStatus !== "unknown") {
      if (previousStatus === "known") {
        setKnownCount(prev => prev - 1);
      }
      setUnknownCount(prev => prev + 1);
    }
    
    updateWordStatus(currentWord.id, "unknown");
    
    // Auto advance to next word or complete
    if (currentIndex < words.length - 1) {
      setTimeout(() => goToNextWord(), 300);
    } else {
      setTimeout(() => handleComplete(), 300);
    }
  };

  const goToNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowTranslation(false);
      setHasPlayedAudio(false);
    }
  };

  const goToPreviousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowTranslation(false);
      setHasPlayedAudio(false);
    }
  };

  const handleComplete = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCompletion(true), 2000);
  };

  const handleExit = () => {
    navigate(`/vocabulary/${bookId}`);
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">学习完成！</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">认识：</span>
              <span className="text-green-600 font-bold">{knownCount}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">不认识：</span>
              <span className="text-red-600 font-bold">{unknownCount}</span>
            </div>
            <div className="flex justify-between items-center text-lg border-t pt-4">
              <span className="text-muted-foreground">总计：</span>
              <span className="font-bold">{words.length}</span>
            </div>
          </div>
          <Button onClick={handleExit} className="w-full" size="lg">
            返回词汇书
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {words.length}
            </span>
            <div className="flex gap-2 text-sm">
              <span className="text-green-600">认识: {knownCount}</span>
              <span className="text-red-600">不认识: {unknownCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)] gap-6">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousWord}
          disabled={currentIndex === 0}
          className="h-9 w-9 rounded-full hover:bg-accent/50 transition-all disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Card className="w-full max-w-2xl p-8 shadow-lg">
          {/* Word Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-5xl font-bold">{currentWord.word}</h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => playAudio(currentWord.word)}
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-lg text-muted-foreground">{currentWord.phonetic}</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {currentWord.tags.map((tag, i) => (
                  <span key={i} className="bg-foreground text-background text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
              className="gap-2"
            >
              {showTranslation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showTranslation ? "隐藏释义" : "显示释义"}
            </Button>
          </div>

          {/* Translation */}
          {showTranslation && (
            <div className="mb-8 p-4 bg-muted/50 rounded-lg animate-fade-in">
              <p className="text-sm font-medium">{currentWord.meaning}</p>
            </div>
          )}

          {/* Example */}
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span>例句</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => playAudio(currentWord.example)}
              >
                <Volume2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-base leading-relaxed italic">
              {highlightWord(currentWord.example, currentWord.word)}
            </p>
            {showTranslation && (
              <p className="text-sm text-muted-foreground">{currentWord.exampleCn}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline"
              size="default"
              className={`flex-1 h-10 text-sm gap-2 transition-all ${
                wordStatuses[currentWord.id] === "unknown" 
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-sm" 
                  : "hover:border-red-300 hover:text-red-600"
              }`}
              onClick={handleUnknown}
            >
              <ThumbsDown className="h-4 w-4" />
              不认识
            </Button>
            <Button 
              variant="outline"
              size="default"
              className={`flex-1 h-10 text-sm gap-2 transition-all ${
                wordStatuses[currentWord.id] === "known" 
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 shadow-sm" 
                  : "hover:border-green-300 hover:text-green-600"
              }`}
              onClick={handleKnown}
            >
              <ThumbsUp className="h-4 w-4" />
              认识
            </Button>
          </div>

        </Card>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextWord}
          disabled={currentIndex === words.length - 1}
          className="h-9 w-9 rounded-full hover:bg-accent/50 transition-all disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Celebration Effect */}
      {showCelebration && <CelebrationEffect />}
    </div>
  );
};

export default LearnCards;
