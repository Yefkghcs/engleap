import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginBtn = () => {
    return (
        <div className="flex items-center justify-center m-20">
            <Button asChild size="lg" className="w-96">
                <Link to="/auth" className="flex items-center justify-center gap-2">
                登录后查看
                </Link>
            </Button>
        </div>
    );
};

export default LoginBtn;