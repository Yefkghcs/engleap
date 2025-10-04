import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b-2 border-primary/10 bg-card/60 backdrop-blur-lg dark:bg-card/30 dark:border-primary/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold italic text-primary hover:opacity-80 transition-opacity">
            EngLeap
          </Link>
          
          <div className="flex gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/") ? "text-primary font-semibold border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              首页
            </Link>
            <Link
              to="/vocabulary"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/vocabulary") || location.pathname.startsWith("/vocabulary")
                  ? "text-primary font-semibold border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              背单词
            </Link>
            <Link
              to="/mistakes"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                isActive("/mistakes") ? "text-primary font-semibold border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              错题本
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
