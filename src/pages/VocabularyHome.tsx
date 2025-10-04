import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTotalWords, getLearnedWordsCount, getMistakesCount } from "@/utils/vocabularyStats";
import { getTotalCheckInDays, getThisWeekCheckInDays, getWeekCheckInStatus, hasCheckedInToday } from "@/utils/checkInStorage";

const VocabularyHome = () => {
  const [learnedCount, setLearnedCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [weekCheckIns, setWeekCheckIns] = useState(0);
  const [weekStatus, setWeekStatus] = useState<boolean[]>([]);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    // Update counts on mount
    setLearnedCount(getLearnedWordsCount());
    setMistakesCount(getMistakesCount());
    setTotalCheckIns(getTotalCheckInDays());
    setWeekCheckIns(getThisWeekCheckInDays());
    setWeekStatus(getWeekCheckInStatus());
    setCheckedInToday(hasCheckedInToday());
  }, []);

  const vocabularyBooks = [
    { id: "ielts", name: "雅思", count: getTotalWords("ielts"), emoji: "🎓" },
    { id: "toefl", name: "托福", count: getTotalWords("toefl"), emoji: "✈️" },
    { id: "kaoyan", name: "考研", count: getTotalWords("kaoyan"), emoji: "📖" },
    { id: "sat", name: "SAT", count: getTotalWords("sat"), emoji: "🏫" },
    { id: "gre", name: "GRE", count: getTotalWords("gre"), emoji: "🎯" },
    { id: "cet6", name: "六级", count: getTotalWords("cet6"), emoji: "🌟" },
    { id: "cet4", name: "四级", count: getTotalWords("cet4"), emoji: "⭐" },
    { id: "college", name: "大学", count: getTotalWords("college"), emoji: "🏛️" },
    { id: "special", name: "专升本", count: getTotalWords("special"), emoji: "📚" },
    { id: "highschool", name: "高中", count: getTotalWords("highschool"), emoji: "🎒" },
    { id: "middleschool", name: "初中", count: getTotalWords("middleschool"), emoji: "📝" },
    { id: "elementary", name: "小学", count: getTotalWords("elementary"), emoji: "🌱" },
    { id: "nce", name: "新概念英语", count: getTotalWords("nce"), emoji: "💡" },
  ];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100/60 to-orange-50/60 dark:from-pink-950/20 dark:to-orange-950/20 py-16 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold italic text-primary mb-4">
            单词，是你通往流利的钥匙
          </h1>
          <p className="text-lg text-foreground/70 font-sans">
            Every word unlocks your path to fluency.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Check-in Card */}
          <Card className="p-6 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all">
            <h2 className="text-2xl font-bold italic mb-6 text-primary">打卡记录</h2>
            
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">本周已打卡</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{weekCheckIns}</span>
                  <span className="text-lg text-muted-foreground">天</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                {weekDays.map((day, index) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <div 
                      className={`w-10 h-10 rounded flex items-center justify-center ${
                        weekStatus[index]
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {weekStatus[index] && (
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
                  <span className="text-3xl font-bold">{totalCheckIns}</span>
                  <span className="text-lg text-muted-foreground">天</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{new Date().toLocaleDateString('zh-CN', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '年').replace(/年(\d+)年/, '年$1月') + '日'}</div>
                  <div className="text-right">{checkedInToday ? '今日已打卡' : '今日还未打卡'}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Word Records */}
          <div className="grid grid-cols-2 gap-6 h-full">
            <Link to="/vocabulary/learned" className="h-full">
              <Card className="p-6 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl mb-4 flex items-center justify-center border-2 border-amber-200/50 dark:border-amber-800/30">
                  <span className="text-5xl">📚</span>
                </div>
                <h3 className="text-xl font-bold italic mb-2 text-primary">你学过的单词</h3>
                <p className="text-sm text-muted-foreground">{learnedCount}个单词</p>
              </Card>
            </Link>
            
            <Link to="/mistakes" className="h-full">
              <Card className="p-6 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl mb-4 flex items-center justify-center border-2 border-rose-200/50 dark:border-rose-800/30">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-xl font-bold italic mb-2 text-primary">错题本</h3>
                <p className="text-sm text-muted-foreground">{mistakesCount}个单词</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Vocabulary Books Section */}
        <div>
          <h2 className="text-2xl font-bold italic mb-6 text-primary">选择单词库</h2>
          
          <Tabs defaultValue="exam" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="exam" className="px-8">考试必背</TabsTrigger>
              <TabsTrigger value="life" className="px-8">生活实用</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exam">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vocabularyBooks.map((book) => (
                  <Link key={book.id} to={`/vocabulary/${book.id}`}>
                    <Card className="p-4 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all cursor-pointer overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-pink-100 via-orange-50 to-amber-100 dark:from-pink-900/20 dark:via-orange-900/20 dark:to-amber-900/20 rounded-2xl mb-4 flex items-center justify-center border-2 border-primary/20">
                        <span className="text-5xl">{book.emoji}</span>
                      </div>
                      <h3 className="text-xl font-bold italic mb-1 text-primary">{book.name}</h3>
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
