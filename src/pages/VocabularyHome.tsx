import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vocabularyBooks = [
  { id: "ielts", name: "雅思", count: 1023 },
  { id: "toefl", name: "托福", count: 1023 },
  { id: "kaoyan", name: "考研", count: 1023 },
  { id: "sat", name: "SAT", count: 1023 },
  { id: "gre", name: "GRE", count: 1023 },
  { id: "cet6", name: "六级", count: 1023 },
  { id: "cet4", name: "四级", count: 1023 },
  { id: "college", name: "大学", count: 1023 },
  { id: "special", name: "专升本", count: 1023 },
  { id: "highschool", name: "高中", count: 1023 },
  { id: "middleschool", name: "初中", count: 1023 },
  { id: "elementary", name: "小学", count: 1023 },
  { id: "nce", name: "新概念英语", count: 1023 },
];

const VocabularyHome = () => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = 1; // Tuesday is checked

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-muted/50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            单词，是你通往流利的钥匙
          </h1>
          <p className="text-lg text-muted-foreground">
            Every word unlocks your path to fluency.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Check-in Card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">打卡记录</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">本周已打卡</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">1</span>
                  <span className="text-lg text-muted-foreground">天</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                {weekDays.map((day, index) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <div 
                      className={`w-10 h-10 rounded flex items-center justify-center ${
                        index === currentDay 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {index === currentDay && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">已累计打卡</span>
                  <span className="text-3xl font-bold">28</span>
                  <span className="text-lg text-muted-foreground">天</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>25年09月29日</div>
                  <div className="text-right">今日还未打卡</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Word Records */}
          <div className="grid grid-cols-2 gap-6">
            <Link to="/vocabulary/learned">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-32 bg-muted rounded-lg mb-4"></div>
                <h3 className="text-xl font-bold mb-2">你背过的单词</h3>
                <p className="text-sm text-muted-foreground">1023个单词</p>
              </Card>
            </Link>
            
            <Link to="/mistakes">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-32 bg-muted rounded-lg mb-4"></div>
                <h3 className="text-xl font-bold mb-2">错题本</h3>
                <p className="text-sm text-muted-foreground">1023个单词</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Vocabulary Books Section */}
        <div>
          <h2 className="text-xl font-bold mb-6">选择单词库</h2>
          
          <Tabs defaultValue="exam" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="exam" className="px-8">考试必背</TabsTrigger>
              <TabsTrigger value="life" className="px-8">生活实用</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exam">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vocabularyBooks.map((book) => (
                  <Link key={book.id} to={`/vocabulary/${book.id}`}>
                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-32 bg-muted rounded-lg mb-4"></div>
                      <h3 className="text-xl font-bold mb-1">{book.name}</h3>
                      <p className="text-sm text-muted-foreground">{book.count}个单词</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="life">
              <div className="text-center py-12 text-muted-foreground">
                生活实用词库即将推出
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHome;
