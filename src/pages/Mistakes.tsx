import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useUserInfo from "@/models/user";
import LoginBtn from "@/components/loginBtn";
import useWordStore, { WordsMapItem } from "@/models/word";

const MistakesDetail = () => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordsMapItem[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 30;

  const getWordDataByMistakes = useWordStore((state) => state.getWordDataByMistakes);
  const mistakesMap = useWordStore((state) => state.mistakesMap);
  const deleteMistake = useWordStore((state) => state.deleteMistake);

  const displayedWords = mistakesMap?.data || [];

  const selectedIds = selectedWords?.map?.((item) => `${item.subcategory}-${item.id}`);

  const updateMistakeData = useCallback(() => {
    const dateStrings = selectedDates.map(d => format(d, "yyyy-MM-dd"));
    getWordDataByMistakes(dateStrings?.length > 0 ? dateStrings : undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates]);

  // Load mistakes on mount and when dates change
  useEffect(() => {
    updateMistakeData();
  }, [updateMistakeData]);

  // Play audio function
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const removeDate = (dateToRemove: Date) => {
    setSelectedDates(prev => prev.filter(date => date.getTime() !== dateToRemove.getTime()));
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
    navigate("/vocabulary/mistakes/learn", {
      state: { 
        words: wordsToTest,
        mode: 'dictation'
      }
    });
  };

  const handleDelete = () => {
    if (selectedWords.length === 0) {
      setShowErrorAlert(true);
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setSelectedWords([]);
    setShowDeleteDialog(false);
    
    // Refresh displayed words
    await deleteMistake(selectedWords);
    updateMistakeData();
  };

  // Pagination logic
  const totalPages = Math.ceil(displayedWords.length / wordsPerPage);
  const startIndex = (currentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const currentWords = displayedWords.slice(startIndex, endIndex);

  // Reset to page 1 when displayed words change
  useEffect(() => {
    setCurrentPage(1);
  }, [displayedWords.length]);

  return (
    <>      
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm whitespace-nowrap">日期</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-auto text-xs sm:text-sm",
                    !selectedDates.length && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {selectedDates.length > 0 
                    ? `已选择 ${selectedDates.length} 个日期` 
                    : "选择日期"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border border-border z-50" align="start">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm whitespace-nowrap">已选择 {selectedWords.length} 个</span>
            <Button 
              onClick={handleListen}
              className="bg-foreground text-background hover:bg-foreground/90 flex-1 sm:flex-none text-xs sm:text-sm"
            >
              听写
            </Button>
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              删除
            </Button>
          </div>
        </div>

        {/* Selected Dates Display */}
        {selectedDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date) => (
              <div 
                key={date.getTime()} 
                className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm"
              >
                <span>{format(date, "yyyy-MM-dd")}</span>
                <button
                  onClick={() => removeDate(date)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
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
        {displayedWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-muted rounded-full mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">暂无错题</h3>
            <p className="text-muted-foreground">
              {selectedDates.length > 0 
                ? "所选日期没有错题记录" 
                : "继续学习，保持完美记录！"}
            </p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentWords.map((word) => (
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
                    <span className="font-medium">{word.word}</span>
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{word.mistakes?.[word.mistakes?.length - 1]}</span>
                  <span className="text-destructive">错误 {word.mistakes?.length || 0} 次</span>
                </div>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          </>
        )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>确认要删除吗？</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background hover:bg-accent">
              取消
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Mistakes = () => {
  const email = useUserInfo((state) => state.email);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
       <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">我的错题本</h1>

       {email ? (
          <MistakesDetail />
        ) : (
          <LoginBtn />
        )}
      </div>
    </div>
  );
}

export default Mistakes;
