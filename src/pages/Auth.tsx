import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import fetch from "@/utils/fetch";
import useUserInfo from "@/models/user";

type AuthMode = "login" | "register";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [inviteCodeError, setInviteCodeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const updateUser = useUserInfo((state) => state.updateUser);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login
  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("请输入邮箱地址");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("请输入有效的邮箱地址");
      return;
    }
    if (!password) {
      setPasswordError("请输入密码");
      return;
    }

    setIsLoading(true);

    const res = await fetch('api/user/login', {
      method: 'POST',
      data: {
        email,
        password
      },
    });
    setIsLoading(false);

    if (res?.code === 200) {
      updateUser(res?.user?.email);
      // 登录成功
      toast({
        title: "登录成功",
        description: "欢迎使用 EngLeap！"
      });
      navigate("/");
    } else {
      toast({
        title: "操作异常",
        description: res?.message ||"请稍后重试",
      });
    }
  };

  // Handle register
  const handleRegister = async () => {
    setInviteCodeError("");
    setEmailError("");
    setPasswordError("");

    if (!inviteCode) {
      setInviteCodeError("请输入验证码");
      return;
    }
    if (!email) {
      setEmailError("请输入邮箱地址");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("请输入有效的邮箱地址");
      return;
    }
    if (!password) {
      setPasswordError("请输入密码");
      return;
    }
    if (password.length < 8) {
      setPasswordError("密码长度至少为8位");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("两次输入的密码不一致");
      return;
    }

    setIsLoading(true);

    const res = await fetch('api/user/register', {
      method: 'POST',
      data: {
        email,
        password,
        confirmPassword,
        verificationCode: inviteCode,
      },
    });
    setIsLoading(false);

    if (res?.code === 200) {
      updateUser(res?.user?.email);
      // 注册成功
      toast({
        title: "注册成功",
        description: "欢迎加入 EngLeap！"
      });
      navigate("/");
    } else {
      toast({
        title: "操作异常",
        description: res?.message || "请稍后重试"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setInviteCode("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setInviteCodeError("");
    setEmailError("");
    setPasswordError("");
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </div>
            <CardTitle>{mode === "login" ? "登录" : "注册"}</CardTitle>
            <div className="w-5" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Login Form */}
          {mode === "login" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  disabled={isLoading}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    忘记密码？
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isLoading}
                    className={passwordError ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </div>
              <Button
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录账号"
                )}
              </Button>
            </div>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">验证码</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="输入6位验证码"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setInviteCodeError("");
                  }}
                  disabled={isLoading}
                  maxLength={6}
                  className={inviteCodeError ? "border-destructive" : ""}
                />
                {inviteCodeError && <p className="text-sm text-destructive">{inviteCodeError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">邮箱地址</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  disabled={isLoading}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">设置密码</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="至少8位字符"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isLoading}
                    className={passwordError ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="再次输入密码"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isLoading}
                    className={passwordError ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </div>
              <Button
                onClick={handleRegister}
                disabled={isLoading || !inviteCode || !email || !password || !confirmPassword}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  "完成注册"
                )}
              </Button>
            </div>
          )}

          {/* Toggle mode */}
          <div className="text-center text-sm">
            <button
              onClick={toggleMode}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {mode === "login" ? "没有账号？立即注册" : "已有账号？立即登录"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;