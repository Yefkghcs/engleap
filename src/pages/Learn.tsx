import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Learn = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const totalWords = 10;

  const words = [
    {
      chinese: "大量的; 丰富的, 充裕的",
      tag: "adj.",
      english: "abundant",
      phonetic: "n."
    },
    {
      chinese: "小溪, 溪流; 忍受, 容忍",
      tag: "adj.",
      english: "brook",
      phonetic: "n."
    }
  ];

  const currentWord = words[currentIndex % words.length];

  const handleSubmit = () => {
    if (!showResult) {
      const correct = userInput.toLowerCase().trim() === currentWord.english.toLowerCase();
      setIsCorrect(correct);
      setShowResult(true);
      if (correct) {
        setCorrectCount(prev => prev + 1);
      }
    } else {
      // Move to next word
      if (currentIndex + 1 >= totalWords) {
        setShowCompletion(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setUserInput("");
        setShowResult(false);
        setIsCorrect(null);
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 >= totalWords) {
      setShowCompletion(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setUserInput("");
      setShowResult(false);
      setIsCorrect(null);
    }
  };

  const handleViewMistakes = () => {
    navigate("/mistakes");
  };

  const handleExit = () => {
    navigate(-1);
  };

  // Completion Screen
  if (showCompletion) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-2">{bookId === "ielts" ? "雅思" : bookId}</h1>
            <p className="text-sm text-muted-foreground">全部单词</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <h2 className="text-3xl font-bold">完成全部单词听写</h2>
            <p className="text-xl">本次正确率：{Math.round((correctCount / totalWords) * 100)}%</p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleViewMistakes}
                className="bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                查看错题本
              </Button>
              <Button 
                onClick={handleExit}
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

  // Settings Panel
  if (showSettings) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-2">{bookId === "ielts" ? "雅思" : bookId}</h1>
            <p className="text-sm text-muted-foreground mb-4">全部单词</p>
            <div className="flex items-center gap-4">
              <Progress value={(currentIndex / totalWords) * 100} className="flex-1 h-2" />
              <span className="text-sm">{currentIndex}/{totalWords}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold">{showTranslation ? currentWord.chinese : "吊念"}</h2>
                <span className="inline-block bg-foreground text-background px-3 py-1 rounded text-sm">
                  {currentWord.tag}
                </span>
              </div>
              <button className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Play className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="可以使用拼写写单字，iPad带翻打开随手写，并切换成纯英语输"
                className="text-center text-lg py-6"
              />
              <Button 
                onClick={handleSubmit}
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-6"
              >
                确认
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 mb-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="translation" className="text-base">单词声音</Label>
                <Switch 
                  id="translation" 
                  checked={playSound}
                  onCheckedChange={setPlaySound}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="text-base">单词翻译</Label>
                <Switch 
                  id="sound" 
                  checked={showTranslation}
                  onCheckedChange={setShowTranslation}
                />
              </div>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowSettings(false)}
                variant="secondary"
                className="flex-1"
              >
                设置
              </Button>
              <Button 
                onClick={handleExit}
                variant="outline"
                className="flex-1"
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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">{bookId === "ielts" ? "雅思" : bookId}</h1>
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
                <h3 className="text-3xl font-bold mb-2">{currentWord.english}</h3>
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-4xl font-bold">{currentWord.chinese}</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block bg-foreground text-background px-3 py-1 rounded text-sm">
                  {currentWord.tag}
                </span>
                {showResult && (
                  <span className="inline-block bg-foreground text-background px-3 py-1 rounded text-sm">
                    {currentWord.phonetic}
                  </span>
                )}
              </div>
            </div>
            <button className="p-4 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <Play className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="可以使用拼写写单字，iPad带翻打开随手写，并切换成纯英语输"
              className={`text-center text-lg py-6 ${
                showResult 
                  ? isCorrect 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                  : ""
              }`}
              disabled={showResult}
            />
            <Button 
              onClick={handleSubmit}
              className="w-full bg-foreground text-background hover:bg-foreground/90 py-6"
            >
              确认
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
          >
            跳题
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setShowSettings(true)}
          >
            设置
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleExit}
          >
            退出
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
