import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { getThisWeekCheckInDays, getWeekCheckInStatus, hasCheckedInToday } from "@/utils/checkInStorage";
import { getCustomVocabularies } from "@/utils/customVocabularyStorage";
import CreateVocabularyDialog from "@/components/CreateVocabularyDialog";
import { Trash2 } from "lucide-react";
import { deleteCustomVocabulary } from "@/utils/customVocabularyStorage";
import { useToast } from "@/hooks/use-toast";
import useWordCategoryStore from "@/models/wordCategory";
import { VOCABULARY_HOME_UI_MAP } from "@/utils/uiMap";
import useWordStore from "@/models/word";
import useUserInfo from "@/models/user";

const VocabularyHome = () => {
  const [customVocabularies, setCustomVocabularies] = useState(getCustomVocabularies());
  const { toast } = useToast();

  const getWordCategories = useWordCategoryStore((state) => state.getWordCategories);
  const categoryList = useWordCategoryStore((state) => state.categoryList);
  const getTotalData = useWordStore((state) => state.getTotalData);
  const totalData = useWordStore((state) => state.totalData);

  const checkStatus = useUserInfo((state) => state.checkStatus);
  const getCheckStatus = useUserInfo((state) => state.getCheckStatus);
  const totalCheckIns = checkStatus?.length || 0;
  const weekCheckIns = getThisWeekCheckInDays(checkStatus);
  const weekStatus = getWeekCheckInStatus(checkStatus);
  const checkedInToday = hasCheckedInToday(checkStatus);

  useEffect(() => {
    getWordCategories();
    getTotalData();
    getCheckStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCustomVocabularies(getCustomVocabularies());
  }, []);

  const handleDeleteCustomVocabulary = (id: string, name: string) => {
    if (confirm(`确定要删除「${name}」词库吗？`)) {
      deleteCustomVocabulary(id);
      setCustomVocabularies(getCustomVocabularies());
      toast({
        title: "删除成功",
        description: `已删除「${name}」词库`,
      });
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Gradient */}
      <div className="relative border-b bg-gradient-to-br from-background via-primary/5 to-background py-16 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 left-1/3 w-72 h-72 bg-secondary/25 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-12 w-64 h-64 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
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
          <Card className="p-5 h-full flex flex-col transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-foreground">打卡记录</h2>
            
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">本周已打卡</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold">{weekCheckIns}</span>
                  <span className="text-base text-muted-foreground">天</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                {weekDays.map((day, index) => (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <div 
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        weekStatus[index]
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {weekStatus[index] && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-muted-foreground">已累计打卡</span>
                  <span className="text-2xl font-bold">{totalCheckIns}</span>
                  <span className="text-base text-muted-foreground">天</span>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <div>{new Date().toLocaleDateString('zh-CN', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, '年').replace(/年(\d+)年/, '年$1月') + '日'}</div>
                  <div className="mt-0.5">{checkedInToday ? '今日已打卡' : '今日还未打卡'}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Word Records */}
          <div className="grid grid-cols-2 gap-6 h-full">
            <Link to="/vocabulary/learned" className="h-full">
              <Card className="p-6 hover:shadow-md transition-all cursor-pointer h-full flex flex-col overflow-hidden group">
                <div className="h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg mb-4 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/30 transition-colors">
                  <span className="text-5xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">你学过的单词</h3>
                <p className="text-sm text-muted-foreground">{totalData?.learned || 0}个单词</p>
              </Card>
            </Link>
            
            <Link to="/mistakes" className="h-full">
              <Card className="p-6 hover:shadow-md transition-all cursor-pointer h-full flex flex-col overflow-hidden group">
                <div className="h-32 bg-rose-50 dark:bg-rose-950/20 rounded-lg mb-4 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-950/30 transition-colors">
                  <span className="text-5xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">错题本</h3>
                <p className="text-sm text-muted-foreground">{totalData?.mistake || 0}个单词</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Vocabulary Books Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">选择单词库</h2>
          </div>

          {categoryList?.map?.((item) => (
            <div key={item?.category} className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">{item?.categoryName || ''}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {item?.subcategories?.map?.((book) => (
                  <Link key={book?.id} to={`/vocabulary/${book?.id || ''}`}>
                    <Card className="p-3 hover:shadow-md transition-all cursor-pointer overflow-hidden group">
                      <div className="h-20 bg-primary/5 dark:bg-primary/10 rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                        <span className="text-4xl">{VOCABULARY_HOME_UI_MAP?.[book?.id]?.emoji || '📑'}</span>
                      </div>
                      <h3 className="text-base font-bold mb-1 truncate">{book?.name || '词汇'}</h3>
                      {book?.total > 0 && <p className="text-xs text-muted-foreground">{book?.total}个单词</p>}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* 自定义单词库 */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">自定义单词库</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Create New Vocabulary Card */}
              <CreateVocabularyDialog onSuccess={() => setCustomVocabularies(getCustomVocabularies())}>
                <Card className="p-3 hover:shadow-md transition-all cursor-pointer overflow-hidden group border-dashed border-2 border-primary/30 hover:border-primary/50">
                  <div className="h-20 bg-primary/5 dark:bg-primary/10 rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                    <span className="text-4xl">➕</span>
                  </div>
                  <h3 className="text-base font-bold mb-1 text-primary truncate">创建单词库</h3>
                  <p className="text-xs text-muted-foreground">添加自定义单词</p>
                </Card>
              </CreateVocabularyDialog>

              {/* Existing Custom Vocabularies */}
              {customVocabularies.map((book) => (
                <div key={book.id} className="relative group">
                  <Link to={`/vocabulary/custom/${book.id}`}>
                    <Card className="p-3 hover:shadow-md transition-all cursor-pointer overflow-hidden">
                      <div className="h-20 bg-accent/50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-accent/70 transition-colors">
                        <span className="text-4xl">{book.emoji}</span>
                      </div>
                      <h3 className="text-base font-bold mb-1 truncate">{book.name}</h3>
                      <p className="text-xs text-muted-foreground">{book.words.length}个单词</p>
                    </Card>
                  </Link>
                  <button
                    onClick={() => handleDeleteCustomVocabulary(book.id, book.name)}
                    className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    title="删除词库"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHome;
