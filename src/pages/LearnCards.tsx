import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Eye, EyeOff, ThumbsDown, ThumbsUp, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Word {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
  collocations: string;
  collocationsCn: string;
}

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

  const handleKnown = () => {
    setKnownCount(prev => prev + 1);
    nextWord();
  };

  const handleUnknown = () => {
    setUnknownCount(prev => prev + 1);
    nextWord();
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowTranslation(false);
    } else {
      setShowCompletion(true);
    }
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
      <div className="max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full p-8 shadow-lg">
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
            
            <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-4">
              <span>{currentWord.phonetic}</span>
              {currentWord.tags.map((tag, i) => (
                <span key={i} className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
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
            <div className="mb-8 p-6 bg-muted/50 rounded-lg animate-fade-in border-l-4 border-primary">
              <p className="text-lg font-medium">{currentWord.meaning}</p>
            </div>
          )}

          {/* Examples and Collocations */}
          <div className="mb-8 space-y-6">
            {/* Example */}
            <div className="space-y-2">
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
              <p className="text-base leading-relaxed">
                {highlightWord(currentWord.example, currentWord.word)}
              </p>
              {showTranslation && (
                <p className="text-sm text-muted-foreground">{currentWord.exampleCn}</p>
              )}
            </div>

            {/* Collocations */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span>常见搭配</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => playAudio(currentWord.collocations)}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-base leading-relaxed">
                {highlightWord(currentWord.collocations, currentWord.word)}
              </p>
              {showTranslation && (
                <p className="text-sm text-muted-foreground">{currentWord.collocationsCn}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              variant="destructive" 
              size="lg" 
              className="flex-1 h-14 text-base gap-2"
              onClick={handleUnknown}
            >
              <ThumbsDown className="h-5 w-5" />
              不认识
            </Button>
            <Button 
              size="lg" 
              className="flex-1 h-14 text-base gap-2"
              onClick={handleKnown}
            >
              <ThumbsUp className="h-5 w-5" />
              认识
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearnCards;
