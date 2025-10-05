import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { saveCustomVocabulary, CustomWord } from "@/utils/customVocabularyStorage";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJI_LIST = ["📚", "✈️", "🏫", "🎯", "🌟", "⭐", "🏛️", "🎒", "📝", "🌱", "💡", "🎓", "🍔", "🏠", "👔", "💊", "🚗", "🏨", "🛒", "🎮", "💻", "💼", "💰", "🏥", "🌤️", "🏙️"];

interface CreateVocabularyDialogProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const CreateVocabularyDialog = ({ onSuccess, children }: CreateVocabularyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [wordsText, setWordsText] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!name.trim()) {
      toast({
        title: "请输入单词库名称",
        variant: "destructive",
      });
      return;
    }

    // Parse words from text
    const lines = wordsText.split('\n').filter(line => line.trim());
    const words: CustomWord[] = [];
    
    for (const line of lines) {
      const parts = line.split(/[,，\t]/).map(p => p.trim());
      if (parts.length >= 2) {
        words.push({
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          word: parts[0],
          meaning: parts[1],
          example: parts[2] || undefined,
          exampleCn: parts[3] || undefined,
        });
      }
    }

    if (words.length === 0) {
      toast({
        title: "请至少添加一个单词",
        description: "格式：单词,翻译（每行一个）",
        variant: "destructive",
      });
      return;
    }

    const vocabulary = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      emoji,
      words,
      createdAt: new Date().toISOString(),
    };

    saveCustomVocabulary(vocabulary);
    
    toast({
      title: "创建成功",
      description: `已创建包含 ${words.length} 个单词的词库`,
    });

    // Reset form
    setName("");
    setEmoji("📚");
    setWordsText("");
    setOpen(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            创建单词库
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建自定义单词库</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4" aria-describedby="dialog-description">
          <p id="dialog-description" className="sr-only">填写单词库信息并批量添加单词</p>
          <div className="space-y-2">
            <Label htmlFor="name">单词库名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：旅行英语"
            />
          </div>

          <div className="space-y-2">
            <Label>选择图标</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-2xl">
                  {emoji}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_LIST.map((e) => (
                    <button
                      key={e}
                      className="text-2xl p-2 hover:bg-accent rounded transition-colors"
                      onClick={() => setEmoji(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="words">批量添加单词</Label>
            <p className="text-sm text-muted-foreground">
              每行一个单词，格式：单词,翻译 或 单词,翻译,例句,例句翻译
            </p>
            <Textarea
              id="words"
              value={wordsText}
              onChange={(e) => setWordsText(e.target.value)}
              placeholder="示例：&#10;hello,你好&#10;world,世界&#10;travel,旅行,I love to travel,我喜欢旅行"
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>
              创建
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVocabularyDialog;
