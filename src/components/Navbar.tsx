import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import useUserInfo from "@/models/user";

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const email = useUserInfo((state) => state.email);
  const getUserInfo = useUserInfo((state) => state.getUserInfo);

  useEffect(() => {
    getUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide navbar on learning pages
  const hiddenPaths = ['/learn', '/challenge', '/learn-cards'];
  const shouldHide = hiddenPaths.some(path => location.pathname.includes(path));
  
  if (shouldHide) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <nav className="fixed top-0 left-0 right-0 border-b bg-white/60 backdrop-blur-lg dark:bg-card/60 dark:border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">EngLeap 英语学习</Link>
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Link to="/" className={`text-xs sm:text-sm font-medium transition-all duration-200 hover:text-primary whitespace-nowrap ${isActive("/") ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              首页
            </Link>
            <Link to="/vocabulary" className={`text-xs sm:text-sm font-medium transition-all duration-200 hover:text-primary whitespace-nowrap ${isActive("/vocabulary") || location.pathname.startsWith("/vocabulary") ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              背单词
            </Link>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">切换主题</span>
            </Button>
            
            {email ? (
              <Link
                to="/profile"
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:text-primary whitespace-nowrap ${
                  isActive("/profile") ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
                title={email}
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden md:inline max-w-[120px] lg:max-w-[150px] xl:max-w-[200px] truncate">{email}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-200 hover:text-primary whitespace-nowrap ${
                  isActive("/auth") ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline">登录</span>
              </Link>)}
          </div>
        </div>
      </div>
    </nav>;
};
export default Navbar;