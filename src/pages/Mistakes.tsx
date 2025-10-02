import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Volume2 } from "lucide-react";

const mockDates = [
  "2025-09-28",
  "2025-09-26",
  "2025-09-18",
  "2025-08-16",
  "2025-08-11",
];

const mockWords = [
  {
    id: 1,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
  {
    id: 2,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
  {
    id: 3,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
  {
    id: 4,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
  {
    id: 5,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
  {
    id: 6,
    word: "abundant",
    pos: "adj.",
    phonetic: "",
    meaning: "大量的; 丰富的, 充裕的",
    errorCount: "累计错1次"
  },
];

const Mistakes = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(mockDates[0]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
    // Handle listen action
  };

  const handleDelete = () => {
    if (selectedWords.length === 0) {
      setShowErrorAlert(true);
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Handle delete action
    setSelectedWords([]);
    setShowDeleteDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">我的错题本</h1>
        
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-sm">日期</span>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-48 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {mockDates.map((date) => (
                  <SelectItem key={date} value={date} className="hover:bg-accent">
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">已经选择 {selectedWords.length} 个单词</span>
            <Button 
              onClick={handleListen}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              听写
            </Button>
            <Button 
              onClick={handleDelete}
              variant="outline"
            >
              删除
            </Button>
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

        {/* Word Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockWords.map((word) => (
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
                  <span className="font-medium">{word.word}</span>
                  <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded">
                    {word.pos}
                  </span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground mb-3">{word.meaning}</p>
              <p className="text-sm text-destructive">{word.errorCount}</p>
            </Card>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default Mistakes;
