import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ieltsImg from "@/assets/vocab-ielts.png";
import toeflImg from "@/assets/vocab-toefl.png";
import kaoyanImg from "@/assets/vocab-kaoyan.png";
import satImg from "@/assets/vocab-sat.png";
import greImg from "@/assets/vocab-gre.png";
import cet6Img from "@/assets/vocab-cet6.png";
import cet4Img from "@/assets/vocab-cet4.png";
import collegeImg from "@/assets/vocab-college.png";
import specialImg from "@/assets/vocab-special.png";
import highschoolImg from "@/assets/vocab-highschool.png";
import middleschoolImg from "@/assets/vocab-middleschool.png";
import elementaryImg from "@/assets/vocab-elementary.png";
import nceImg from "@/assets/vocab-nce.png";
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
    { id: "ielts", name: "雅思", count: getTotalWords("ielts"), image: ieltsImg },
    { id: "toefl", name: "托福", count: getTotalWords("toefl"), image: toeflImg },
    { id: "kaoyan", name: "考研", count: getTotalWords("kaoyan"), image: kaoyanImg },
    { id: "sat", name: "SAT", count: getTotalWords("sat"), image: satImg },
    { id: "gre", name: "GRE", count: getTotalWords("gre"), image: greImg },
    { id: "cet6", name: "六级", count: getTotalWords("cet6"), image: cet6Img },
    { id: "cet4", name: "四级", count: getTotalWords("cet4"), image: cet4Img },
    { id: "college", name: "大学", count: getTotalWords("college"), image: collegeImg },
    { id: "special", name: "专升本", count: getTotalWords("special"), image: specialImg },
    { id: "highschool", name: "高中", count: getTotalWords("highschool"), image: highschoolImg },
    { id: "middleschool", name: "初中", count: getTotalWords("middleschool"), image: middleschoolImg },
    { id: "elementary", name: "小学", count: getTotalWords("elementary"), image: elementaryImg },
    { id: "nce", name: "新概念英语", count: getTotalWords("nce"), image: nceImg },
  ];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 py-16 px-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            单词，是你通往流利的钥匙
          </h1>
          <p className="text-lg text-foreground/70">
            Every word unlocks your path to fluency.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Check-in Card */}
          <Card className="p-6 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">打卡记录</h2>
            
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
              <Card className="p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-5xl">📚</span>
                </div>
                <h3 className="text-xl font-bold mb-2">你学过的单词</h3>
                <p className="text-sm text-muted-foreground">{learnedCount}个单词</p>
              </Card>
            </Link>
            
            <Link to="/mistakes" className="h-full">
              <Card className="p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-xl font-bold mb-2">错题本</h3>
                <p className="text-sm text-muted-foreground">{mistakesCount}个单词</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Vocabulary Books Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">选择单词库</h2>
          
          <Tabs defaultValue="exam" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="exam" className="px-8">考试必背</TabsTrigger>
              <TabsTrigger value="life" className="px-8">生活实用</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exam">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vocabularyBooks.map((book) => (
                  <Link key={book.id} to={`/vocabulary/${book.id}`}>
                    <Card className="p-4 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-pointer overflow-hidden">
                      <div className="h-32 rounded-xl mb-4 overflow-hidden">
                        <img src={book.image} alt={book.name} className="w-full h-full object-cover" />
                      </div>
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
