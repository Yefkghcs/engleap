import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";

const Learn = () => {
  const { bookId } = useParams();
  const [currentWord] = useState({
    meaning: "大量的；丰富的，充裕的",
    tag: "adj.",
    answer: "abundant",
  });
  
  const [userInput, setUserInput] = useState("");
  const progress = 0;
  const total = 10;

  const bookNames: Record<string, string> = {
    ielts: "雅思",
    toefl: "托福",
    kaoyan: "考研",
  };

  const bookName = bookNames[bookId || "ielts"] || "雅思";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{bookName}</h1>
            <p className="text-sm text-muted-foreground">全部单词</p>
          </div>
          <div className="w-96">
            <div className="flex items-center justify-between mb-2">
              <Progress value={(progress / total) * 100} className="flex-1 mr-4" />
              <span className="text-sm font-medium">{progress}/{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-12">
          {/* Word Display */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl font-normal">{currentWord.meaning}</h2>
              <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded">
                {currentWord.tag}
              </span>
            </div>
            
            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-muted">
              <Play className="h-5 w-5" />
            </Button>
          </div>

          {/* Input Area */}
          <div className="space-y-6">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="可以使用手写单字等，iPad需要打开随手写，并切换硬键盘提示"
              className="text-center text-lg py-6 border-t-0 border-x-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            
            <div className="flex justify-center">
              <Button size="lg" className="px-16">
                确认
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button variant="secondary" size="sm">
            跳题
          </Button>
          <Button variant="outline" size="sm">
            退出
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
