import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "已退出登录",
      description: "您已成功退出账号",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>账号信息</CardTitle>
              <CardDescription>查看和管理您的个人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">用户名</p>
                    <p className="text-sm">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">邮箱地址</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>账号操作</CardTitle>
              <CardDescription>管理您的账号设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/change-password")}
              >
                修改密码
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "功能开发中",
                    description: "修改个人信息功能即将上线",
                  });
                }}
              >
                编辑个人信息
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>学习统计</CardTitle>
              <CardDescription>您的学习进度和成就</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">已学单词</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">连续天数</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">挑战完成</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
