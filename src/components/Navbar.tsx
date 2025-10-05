import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b bg-white/60 backdrop-blur-lg dark:bg-card/60 dark:border-border relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-primary">
            EngLeap
          </Link>
          
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              首页
            </Link>
            <Link
              to="/vocabulary"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/vocabulary") || location.pathname.startsWith("/vocabulary")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              背单词
            </Link>
            <Link
              to="/mistakes"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/mistakes") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              错题本
            </Link>
            
            {user ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                  isActive("/profile") ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                  isActive("/auth") ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span>登录</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
