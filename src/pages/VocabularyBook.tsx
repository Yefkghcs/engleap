import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Volume2 } from "lucide-react";

type WordStatus = "unmarked" | "known" | "unknown";

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
  status: WordStatus;
}

const initialWordData: Word[] = [
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
    status: "unmarked",
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
    status: "unmarked",
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
    status: "known",
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
    status: "unknown",
  },
];

const VocabularyBook = () => {
  const { bookId } = useParams();
  const [filter, setFilter] = useState<"all" | "unmarked" | "known" | "unknown">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [words, setWords] = useState<Word[]>(initialWordData);
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  
  const bookNames: Record<string, string> = {
    ielts: "雅思",
    toefl: "托福",
    kaoyan: "考研",
  };

  const bookName = bookNames[bookId || "ielts"] || "雅思";

  // Calculate statistics
  const learnedCount = words.filter(w => w.status === "known" || w.status === "unknown").length;
  const totalWords = 8000; // Total words in the book

  // Filter words based on selected filter
  const filteredWords = words.filter(word => {
    if (filter === "all") return true;
    if (filter === "unmarked") return word.status === "unmarked";
    if (filter === "known") return word.status === "known";
    if (filter === "unknown") return word.status === "unknown";
    return true;
  });

  // Toggle word status
  const toggleWordStatus = (wordId: number, newStatus: WordStatus) => {
    setWords(prevWords =>
      prevWords.map(word =>
        word.id === wordId ? { ...word, status: newStatus } : word
      )
    );
  };

  // Toggle translation visibility
  const toggleTranslation = (wordId: number) => {
    setVisibleTranslations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  // Play audio using Web Speech API
  const playAudio = (text: string, lang: string = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-muted/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">{bookName}</h1>
          <p className="text-lg text-muted-foreground">IELTS Vocabulary</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Book Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{bookName}单词库</h2>
            <span className="text-sm text-muted-foreground">已学 {learnedCount} / {totalWords}</span>
            <Button variant="ghost" size="icon">
              <Eye className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="sm">打卡属性</Button>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-card rounded-lg p-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              全部
            </Button>
            <Button
              variant={filter === "unmarked" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unmarked")}
            >
              未标注
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

          <div className="flex gap-4">
            <Link to={`/vocabulary/${bookId}/learn`}>
              <Button className="px-12">学习</Button>
            </Link>
            <Button className="px-12">听写</Button>
            <Button className="px-12">挑战</Button>
          </div>
        </div>

        {/* Word Table */}
        <Card className="overflow-hidden">
          <div className="bg-muted px-6 py-3 grid grid-cols-12 gap-4 font-medium text-sm">
            <div className="col-span-2">单词</div>
            <div className="col-span-4">例句</div>
            <div className="col-span-3">搭配</div>
            <div className="col-span-3">操作</div>
          </div>

          <div className="divide-y divide-border">
            {filteredWords.map((word) => {
              const isTranslationVisible = visibleTranslations.has(word.id);
              const wordColorClass = 
                word.status === "known" ? "text-green-600" : 
                word.status === "unknown" ? "text-red-600" : "";

              return (
                <div key={word.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-start">
                  {/* Word Column */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold ${wordColorClass}`}>{word.word}</span>
                      {word.tags.map((tag, i) => (
                        <span key={i} className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <span>{word.phonetic}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => playAudio(word.word)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {isTranslationVisible && (
                      <div className="text-sm">{word.meaning}</div>
                    )}
                  </div>

                  {/* Example Column */}
                  <div className="col-span-4 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="italic flex-1">{word.example}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => playAudio(word.example)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {isTranslationVisible && word.exampleCn && (
                      <p className="text-muted-foreground">{word.exampleCn}</p>
                    )}
                  </div>

                  {/* Collocations Column */}
                  <div className="col-span-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="italic flex-1">{word.collocations}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => playAudio(word.collocations)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {isTranslationVisible && word.collocationsCn && (
                      <p className="text-muted-foreground">{word.collocationsCn}</p>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-3 flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleTranslation(word.id)}
                      className={isTranslationVisible ? "text-primary" : ""}
                    >
                      {isTranslationVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                    
                    {word.status === "unmarked" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleWordStatus(word.id, "known")}
                        >
                          认识
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleWordStatus(word.id, "unknown")}
                        >
                          不认识
                        </Button>
                      </>
                    )}
                    
                    {word.status === "known" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleWordStatus(word.id, "unknown")}
                      >
                        不认识
                      </Button>
                    )}
                    
                    {word.status === "unknown" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleWordStatus(word.id, "known")}
                      >
                        认识
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button variant="secondary" size="sm">每一页展示</Button>
          <Button variant="secondary" size="sm">10条 / 页 ▼</Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              &lt;
            </Button>
            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <span className="text-muted-foreground">...</span>
            <Button variant="ghost" size="sm">102</Button>
            <Button variant="ghost" size="icon">
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyBook;
