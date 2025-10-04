import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eraser, RotateCcw, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HandwritingInputProps {
  onRecognized: (text: string) => void;
  disabled?: boolean;
}

export const HandwritingInput = ({ onRecognized, disabled }: HandwritingInputProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Set drawing style
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    updateCanvasSize();
    setContext(ctx);

    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || !context) return;
    
    setIsDrawing(true);
    setHasDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || !context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const recognizeHandwriting = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;

    setIsRecognizing(true);

    try {
      // Convert canvas to base64
      const imageData = canvas.toDataURL("image/png");
      
      // Call edge function to recognize handwriting
      const { data, error } = await supabase.functions.invoke("recognize-handwriting", {
        body: { image: imageData }
      });

      if (error) throw error;

      if (data?.text) {
        onRecognized(data.text);
        clearCanvas();
        toast({
          title: "识别成功",
          description: `识别结果: ${data.text}`,
        });
      } else {
        toast({
          title: "识别失败",
          description: "无法识别手写内容，请重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error recognizing handwriting:", error);
      toast({
        title: "识别错误",
        description: error instanceof Error ? error.message : "识别过程出错",
        variant: "destructive",
      });
    } finally {
      setIsRecognizing(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        在下方画板上手写单词
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-48 border-2 border-border rounded-lg bg-white dark:bg-gray-950 touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          disabled={!hasDrawing || disabled || isRecognizing}
        >
          <Eraser className="w-4 h-4 mr-2" />
          清空
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          disabled={!hasDrawing || disabled || isRecognizing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          重写
        </Button>

        <Button
          size="sm"
          onClick={recognizeHandwriting}
          disabled={!hasDrawing || disabled || isRecognizing}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          {isRecognizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              识别中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              识别
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};