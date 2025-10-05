import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("请输入当前密码");
      return;
    }
    if (!newPassword) {
      setPasswordError("请输入新密码");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("新密码长度至少为8位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("两次输入的密码不一致");
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError("新密码不能与当前密码相同");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "密码修改成功",
        description: "您的密码已成功修改"
      });
      navigate("/profile");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link to="/profile" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle>修改密码</CardTitle>
            <div className="w-5" />
          </div>
          <CardDescription>
            请输入当前密码和新密码
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="输入当前密码"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError("");
              }}
              disabled={isLoading}
              className={passwordError && !currentPassword ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="至少8位字符"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
              disabled={isLoading}
              className={passwordError && !newPassword ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="再次输入新密码"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              disabled={isLoading}
              className={passwordError && confirmPassword ? "border-destructive" : ""}
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                修改中...
              </>
            ) : (
              "确认修改"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
