import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Eye, EyeOff, Volume2, ChevronDown, LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useUserInfo from "@/models/user";
import LoginBtn from "@/components/loginBtn";
import useWordStore, { WordsMapItem, WordStatus } from "@/models/word";
import useWordCategoryStore from "@/models/wordCategory";
import useCustomWordStore from "@/models/custom";

enum FilterStatus {
  ALL = 'all',
  UNMARKED = 'unmarked',
  UNKNOWN = 'unknown',
  KNOWN = 'known',
}

const StatusMap = {
  [FilterStatus.ALL]: undefined,
  [FilterStatus.UNMARKED]: WordStatus.UNMARKED,
  [FilterStatus.UNKNOWN]: WordStatus.UNKNOWN,
  [FilterStatus.KNOWN]: WordStatus.KNOWN,
};

const VocabularyBookDetail = ({ actualName }: { actualName: string }) => {
  const { bookId, customId } = useParams();
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.ALL);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [globalTranslationVisible, setGlobalTranslationVisible] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "cards">("cards");
  const [isLoading, setIsLoading] = useState(true);

  const getWordData = useWordStore((state) => state.getWordData);
  const wordsMap = useWordStore((state) => state.wordsMap);
  const updateWordStatus = useWordStore((state) => state.updateWordStatus);

  const getCustomWords = useCustomWordStore((state) => state.getCustomWords);
  const customWordsMap = useCustomWordStore((state) => state.customWordsMap);
  const updateCustomWordStatus = useCustomWordStore((state) => state.updateCustomWordStatus);
  
  const words = (customId ? customWordsMap?.data : wordsMap?.data) || [];
  const totalWords = (customId ? customWordsMap?.total : wordsMap?.total) || 0;
  const totalPages = (customId ? customWordsMap?.pages : wordsMap?.pages) || 1;
  const known = (customId ? customWordsMap?.known : wordsMap?.known) || 0;
  const unknown = (customId ? customWordsMap?.unknown : wordsMap?.unknown) || 0;

  const filterTotalMap = {
    [FilterStatus.ALL]: known + unknown,
    [FilterStatus.KNOWN]: known,
    [FilterStatus.UNKNOWN]: unknown,
    [FilterStatus.UNMARKED]: 0,
  };

  useEffect(() => {
    if (!bookId) return;
    setIsLoading(true);
    getWordData({
      page: currentPage,
      limit: itemsPerPage,
      subcategory: bookId,
      status: StatusMap[filter],
    }).finally(() => setIsLoading(false));
  }, [bookId, currentPage, filter, getWordData, itemsPerPage]);

  useEffect(() => {
    if (!customId) return;
    setIsLoading(true);
    getCustomWords({
      page: currentPage,
      limit: itemsPerPage,
      subcategory: customId,
      status: StatusMap[filter],
    }).finally(() => setIsLoading(false));
  }, [currentPage, customId, filter, getCustomWords, itemsPerPage]);

  // Update itemsPerPage when viewMode changes
  useEffect(() => {
    if (viewMode === "cards") {
      setItemsPerPage(20);
    } else {
      setItemsPerPage(10);
    }
    setCurrentPage(1);
  }, [viewMode]);

  // Filter words based on selected filter
  const currentWords = words.filter(word => {
    if (filter === FilterStatus.ALL) return true;
    if (filter === FilterStatus.UNMARKED) return word.status === WordStatus.UNMARKED;
    if (filter === FilterStatus.KNOWN) return word.status === WordStatus.KNOWN;
    if (filter === FilterStatus.UNKNOWN) return word.status === WordStatus.UNKNOWN;
    return true;
  });

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  // Toggle word status
  const toggleWordStatus = async (word: WordsMapItem, newStatus: WordStatus) => {
    if (word.category === 'custom') {
      updateCustomWordStatus({
        category: word.category,
        subcategory: word.subcategory,
        id: word.id,
        status: newStatus,
      });
    } else {
      updateWordStatus({
        category: word.category,
        subcategory: word.subcategory,
        id: word.id,
        status: newStatus,
      });
    }
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
    // TODO
    // setWords(prevWords => {
    //   const shuffled = [...prevWords];
    //   for (let i = shuffled.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    //   }
    //   return shuffled;
    // });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Book Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-bold">{actualName}单词库</h2>
          <span className="text-xs sm:text-sm text-muted-foreground">已学 {filterTotalMap?.[filter] > 0 ? filterTotalMap?.[filter] : 0} / {totalWords}</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleGlobalTranslation}
            className={globalTranslationVisible ? "text-primary" : ""}
          >
            {globalTranslationVisible ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={shuffleWords}
            className="text-xs sm:text-sm"
          >
            打乱顺序
          </Button>
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-2 sm:gap-4">
            <Link 
              to={`/vocabulary/${customId ? `custom/${customId}` : bookId}/learn-cards`}
              state={{ words: currentWords }}
              className="flex-1"
            >
              <Button className="w-full text-xs sm:text-sm">学习</Button>
            </Link>
            <Link 
              to={`/vocabulary/${customId ? `custom/${customId}` : bookId}/learn`}
              state={{ words: currentWords, mode: 'dictation' }}
              className="flex-1"
            >
              <Button className="w-full text-xs sm:text-sm">听写</Button>
            </Link>
            <Link 
              to={`/vocabulary/${customId ? `custom/${customId}` : bookId}/challenge`}
              state={{ words: currentWords }}
              className="flex-1"
            >
              <Button className="w-full text-xs sm:text-sm">挑战</Button>
            </Link>
          </div>
        </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6 items-start lg:items-center justify-between">
        <div className="flex gap-1 sm:gap-2 bg-card rounded-lg p-1 overflow-x-auto">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(FilterStatus.ALL)}
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            全部
          </Button>
          <Button
            variant={filter === "unmarked" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(FilterStatus.UNMARKED)}
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            未标注
          </Button>
          <Button
            variant={filter === "known" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(FilterStatus.KNOWN)}
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            认识
          </Button>
          <Button
            variant={filter === "unknown" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange(FilterStatus.UNKNOWN)}
            className="text-xs sm:text-sm whitespace-nowrap"
          >
            不认识
          </Button>
        </div>

          <div className="flex gap-2 bg-card rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">列表</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">卡片</span>
            </Button>
          </div>
        </div>

      {/* List View */}
      {viewMode === "list" && (
        <div>
          {/* Desktop List View */}
          <Card className="overflow-hidden hidden sm:block">
            <div className="bg-muted px-6 py-3 grid grid-cols-12 gap-4 font-medium text-sm">
              <div className="col-span-2">单词</div>
              <div className="col-span-1">词性</div>
              <div className="col-span-6">例句</div>
              <div className="col-span-3">操作</div>
            </div>

            <div className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-3 grid grid-cols-12 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="col-span-1">
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div className="col-span-6 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="col-span-3 flex gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-16" />
                    </div>
                  </div>
                ))
              ) : currentWords.length === 0 ? (
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
                    <div key={word.id} className="px-6 py-3 grid grid-cols-12 gap-4 items-start">
                      {/* Word Column */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${wordColorClass}`}>{word.word}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => playAudio(word.word)}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          <span>{word.phonetic}</span>
                        </div>
                        {isTranslationVisible && (
                          <div className="text-sm mt-1">{word.meaning}</div>
                        )}
                      </div>

                      {/* Tags Column */}
                      <div className="col-span-1">
                        <div className="flex flex-wrap gap-1">
                          {word?.partOfSpeech?.map?.((tag, i) => (
                            <span key={i} className="bg-foreground text-background text-xs px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Example Column */}
                      <div className="col-span-6 text-sm">
                        <div className="flex items-start gap-1">
                          <p className="italic flex-1">{word.example}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 flex-shrink-0"
                            onClick={() => playAudio(word.example)}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {isTranslationVisible && word.exampleCn && (
                          <p className="text-muted-foreground mt-0.5">{word.exampleCn}</p>
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
                              onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
                            >
                              认识
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                            >
                              不认识
                            </Button>
                          </>
                        )}
                        
                        {word.status === "known" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                          >
                            不认识
                          </Button>
                        )}
                        
                        {word.status === "unknown" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
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

          {/* Mobile List View */}
          <div className="sm:hidden space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </Card>
              ))
            ) : currentWords.length === 0 ? (
              <Card className="p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">暂无单词</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {filter === "unmarked" && "还没有未标注的单词"}
                    {filter === "known" && "还没有标记为认识的单词"}
                    {filter === "unknown" && "还没有标记为不认识的单词"}
                    {filter === "all" && "词库为空"}
                  </p>
                </div>
              </Card>
            ) : (
              currentWords.map((word) => {
                const isTranslationVisible = visibleTranslations.has(word.id);
                const wordColorClass = 
                  word.status === "known" ? "text-green-600" : 
                  word.status === "unknown" ? "text-red-600" : "";

                return (
                  <Card key={word.id} className="p-4">
                    {/* Word Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`text-lg font-bold ${wordColorClass}`}>{word.word}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => playAudio(word.word)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          {word?.partOfSpeech?.map?.((tag, i) => (
                            <span key={i} className="bg-foreground text-background text-xs px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>{word.phonetic}</span>
                        </div>
                        {isTranslationVisible && (
                          <div className="text-sm mt-1">{word.meaning}</div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleTranslation(word.id)}
                        className={`flex-shrink-0 ${isTranslationVisible ? "text-primary" : ""}`}
                      >
                        {isTranslationVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Example */}
                    {word.example && (
                      <div className="mb-2 pb-2 border-b">
                        <div className="flex items-start gap-0.5">
                          <p className="text-xs italic flex-1">{word.example}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 flex-shrink-0"
                            onClick={() => playAudio(word.example)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {isTranslationVisible && word.exampleCn && (
                          <p className="text-xs text-muted-foreground mt-1">{word.exampleCn}</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {word.status === "unmarked" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
                          >
                            认识
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                          >
                            不认识
                          </Button>
                        </>
                      )}
                      
                      {word.status === "known" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                        >
                          不认识
                        </Button>
                      )}
                      
                      {word.status === "unknown" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
                        >
                          认识
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === "cards" && (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-4 flex flex-col h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-7 w-32" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-1">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : currentWords.length === 0 ? (
            <Card className="p-16">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">暂无单词</p>
                <p className="text-muted-foreground text-sm mt-2">
                  {filter === FilterStatus.UNMARKED && "还没有未标注的单词"}
                  {filter === FilterStatus.KNOWN && "还没有标记为认识的单词"}
                  {filter === FilterStatus.UNKNOWN && "还没有标记为不认识的单词"}
                  {filter === FilterStatus.ALL && "词库为空"}
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentWords.map((word) => {
                const isTranslationVisible = visibleTranslations.has(word.id);
                const wordColorClass = 
                  word.status === WordStatus.KNOWN ? "text-green-600" : 
                  word.status === WordStatus.UNKNOWN ? "text-red-600" : "";

                return (
                  <Card key={word.id} className="p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                    {/* Word Header */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <span className={`text-xl font-bold ${wordColorClass}`}>{word.word}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => playAudio(word.word)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {word?.partOfSpeech?.map?.((tag, i) => (
                          <span key={i} className="bg-foreground text-background text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{word.phonetic}</div>
                      {isTranslationVisible && (
                        <div className="text-sm mt-1">{word.meaning}</div>
                      )}
                    </div>

                    {/* Example */}
                    <div className="mb-3 flex-1">
                      <div className="flex items-start gap-0.5 mb-1">
                        <p className="text-sm italic flex-1">{word.example}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 flex-shrink-0"
                          onClick={() => playAudio(word.example)}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      {isTranslationVisible && word.exampleCn && (
                        <p className="text-xs text-muted-foreground">{word.exampleCn}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t mt-auto">
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
                      
                      {word.status === WordStatus.UNMARKED && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
                          >
                            认识
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                          >
                            不认识
                          </Button>
                        </>
                      )}
                      
                      {word.status === WordStatus.KNOWN && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleWordStatus(word, WordStatus.UNKNOWN)}
                        >
                          不认识
                        </Button>
                      )}
                      
                      {word.status === WordStatus.UNKNOWN && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleWordStatus(word, WordStatus.KNOWN)}
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
          </div>
        )}

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
              {(viewMode === "cards" ? [20, 40, 80, 100] : [10, 20, 50, 100]).map((size) => (
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
            onClick={() => setCurrentPage(p => Math.max(0, Math.min(totalPages, p + 1)))}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

const VocabularyBook = () => {
  const { customId, bookId } = useParams();
  const email = useUserInfo((state) => state.email);
  
  const getWordCategories = useWordCategoryStore((state) => state.getWordCategories);
  const getSubcategoryNameById = useWordCategoryStore((state) => state.getSubcategoryNameById);
  const categoryList = useWordCategoryStore((state) => state.categoryList);

  const customCategories = useCustomWordStore((state) => state.customCategories);
  const getCustomCategories = useCustomWordStore((state) => state.getCustomCategories);

  const [actualName, setName] = useState<string>('');

  useEffect(() => {
    if (customId) getCustomCategories();    
  }, [customId, getCustomCategories]);

  useEffect(() => {
    if (bookId) getWordCategories();
  }, [bookId, getWordCategories]);

  useEffect(() => {
    const bookName = getSubcategoryNameById(bookId) || '';
    const customName = customCategories?.find?.((item) => item?.subcategory === customId)?.subcategoryName || '';
    setName(customName || bookName);
  }, [bookId, customCategories, customId, categoryList]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Gradient */}
      <div className="relative py-12 px-4 bg-gradient-to-br from-background via-primary/8 to-background overflow-hidden border-b">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/35 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-0 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-2xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">{actualName}</h1>
          {/* TODO */}
          {/* <p className="text-lg text-muted-foreground">{customId ? "自定义单词库" : "IELTS Vocabulary"}</p> */}
        </div>
      </div>

      {email ? (
        <VocabularyBookDetail actualName={actualName} />
      ) : (
        <LoginBtn />
      )}
    </div>
  );
}

export default VocabularyBook;
