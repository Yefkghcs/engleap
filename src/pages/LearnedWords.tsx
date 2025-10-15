import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Volume2 } from "lucide-react";
import useUserInfo from "@/models/user";
import LoginBtn from "@/components/loginBtn";
import useWordStore, { WordsMapItem, WordStatus } from "@/models/word";

enum FilterStatus {
  ALL = 'all',
  UNKNOWN = 'unknown',
  KNOWN = 'known',
}

const StatusMap = {
  [FilterStatus.ALL]: [WordStatus.UNKNOWN, WordStatus.KNOWN],
  [FilterStatus.UNKNOWN]: [WordStatus.UNKNOWN],
  [FilterStatus.KNOWN]: [WordStatus.KNOWN],
};

const LearnedWordsDetail = () => {
  const navigate = useNavigate();
  const [selectedWords, setSelectedWords] = useState<WordsMapItem[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);

  const learnedMap = useWordStore((state) => state.learnedMap);
  const getLearnedWords = useWordStore((state) => state.getLearnedWords);
  const displayedWords = learnedMap?.data || [];

  const selectedIds = selectedWords?.map?.((item) => `${item.subcategory}-${item.id}`);

  useEffect(() => {
    getLearnedWords(StatusMap[filter]);
  }, [filter]);

  // Play audio function
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleWordSelect = (word: WordsMapItem) => {
    setSelectedWords(prev => {
      const prevIds = prev?.map?.((item) => `${item.subcategory}-${item.id}`);
      if (prevIds.includes(`${word.subcategory}-${word.id}`)) {
        return prev?.filter?.((item) => item.id !== word.id || item.subcategory !== word.subcategory)
      }
      return [...prev, word];
    });
    if (showErrorAlert) setShowErrorAlert(false);
  };

  const handleListen = () => {
    if (selectedWords.length === 0) {
      setShowErrorAlert(true);
      return;
    }
    
    // Get selected words data
    const wordsToTest = displayedWords.filter(w => selectedIds.includes(`${w.subcategory}-${w.id}`));
    
    // Navigate to dictation page with selected words
    navigate("/vocabulary/learned/learn", {
      state: { 
        words: wordsToTest,
        mode: 'dictation'
      }
    });
  };

  // Filter words based on status
  const filteredWords = displayedWords;

  return (
    <>        
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-1 sm:gap-2 bg-card rounded-lg p-1 overflow-x-auto w-full sm:w-auto">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(FilterStatus.ALL)}
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              全部
            </Button>
            <Button
              variant={filter === "known" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(FilterStatus.KNOWN)}
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              认识
            </Button>
            <Button
              variant={filter === "unknown" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(FilterStatus.UNKNOWN)}
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              不认识
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm whitespace-nowrap">已选择 {selectedWords.length} 个</span>
            <Button 
              onClick={handleListen}
              className="bg-foreground text-background hover:bg-foreground/90 flex-1 sm:flex-none text-xs sm:text-sm"
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
          <h3 className="text-xl font-semibold mb-2">还没有学过的单词</h3>
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
              key={`${word.subcategory}-${word.id}`}
              className={`p-4 cursor-pointer transition-all ${
                selectedIds.includes(`${word.subcategory}-${word.id}`) 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleWordSelect(word)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    word.status === "known" ? "text-green-600" : "text-red-600"
                  }`}>{word.word}</span>
                  {word?.partOfSpeech?.map((tag: string, i: number) => (
                    <span key={i} className="text-xs bg-black dark:bg-black text-white px-2 py-0.5 rounded">
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
    </>
  );
};

const LearnedWords = () => {
  const email = useUserInfo((state) => state.email);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">你学过的单词</h1>

        {email ? (
          <LearnedWordsDetail />
        ) : (
          <LoginBtn />
        )}
      </div>
    </div>
  );
};
export default LearnedWords;
