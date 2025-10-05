import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
type AuthMode = "login" | "register";
type AuthStep = "inviteCode" | "email" | "code" | "password";
const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("email");
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation states
  const [inviteCodeError, setInviteCodeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Code countdown
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle invite code verification
  const handleInviteCodeSubmit = async () => {
    setInviteCodeError("");
    if (!inviteCode) {
      setInviteCodeError("请输入邀请码");
      return;
    }
    if (inviteCode.length < 6) {
      setInviteCodeError("邀请码格式不正确");
      return;
    }
    setIsLoading(true);

    // Simulate API call to verify invite code
    setTimeout(() => {
      setIsLoading(false);
      // Simulate verification - you'll replace this with actual backend call
      const isValid = Math.random() > 0.3; // 70% success rate for demo

      if (isValid) {
        setStep("email");
        toast({
          title: "邀请码验证成功",
          description: "请继续填写您的邮箱"
        });
      } else {
        setInviteCodeError("邀请码无效或已被使用");
      }
    }, 1000);
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    setEmailError("");
    if (!email) {
      setEmailError("请输入邮箱地址");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("请输入有效的邮箱地址");
      return;
    }
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("code");
      setCountdown(60);
      setCanResend(false);
      toast({
        title: "验证码已发送",
        description: `验证码已发送至 ${email}`
      });
    }, 1000);
  };

  // Handle code verification
  const handleCodeSubmit = async () => {
    setCodeError("");
    if (!code) {
      setCodeError("请输入验证码");
      return;
    }
    if (code.length !== 6) {
      setCodeError("验证码应为6位数字");
      return;
    }
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate verification success/failure
      const isValid = Math.random() > 0.3; // 70% success rate for demo

      if (isValid) {
        if (mode === "login") {
          // Mock successful login
          localStorage.setItem("user", JSON.stringify({
            email,
            name: "用户"
          }));
          toast({
            title: "登录成功",
            description: "欢迎回来！"
          });
          navigate("/");
        } else {
          setStep("password");
          toast({
            title: "验证成功",
            description: "请设置您的密码"
          });
        }
      } else {
        setCodeError("验证码错误或已过期");
      }
    }, 1000);
  };

  // Handle password setup
  const handlePasswordSubmit = async () => {
    setPasswordError("");
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful registration
      localStorage.setItem("user", JSON.stringify({
        email,
        name: "用户"
      }));
      toast({
        title: "注册成功",
        description: "欢迎加入 EngLeap！"
      });
      navigate("/");
    }, 1000);
  };

  // Resend code
  const handleResendCode = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "验证码已重新发送",
        description: `验证码已发送至 ${email}`
      });
    }, 500);
  };

  // Reset form
  const resetForm = () => {
    setStep(mode === "register" ? "inviteCode" : "email");
    setInviteCode("");
    setEmail("");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setInviteCodeError("");
    setEmailError("");
    setCodeError("");
    setPasswordError("");
    setCountdown(0);
    setCanResend(true);
  };
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle>{mode === "login" ? "登录" : "注册"}</CardTitle>
            <div className="w-5" />
          </div>
          
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invite Code Step (Register only) */}
          {step === "inviteCode" && mode === "register" && <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">邀请码</Label>
                <p className="text-sm text-muted-foreground">
                  请输入您的邀请码以继续注册
                </p>
                <Input id="inviteCode" type="text" placeholder="输入邀请码" value={inviteCode} onChange={e => {
              setInviteCode(e.target.value);
              setInviteCodeError("");
            }} disabled={isLoading} className={inviteCodeError ? "border-destructive" : ""} />
                {inviteCodeError && <p className="text-sm text-destructive">{inviteCodeError}</p>}
              </div>
              <Button onClick={handleInviteCodeSubmit} disabled={isLoading || !inviteCode} className="w-full">
                {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    验证中...
                  </> : "验证邀请码"}
              </Button>
            </div>}

          {/* Email Step */}
          {step === "email" && <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => {
              setEmail(e.target.value);
              setEmailError("");
            }} disabled={isLoading} className={emailError ? "border-destructive" : ""} />
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>
              <Button onClick={handleEmailSubmit} disabled={isLoading || !email} className="w-full">
                {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    发送中...
                  </> : "获取验证码"}
              </Button>
            </div>}

          {/* Code Step */}
          {step === "code" && <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(mode === "register" && inviteCode ? "email" : "email")} className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回修改邮箱
              </Button>
              <div className="space-y-2">
                <Label htmlFor="code">验证码</Label>
                <p className="text-sm text-muted-foreground">
                  验证码已发送至 {email}
                </p>
                <Input id="code" type="text" placeholder="输入6位验证码" value={code} onChange={e => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setCodeError("");
            }} disabled={isLoading} maxLength={6} className={codeError ? "border-destructive" : ""} />
                {codeError && <p className="text-sm text-destructive">{codeError}</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCodeSubmit} disabled={isLoading || code.length !== 6} className="flex-1">
                  {isLoading ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      验证中...
                    </> : "验证"}
                </Button>
                <Button variant="outline" onClick={handleResendCode} disabled={!canResend}>
                  {canResend ? "重新发送" : `${countdown}s`}
                </Button>
              </div>
            </div>}

          {/* Password Step (Register only) */}
          {step === "password" && mode === "register" && <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">设置密码</Label>
                <Input id="password" type="password" placeholder="至少8位字符" value={password} onChange={e => {
              setPassword(e.target.value);
              setPasswordError("");
            }} disabled={isLoading} className={passwordError ? "border-destructive" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input id="confirmPassword" type="password" placeholder="再次输入密码" value={confirmPassword} onChange={e => {
              setConfirmPassword(e.target.value);
              setPasswordError("");
            }} disabled={isLoading} className={passwordError ? "border-destructive" : ""} />
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              </div>
              <Button onClick={handlePasswordSubmit} disabled={isLoading || !password || !confirmPassword} className="w-full">
                {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </> : "完成注册"}
              </Button>
            </div>}

          {/* Toggle mode */}
          <div className="text-center text-sm">
            <button onClick={toggleMode} className="text-primary hover:underline" disabled={isLoading}>
              {mode === "login" ? "没有账号？立即注册" : "已有账号？立即登录"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;