import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-4 bg-white/20 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EngLeap</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-primary font-medium">AI-Powered Language Learning</p>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Master Your English</h2>
          <div className="space-y-2">
            <p className="text-xl text-foreground/80">EngLeap你的一站式英语学习网站</p>
            <p className="text-xl text-foreground/80">告别死记硬背，让我们帮你轻松掌握英语</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vocabulary Card */}
          <Card className="p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">背单词</h3>
              <div className="space-y-2 text-center text-foreground/70">
                <p>雅思、托福</p>
                <p>四六级、考研、高中</p>
                <p>办公、旅游实用单词</p>
              </div>
              <Button asChild className="w-full rounded-full py-6 text-lg shadow-lg">
                <Link to="/vocabulary" className="flex items-center justify-center gap-2">
                  Start <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Video Card */}
          <Card className="p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 opacity-60">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center">看视频</h3>
              <div className="space-y-2 text-center text-foreground/70">
                <p>日常英文Vlog精讲</p>
                <p>边看视频，边学日常表达</p>
                <p>每周更新</p>
              </div>
              <Button 
                disabled 
                className="w-full rounded-full py-6 text-lg cursor-not-allowed"
                variant="secondary"
              >
                敬请期待
              </Button>
            </div>
          </Card>

          {/* Reading Card */}
          <Card className="p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 opacity-60">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center">读文章</h3>
              <div className="space-y-2 text-center text-foreground/70">
                <p>精读国外论坛文章</p>
                <p>学习最专业的</p>
                <p>写作技巧</p>
              </div>
              <Button 
                disabled 
                className="w-full rounded-full py-6 text-lg cursor-not-allowed"
                variant="secondary"
              >
                敬请期待
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
