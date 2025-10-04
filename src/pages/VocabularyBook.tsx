import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, Volume2, ChevronDown, LayoutGrid, List } from "lucide-react";
import { ieltsWords } from "@/data/ieltsWords";
import { getCustomVocabulary } from "@/utils/customVocabularyStorage";

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

// Get words data based on book ID and restore statuses from localStorage
const getWordsForBook = (bookId: string, customId?: string): Word[] => {
  // Handle custom vocabularies
  if (bookId === "custom" && customId) {
    const customVocab = getCustomVocabulary(customId);
    if (customVocab) {
      return customVocab.words.map((w, index) => ({
        id: parseInt(w.id.replace(/\D/g, '')) || index,
        word: w.word,
        tags: [],
        phonetic: "",
        meaning: w.meaning,
        example: w.example || "",
        exampleCn: w.exampleCn || "",
        collocations: "",
        collocationsCn: "",
        status: "unmarked" as WordStatus,
      }));
    }
    return [];
  }

  // Only IELTS has data currently
  if (bookId === "ielts") {
    const words = ieltsWords.map(w => ({ ...w, status: "unmarked" as WordStatus }));
    
    // Restore statuses from localStorage
    const stored = localStorage.getItem('vocabulary_word_statuses');
    if (stored) {
      try {
        const statuses: Record<number, WordStatus> = JSON.parse(stored);
        words.forEach(word => {
          if (statuses[word.id]) {
            word.status = statuses[word.id];
          }
        });
      } catch (e) {
        console.error('Failed to load word statuses:', e);
      }
    }
    
    return words;
  }
  return []; // Other books are empty
};

