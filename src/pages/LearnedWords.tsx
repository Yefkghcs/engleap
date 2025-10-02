import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  status: "known" | "unknown";
}

const LearnedWords = () => {
  const navigate = useNavigate();
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [displayedWords, setDisplayedWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<"all" | "known" | "unknown">("all");

  // Load learned words from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vocabulary_word_statuses');
    if (!stored) {
      setDisplayedWords([]);
      return;
    }

    try {
      const statuses: Record<number, string> = JSON.parse(stored);
      
      // Get all IELTS words
      const initialWordData = [
        {
          id: 1,
          word: "abundant",
          tags: ["adj."],
          phonetic: "/əˈbʌndənt/",
          meaning: "大量的; 丰富的，充裕的",
          example: "The forest is abundant with wildlife.",
          exampleCn: "这片森林里野生动物资源十分丰富。",
          collocations: "abundant resources / abundant evidence",
          collocationsCn: "丰富的资源 / 充足的证据",
          status: "unmarked" as const,
        },
        {
          id: 2,
          word: "grief",
          tags: ["n."],
          phonetic: "/ɡriːf/",
          meaning: "悲伤，悲痛",
          example: "There was no grief in his eyes, only anger.",
          exampleCn: "他的眼中没有悲伤，只有愤怒。",
          collocations: "drown one's grief / suffer grief",
          collocationsCn: "借酒浇愁 / 遭受悲痛",
          status: "unmarked" as const,
        },
        {
          id: 3,
          word: "brook",
          tags: ["n.", "v."],
          phonetic: "/brʊk/",
          meaning: "小溪，溪流; 忍受，容忍",
          example: "The children played by the brook all afternoon.",
          exampleCn: "孩子们整个下午都在小溪边玩耍。",
          collocations: "babbling brook",
          collocationsCn: "潺潺的小溪",
          status: "known" as const,
        },
        {
          id: 4,
          word: "endanger",
          tags: ["vt."],
          phonetic: "/ɪnˈdeɪn.dʒər/",
          meaning: "危及，使陷入危险",
          example: "Pollution has endangered many species of birds.",
          exampleCn: "污染已危及了许多鸟类。",
          collocations: "endanger species",
          collocationsCn: "危及物种",
          status: "unknown" as const,
        },
      ];

      // Filter words that have been marked
      const learnedWords = initialWordData
        .filter(word => statuses[word.id] && (statuses[word.id] === 'known' || statuses[word.id] === 'unknown'))
        .map(word => ({
          ...word,
          status: statuses[word.id] as "known" | "unknown"
        }));

      setDisplayedWords(learnedWords);
    } catch (e) {
      console.error('Failed to load learned words:', e);
      setDisplayedWords([]);
    }
  }, []);

  // Play audio function
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleWordSelect = (wordId: number) => {
    setSelectedWords(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
    if (showErrorAlert) setShowErrorAlert(false);
  };

  const handleListen = () => {
    if (selectedWords.length === 0) {
      setShowErrorAlert(true);
      return;
    }
    
    // Get selected words data
    const wordsToTest = displayedWords.filter(w => selectedWords.includes(w.id));
    
    // Navigate to dictation page with selected words
    navigate("/vocabulary/learned/learn", {
      state: { 
        words: wordsToTest,
        mode: 'dictation'
      }
    });
  };

  // Filter words based on status
  const filteredWords = displayedWords.filter(word => {
    if (filter === "all") return true;
    if (filter === "known") return word.status === "known";
    if (filter === "unknown") return word.status === "unknown";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">你背过的单词</h1>
        
        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 bg-card rounded-lg p-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                全部
              </Button>
              <Button
                variant={filter === "known" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("known")}
              >
                认识
              </Button>
              <Button
                variant={filter === "unknown" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("unknown")}
              >
                不认识
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm">已经选择 {selectedWords.length} 个单词</span>
              <Button 
                onClick={handleListen}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                听写
              </Button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {showErrorAlert && (
          <Alert className="mb-6 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              当前选择单词为0，请先点击卡片进行选择
            </AlertDescription>
          </Alert>
        )}

        {/* Word Grid or Empty State */}
        {filteredWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-muted rounded-full mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">还没有背过的单词</h3>
            <p className="text-muted-foreground">
              {filter === "known" && "还没有标记为认识的单词"}
              {filter === "unknown" && "还没有标记为不认识的单词"}
              {filter === "all" && "开始学习并标记单词吧！"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredWords.map((word) => (
              <Card
                key={word.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedWords.includes(word.id) 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:shadow-lg"
                }`}
                onClick={() => handleWordSelect(word.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      word.status === "known" ? "text-green-600" : "text-red-600"
                    }`}>{word.word}</span>
                    {word.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-foreground text-background px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(word.word);
                      }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground mb-2">{word.meaning}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={
                    word.status === "known" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }>
                    {word.status === "known" ? "认识" : "不认识"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnedWords;
