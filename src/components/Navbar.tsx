import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-foreground">
            EngLeap
          </Link>
          
          <div className="flex gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              首页
            </Link>
            <Link 
              to="/vocabulary" 
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname.startsWith("/vocabulary") ? "text-foreground underline underline-offset-4" : "text-muted-foreground"
              }`}
            >
              背单词
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