const VocabularyBook = () => {
  const { bookId, customId } = useParams();
  const [filter, setFilter] = useState<"all" | "unmarked" | "known" | "unknown">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const actualBookId = customId ? "custom" : (bookId || "ielts");
  const [words, setWords] = useState<Word[]>(getWordsForBook(actualBookId, customId));
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [globalTranslationVisible, setGlobalTranslationVisible] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  
  const bookNames: Record<string, string> = {
    ielts: "雅思",
    toefl: "托福",
    kaoyan: "考研",
  };

  let bookName = bookNames[bookId || "ielts"] || "雅思";
  
  // Handle custom vocabulary names
  if (bookId === "custom" && customId) {
    const customVocab = getCustomVocabulary(customId);
    if (customVocab) {
      bookName = customVocab.name;
    }
  }

  // Calculate statistics based on actual data
  const totalWords = words.length;
  const learnedCount = words.filter(w => w.status === "known" || w.status === "unknown").length;

  // Filter words based on selected filter
  const filteredWords = words.filter(word => {
    if (filter === "all") return true;
    if (filter === "unmarked") return word.status === "unmarked";
    if (filter === "known") return word.status === "known";
    if (filter === "unknown") return word.status === "unknown";
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWords = filteredWords.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  // Toggle word status
  const toggleWordStatus = (wordId: number, newStatus: WordStatus) => {
    setWords(prevWords => {
      const updatedWords = prevWords.map(word =>
        word.id === wordId ? { ...word, status: newStatus } : word
      );
      
      // Save statuses to localStorage for statistics
      const statuses: Record<number, WordStatus> = {};
      updatedWords.forEach(word => {
        statuses[word.id] = word.status;
      });
      localStorage.setItem('vocabulary_word_statuses', JSON.stringify(statuses));
      
      return updatedWords;
    });
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

  // Toggle global translation visibility
  const toggleGlobalTranslation = () => {
    const newState = !globalTranslationVisible;
    setGlobalTranslationVisible(newState);
    
    if (newState) {
      // Show all translations
      const allWordIds = new Set(words.map(w => w.id));
      setVisibleTranslations(allWordIds);
    } else {
      // Hide all translations
      setVisibleTranslations(new Set());
    }
  };

  // Shuffle word order
  const shuffleWords = () => {
    setWords(prevWords => {
      const shuffled = [...prevWords];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Gradient */}
      <div className="relative py-12 px-4 backdrop-blur-sm overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-full bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-transparent blur-3xl" />
          <div className="absolute top-0 right-0 w-[450px] h-full bg-gradient-to-bl from-cyan-400/25 via-blue-300/15 to-transparent blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleGlobalTranslation}
              className={globalTranslationVisible ? "text-primary" : ""}
            >
              {globalTranslationVisible ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={shuffleWords}
            >
              打乱顺序
            </Button>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-card rounded-lg p-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilterChange("all")}
            >
              全部
            </Button>
            <Button
              variant={filter === "unmarked" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilterChange("unmarked")}
            >
              未标注
            </Button>
            <Button
              variant={filter === "known" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilterChange("known")}
            >
              认识
            </Button>
            <Button
              variant={filter === "unknown" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFilterChange("unknown")}
            >
              不认识
            </Button>
          </div>

          <div className="flex gap-4">
            <Link 
              to={`/vocabulary/${bookId}/learn-cards`}
              state={{ words: currentWords }}
            >
              <Button className="px-12">学习</Button>
            </Link>
            <Link 
              to={`/vocabulary/${bookId}/learn`}
              state={{ words: currentWords, mode: 'dictation' }}
            >
              <Button className="px-12">听写</Button>
            </Link>
            <Link 
              to={`/vocabulary/${bookId}/challenge`}
              state={{ words: currentWords }}
            >
              <Button className="px-12">挑战</Button>
            </Link>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              列表
            </TabsTrigger>
            <TabsTrigger value="cards" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              卡片
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <Card className="overflow-hidden">
              <div className="bg-muted px-6 py-3 grid grid-cols-12 gap-4 font-medium text-sm">
                <div className="col-span-2">单词</div>
                <div className="col-span-4">例句</div>
                <div className="col-span-3">搭配</div>
                <div className="col-span-3">操作</div>
              </div>

              <div className="divide-y divide-border">
                {currentWords.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <p className="text-muted-foreground text-lg">暂无单词</p>
                    <p className="text-muted-foreground text-sm mt-2">
                      {filter === "unmarked" && "还没有未标注的单词"}
                      {filter === "known" && "还没有标记为认识的单词"}
                      {filter === "unknown" && "还没有标记为不认识的单词"}
                      {filter === "all" && "词库为空"}
                    </p>
                  </div>
                ) : (
                  currentWords.map((word) => {
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
                              <span key={i} className="bg-foreground text-background text-xs px-2 py-0.5 rounded">
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
                  })
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Cards View */}
          <TabsContent value="cards">
            {currentWords.length === 0 ? (
              <Card className="p-16">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg">暂无单词</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    {filter === "unmarked" && "还没有未标注的单词"}
                    {filter === "known" && "还没有标记为认识的单词"}
                    {filter === "unknown" && "还没有标记为不认识的单词"}
                    {filter === "all" && "词库为空"}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentWords.map((word) => {
                  const isTranslationVisible = visibleTranslations.has(word.id);
                  const wordColorClass = 
                    word.status === "known" ? "text-green-600" : 
                    word.status === "unknown" ? "text-red-600" : "";

                  return (
                    <Card key={word.id} className="p-4 hover:shadow-md transition-shadow">
                      {/* Word Header */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${wordColorClass}`}>{word.word}</span>
                            {word.tags.map((tag, i) => (
                              <span key={i} className="bg-foreground text-background text-xs px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => playAudio(word.word)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">{word.phonetic}</div>
                        {isTranslationVisible && (
                          <div className="text-sm mt-1">{word.meaning}</div>
                        )}
                      </div>

                      {/* Example */}
                      <div className="mb-3 pb-3 border-b">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm italic flex-1">{word.example}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => playAudio(word.example)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {isTranslationVisible && word.exampleCn && (
                          <p className="text-xs text-muted-foreground">{word.exampleCn}</p>
                        )}
                      </div>

                      {/* Collocations */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm italic flex-1">{word.collocations}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => playAudio(word.collocations)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {isTranslationVisible && word.collocationsCn && (
                          <p className="text-xs text-muted-foreground">{word.collocationsCn}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleTranslation(word.id)}
                          className={isTranslationVisible ? "text-primary" : ""}
                        >
                          {isTranslationVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {word.status === "unmarked" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => toggleWordStatus(word.id, "known")}
                            >
                              认识
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
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
                            className="flex-1"
                            onClick={() => toggleWordStatus(word.id, "unknown")}
                          >
                            不认识
                          </Button>
                        )}
                        
                        {word.status === "unknown" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleWordStatus(word.id, "known")}
                          >
                            认识
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="text-sm text-muted-foreground">每一页展示</span>
          
          <Popover open={isPageSizeOpen} onOpenChange={setIsPageSizeOpen}>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2">
                {itemsPerPage}条 / 页
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2">
              <div className="flex flex-col gap-1">
                {[10, 20, 50, 100].map((size) => (
                  <Button
                    key={size}
                    variant={itemsPerPage === size ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                      setIsPageSizeOpen(false);
                    }}
                  >
                    {size}条 / 页
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              &lt;
            </Button>
            
            {totalPages <= 7 ? (
              // Show all pages if 7 or fewer
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))
            ) : (
              // Show ellipsis for many pages
              <>
                <Button
                  variant={currentPage === 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                
                {currentPage > 3 && <span className="text-muted-foreground">...</span>}
                
                {currentPage > 2 && currentPage < totalPages - 1 && (
                  <>
                    {currentPage > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </Button>
                    )}
                    <Button variant="default" size="sm">
                      {currentPage}
                    </Button>
                    {currentPage < totalPages - 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </Button>
                    )}
                  </>
                )}
                
                {currentPage === 2 && (
                  <Button variant="default" size="sm">
                    2
                  </Button>
                )}
                
                {currentPage < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                
                {totalPages > 1 && (
                  <Button
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyBook;
