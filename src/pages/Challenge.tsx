import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Volume2, Clock } from "lucide-react";
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

interface Question {
  type: "en-to-cn" | "cn-to-en" | "spelling";
  question: string;
  correctAnswer: string;
  options: string[];
  word: Word;
}

const Challenge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const words = (location.state?.words as Word[]) || [];
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (words.length === 0) {
      toast({
        title: "没有单词",
        description: "请返回词汇书选择要挑战的单词",
        variant: "destructive",
      });
      navigate(`/vocabulary/${bookId}`);
      return;
    }

    // Generate questions
    const generatedQuestions = generateQuestions(words);
    setQuestions(generatedQuestions);
  }, [words, navigate, bookId]);

  // Timer countdown
  useEffect(() => {
    if (showResult || showCompletion) return;
    
    if (timeLeft === 0) {
      // Time's up, mark as wrong
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, showCompletion]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(10);
  }, [currentIndex]);

  const generateQuestions = (words: Word[]): Question[] => {
    const questions: Question[] = [];
    
    words.forEach(word => {
      const questionType = Math.floor(Math.random() * 3);
      
      if (questionType === 0) {
        // English to Chinese
        const otherWords = words.filter(w => w.id !== word.id);
        const wrongOptions = shuffleArray(otherWords)
          .slice(0, 3)
          .map(w => w.meaning);
        const options = shuffleArray([word.meaning, ...wrongOptions]);
        
        questions.push({
          type: "en-to-cn",
          question: word.word,
          correctAnswer: word.meaning,
          options,
          word,
        });
      } else if (questionType === 1) {
        // Chinese to English
        const otherWords = words.filter(w => w.id !== word.id);
        const wrongOptions = shuffleArray(otherWords)
          .slice(0, 3)
          .map(w => w.word);
        const options = shuffleArray([word.word, ...wrongOptions]);
        
        questions.push({
          type: "cn-to-en",
          question: word.meaning,
          correctAnswer: word.word,
          options,
          word,
        });
      } else {
        // Spelling (identify correct spelling)
        const wrongSpellings = generateWrongSpellings(word.word);
        const options = shuffleArray([word.word, ...wrongSpellings]);
        
        questions.push({
          type: "spelling",
          question: `哪个是"${word.meaning}"的正确拼写？`,
          correctAnswer: word.word,
          options,
          word,
        });
      }
    });
    
    return shuffleArray(questions);
  };

  const generateWrongSpellings = (word: string): string[] => {
    const wrong: string[] = [];
    
    // Swap two letters
    if (word.length > 2) {
      const arr = word.split('');
      const i = Math.floor(Math.random() * (word.length - 1));
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      wrong.push(arr.join(''));
    }
    
    // Double a letter
    if (word.length > 1) {
      const i = Math.floor(Math.random() * word.length);
      const arr = word.split('');
      arr.splice(i, 0, arr[i]);
      wrong.push(arr.join(''));
    }
    
    // Remove a letter
    if (word.length > 3) {
      const i = Math.floor(Math.random() * word.length);
      const arr = word.split('');
      arr.splice(i, 1);
      wrong.push(arr.join(''));
    }
    
    return wrong.slice(0, 3);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleTimeUp = () => {
    setSelectedAnswer(null);
    setShowResult(true);
    // Don't increment correctCount - this counts as wrong
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setShowCompletion(true);
    }
  };

  const handleExit = () => {
    navigate(`/vocabulary/${bookId}`);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  if (showCompletion) {
    const score = Math.round((correctCount / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">挑战完成！</h2>
          <div className="mb-8">
            <div className="text-6xl font-bold text-primary mb-4">{score}分</div>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">正确：</span>
                <span className="text-green-600 font-bold">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">错误：</span>
                <span className="text-red-600 font-bold">{questions.length - correctCount}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-muted-foreground">总计：</span>
                <span className="font-bold">{questions.length}</span>
              </div>
            </div>
          </div>
          <Button onClick={handleExit} className="w-full" size="lg">
            返回词汇书
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExit}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`text-sm font-bold ${timeLeft <= 3 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {timeLeft}s
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-green-600">
              正确: {correctCount}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8">
          {/* Question Text */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-muted-foreground">
                {currentQuestion.type === "en-to-cn" && "选择正确的中文释义："}
                {currentQuestion.type === "cn-to-en" && "选择正确的英文单词："}
                {currentQuestion.type === "spelling" && currentQuestion.question}
              </h2>
              {currentQuestion.type !== "spelling" && (
                <>
                  <span className="text-4xl font-bold text-primary">{currentQuestion.question}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => playAudio(currentQuestion.word.word)}
                  >
                    <Volume2 className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              
              let buttonClass = "h-auto min-h-16 text-lg justify-start px-6 py-4";
              if (showCorrect) {
                buttonClass += " bg-green-100 border-green-500 text-green-700 hover:bg-green-100";
              } else if (showWrong) {
                buttonClass += " bg-red-100 border-red-500 text-red-700 hover:bg-red-100";
              }
              
              return (
                <Button
                  key={index}
                  variant={isSelected && !showResult ? "default" : "outline"}
                  className={buttonClass}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <div className="mb-6 animate-fade-in">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium text-center">✓ 回答正确！</p>
                </div>
              ) : selectedAnswer === null ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-700 font-medium text-center">
                    ⏱ 时间到！正确答案是：{currentQuestion.correctAnswer}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium text-center">
                    ✗ 回答错误！正确答案是：{currentQuestion.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <Button 
              onClick={handleNext} 
              className="w-full" 
              size="lg"
            >
              {currentIndex < questions.length - 1 ? "下一题" : "完成挑战"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Challenge;
