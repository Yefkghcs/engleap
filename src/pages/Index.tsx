import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
const Index = () => {
  return <>
      <Navbar />
      
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-accent/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '2s'
        }} />
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary/15 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }} />
        </div>

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-primary font-medium">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite] bg-clip-text text-transparent">AI-Powered English Learning, Made Simple and Effective</span>
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">更聪明的英语学习网站</h2>
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground">EngLeap你的一站式英语学习网站，为你打造高效、系统的外语学习体验</p>
            <p className="text-xl text-muted-foreground">从词汇到表达，让学习更有方法、更见成效</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vocabulary Card */}
          <Card className="p-8 hover:shadow-md transition-all">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-foreground">背单词</h3>
              <div className="space-y-2 text-center text-muted-foreground">
                <p>覆盖雅思、托福、四六级</p>
                <p>工作、日常实用词汇</p>
                <p>让你真正记得住、用得出</p>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link to="/vocabulary" className="flex items-center justify-center gap-2">
                  Start <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Video Card */}
          <Card className="p-8 hover:shadow-md transition-all opacity-60">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-foreground">看视频</h3>
              <div className="space-y-2 text-center text-muted-foreground">
                <p>英文Vlog精讲</p>
                <p>真实语境沉浸学习</p>
                <p>帮助你听懂、模仿、自然表达</p>
              </div>
              <Button disabled size="lg" className="w-full cursor-not-allowed" variant="secondary">
                敬请期待
              </Button>
            </div>
          </Card>

          {/* Reading Card */}
          <Card className="p-8 hover:shadow-md transition-all opacity-60">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-foreground">读文章</h3>
              <div className="space-y-2 text-center text-muted-foreground">
                <p>每周更新</p>
                <p>精读国外论坛文章，提升写作</p>
                <p>学习语言技巧与思维方式</p>
              </div>
              <Button disabled size="lg" className="w-full cursor-not-allowed" variant="secondary">
                敬请期待
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>;
};
export default Index;