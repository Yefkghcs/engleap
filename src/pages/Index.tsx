import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, User } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserEmail(user.email);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-accent/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-primary/15 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative py-6 px-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">EngLeap</h1>
          {isLoggedIn ? (
            <Button asChild variant="outline">
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {userEmail}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/auth">登录</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-primary font-medium">AI-Powered Language Learning</p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">Master Your English</h2>
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground">EngLeap你的一站式英语学习网站</p>
            <p className="text-xl text-muted-foreground">告别死记硬背，让我们帮你轻松掌握英语</p>
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
                <p>雅思、托福</p>
                <p>四六级、考研、高中</p>
                <p>办公、旅游实用单词</p>
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
                <p>日常英文Vlog精讲</p>
                <p>边看视频，边学日常表达</p>
                <p>每周更新</p>
              </div>
              <Button 
                disabled 
                size="lg"
                className="w-full cursor-not-allowed"
                variant="secondary"
              >
                敬请期待
              </Button>
            </div>
          </Card>

          {/* Reading Card */}
          <Card className="p-8 hover:shadow-md transition-all opacity-60">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-foreground">读文章</h3>
              <div className="space-y-2 text-center text-muted-foreground">
                <p>精读国外论坛文章</p>
                <p>学习最专业的</p>
                <p>写作技巧</p>
              </div>
              <Button 
                disabled 
                size="lg"
                className="w-full cursor-not-allowed"
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
