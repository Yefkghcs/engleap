import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addMistake } from "@/utils/mistakesStorage";
import { addCheckIn } from "@/utils/checkInStorage";
import CelebrationEffect from "@/components/CelebrationEffect";

interface Word {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  meaning: string;
  example: string;
  exampleCn: string;
  status: "unmarked" | "known" | "unknown";
}

const Learn = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const location = useLocation();
  const words = (location.state?.words as Word[]) || [];
  
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState<Word[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalWords = words.length;
  const currentWord = words[currentIndex];

  // Play audio function
  const playAudio = (text: string) => {
    if (playSound) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-play when word changes
  useEffect(() => {
    if (currentWord && !showResult && playSound && !hasPlayedAudio) {
      playAudio(currentWord.word);
      setHasPlayedAudio(true);
    }
  }, [currentIndex, showResult, playSound, hasPlayedAudio]);

  // Redirect if no words
  useEffect(() => {
    if (words.length === 0) {
      if (location.pathname.includes('mistakes')) {
        navigate('/mistakes');
      } else if (location.pathname.includes('learned')) {
        navigate('/vocabulary/learned');
      } else if (location.pathname.includes('scene/dictation')) {
        navigate('/vocabulary');
      } else {
        navigate(`/vocabulary/${bookId}`);
      }
    }
  }, [words, bookId, navigate, location.pathname]);

  const handleSubmit = () => {
    if (!showResult) {
      // Mark check-in on first answer submission
      if (currentIndex === 0) {
        addCheckIn();
      }
      
      const correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase();
      setIsCorrect(correct);
      setShowResult(true);
      
      if (correct) {
        setCorrectCount(prev => prev + 1);
      } else {
        // Add to mistakes and track incorrect words
        addMistake(currentWord);
        setIncorrectWords(prev => [...prev, currentWord]);
      }
    } else {
      // Move to next word
      if (currentIndex + 1 >= totalWords) {
        setShowCelebration(true);
        setTimeout(() => setShowCompletion(true), 2000);
      } else {
        setCurrentIndex(prev => prev + 1);
        setUserInput("");
        setShowResult(false);
        setIsCorrect(null);
        setHasPlayedAudio(false);
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 >= totalWords) {
      setShowCelebration(true);
      setTimeout(() => setShowCompletion(true), 2000);
    } else {
      setCurrentIndex(prev => prev + 1);
      setUserInput("");
      setShowResult(false);
      setIsCorrect(null);
      setHasPlayedAudio(false);
    }
  };

  const handleInputFocus = () => {
    if (!showResult && !hasPlayedAudio) {
      playAudio(currentWord.word);
      setHasPlayedAudio(true);
    }
  };

  const handlePlayClick = () => {
    playAudio(currentWord.word);
  };

  const handleViewMistakes = () => {
    navigate("/mistakes");
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setUserInput("");
      setShowResult(false);
      setIsCorrect(null);
      setHasPlayedAudio(false);
    }
  };

  const handleExitClick = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    // Check if coming from mistakes or learned page
    if (location.pathname.includes('mistakes')) {
      navigate('/mistakes');
    } else if (location.pathname.includes('learned')) {
      navigate('/vocabulary/learned');
    } else if (location.pathname.includes('scene/dictation')) {
      const sceneId = location.pathname.split('/').pop();
      navigate(`/vocabulary/scene/${sceneId}`);
    } else {
      navigate(`/vocabulary/${bookId}`);
    }
  };

  if (!currentWord) {
    return null;
  }

  // Completion Screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-2">
            {location.pathname.includes('mistakes') 
              ? '错题本听写' 
              : location.pathname.includes('learned')
              ? '学过的单词听写'
              : location.pathname.includes('scene/dictation')
              ? '场景单词听写'
              : (bookId === "ielts" ? "雅思" : bookId)}
          </h1>
          <p className="text-sm text-muted-foreground">全部单词</p>
        </div>
      </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <h2 className="text-3xl font-bold">完成全部单词听写</h2>
            <p className="text-xl">本次正确率：{totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0}%</p>
            <p className="text-muted-foreground">正确 {correctCount} / {totalWords}</p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleViewMistakes}
                className="bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                查看错题本
              </Button>
              <Button 
                onClick={handleConfirmExit}
                variant="outline"
                className="px-8"
              >
                退出
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Main Learning Screen
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <div className="p-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">
              {location.pathname.includes('mistakes') 
                ? '错题本听写' 
                : location.pathname.includes('learned')
                ? '学过的单词听写'
                : location.pathname.includes('scene/dictation')
                ? '场景单词听写'
                : (bookId === "ielts" ? "雅思" : bookId)}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">全部单词</p>
            <div className="flex items-center gap-4">
              <Progress value={(currentIndex / totalWords) * 100} className="flex-1 h-2" />
              <span className="text-sm">{currentIndex}/{totalWords}</span>
            </div>
          </div>
          {showResult && (
            <Button 
              onClick={handleViewMistakes}
              variant="outline"
              className="ml-4"
            >
              错题本
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            {showResult && (
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2">{currentWord.word}</h3>
              </div>
            )}
            {showTranslation && (
              <div className="space-y-2">
                <h2 className="text-4xl font-bold">{currentWord.meaning}</h2>
                <div className="flex items-center justify-center gap-2">
                  {currentWord.tags.map((tag, i) => (
                    <span key={i} className="inline-block bg-black dark:bg-black text-white px-3 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button 
              onClick={handlePlayClick}
              className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <Play className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="输入单词（iPad可使用随手写功能）"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={`text-center text-3xl py-4 placeholder:text-muted-foreground/40 placeholder:text-base bg-transparent border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                showResult 
                  ? isCorrect 
                    ? "text-green-600 dark:text-green-400 border-green-500 dark:border-green-500" 
                    : "text-red-600 dark:text-red-400 border-red-500 dark:border-red-500"
                  : "border-border focus-visible:border-primary"
              }`}
              disabled={showResult}
            />
            {showResult && (
              <div className={`text-center text-sm font-medium ${
                isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}>
                {isCorrect ? "✓ 回答正确！" : `✗ 回答错误，正确答案是：${currentWord.word}`}
              </div>
            )}
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit}
                disabled={!showResult && !userInput.trim()}
                className="bg-foreground text-background hover:bg-foreground/90 py-6 px-16 disabled:opacity-50"
              >
                {showResult ? "下一题" : "确认"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background z-50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  设置
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">学习设置</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound" className="text-sm">单词声音</Label>
                      <Switch 
                        id="sound" 
                        checked={playSound}
                        onCheckedChange={setPlaySound}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="translation" className="text-sm">单词翻译</Label>
                      <Switch 
                        id="translation" 
                        checked={showTranslation}
                        onCheckedChange={setShowTranslation}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="ghost" 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              上一题
            </Button>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleExitClick}
          >
            退出
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认退出？</AlertDialogTitle>
            <AlertDialogDescription>
              退出后当前进度将不会保存，确定要退出吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>退出</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Celebration Effect */}
      {showCelebration && <CelebrationEffect />}
    </div>
  );
};

export default Learn;
