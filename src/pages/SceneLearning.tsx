import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Volume2, Eye, EyeOff, ThumbsDown, ThumbsUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { scenes, Scene } from "@/data/sceneLearningData";

type WordStatus = "unmarked" | "known" | "unknown";

const SceneLearning = () => {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const [scene, setScene] = useState<Scene | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [wordStatuses, setWordStatuses] = useState<Record<number, WordStatus>>({});
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    const foundScene = scenes.find((s) => s.id === sceneId);
    if (foundScene) {
      setScene(foundScene);
    } else {
      navigate("/vocabulary");
    }
  }, [sceneId, navigate]);

  // Load word statuses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vocabulary_word_statuses');
    if (stored) {
      try {
        const statuses: Record<number, WordStatus> = JSON.parse(stored);
        setWordStatuses(statuses);
      } catch (e) {
        console.error('Failed to load word statuses:', e);
      }
    }
  }, []);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const updateWordStatus = (wordId: number, status: "known" | "unknown") => {
    setWordStatuses(prev => {
      const updated = { ...prev, [wordId]: status };
      localStorage.setItem('vocabulary_word_statuses', JSON.stringify(updated));
      return updated;
    });
  };

  const handleKnown = (wordId: number) => {
    updateWordStatus(wordId, "known");
  };

  const handleUnknown = (wordId: number) => {
    updateWordStatus(wordId, "unknown");
  };

  const convertToLearnFormat = () => {
    return scene!.words.map((word) => ({
      id: word.id,
      word: word.word,
      tags: word.tags,
      phonetic: word.phonetic,
      meaning: word.translation,
      example: word.example,
      exampleCn: word.exampleCn,
      status: "unmarked" as const,
    }));
  };

  const handleDictation = () => {
    const words = convertToLearnFormat();
    navigate(`/vocabulary/scene/dictation/${sceneId}`, { state: { words } });
  };

  const handleChallenge = () => {
    const words = convertToLearnFormat();
    navigate(`/vocabulary/scene/challenge/${sceneId}`, { state: { words } });
  };

  if (!scene) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {scene.emoji} {scene.name}
            </h1>
            <p className="text-sm text-muted-foreground">共{scene.totalWords}个单词</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDictation}
              variant="outline"
              className="text-sm sm:text-base"
            >
              听写
            </Button>
            <Button
              onClick={handleChallenge}
              className="text-sm sm:text-base"
            >
              挑战
            </Button>
          </div>
        </div>

        {/* Main Content - Image and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Scene Image */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">场景图片</h3>
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">{scene.emoji}</span>
                    <p className="text-sm text-muted-foreground">场景图片区域</p>
                  </div>
                </div>
                
                {scene.wordLabels.map((label, index) => (
                  <div
                    key={index}
                    className="absolute bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold border border-primary/20"
                    style={{
                      left: `${label.x}%`,
                      top: `${label.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {label.word}
                  </div>
                ))}
              </div>
            </div>
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
              <DialogTrigger asChild>
                <button className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">
                  <Eye className="w-4 h-4" />
                  <span>点击查看完整图片</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
                <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden min-h-[60vh]">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-8xl mb-4 block">{scene.emoji}</span>
                      <p className="text-sm text-muted-foreground">场景图片完整视图</p>
                    </div>
                  </div>
                  {scene.wordLabels.map((label, index) => (
                    <div
                      key={index}
                      className="absolute bg-background/90 backdrop-blur-sm px-3 py-2 rounded text-sm font-semibold border border-primary/20"
                      style={{
                        left: `${label.x}%`,
                        top: `${label.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {label.word}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Scene Description */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">场景描述</h3>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {showTranslation ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>隐藏翻译</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>显示翻译</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              {/* Main Description */}
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <p className="text-base leading-relaxed flex-1">{scene.description}</p>
                  <button
                    onClick={() => playAudio(scene.description)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                {showTranslation && (
                  <p className="text-sm text-muted-foreground pl-0">{scene.descriptionCn}</p>
                )}
              </div>

              {/* Example Sentences */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-muted-foreground">例句</h4>
                {scene.examples.map((example, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <p className="text-sm leading-relaxed flex-1">{example.en}</p>
                      <button
                        onClick={() => playAudio(example.en)}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {showTranslation && (
                      <p className="text-xs text-muted-foreground">{example.cn}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Words Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">场景单词</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scene.words.map((word) => (
              <Card key={word.id} className="p-4 hover:shadow-md transition-all">
                {/* Word Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold">{word.word}</h4>
                    <button
                      onClick={() => playAudio(word.word)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground">{word.phonetic}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {word.tags.map((tag, i) => (
                        <span key={i} className="bg-foreground text-background text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Translation */}
                {showTranslation && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">{word.translation}</p>
                  </div>
                )}

                {/* Example */}
                <div className="mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground font-semibold">例句</p>
                    <button 
                      onClick={() => playAudio(word.example)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed italic">{word.example}</p>
                  {showTranslation && (
                    <p className="text-xs text-muted-foreground">{word.exampleCn}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`flex-1 h-9 text-xs gap-1 transition-all ${
                      wordStatuses[word.id] === "unknown" 
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-sm" 
                        : "hover:border-red-300 hover:text-red-600"
                    }`}
                    onClick={() => handleUnknown(word.id)}
                  >
                    <ThumbsDown className="h-3 w-3" />
                    不认识
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`flex-1 h-9 text-xs gap-1 transition-all ${
                      wordStatuses[word.id] === "known" 
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 shadow-sm" 
                        : "hover:border-green-300 hover:text-green-600"
                    }`}
                    onClick={() => handleKnown(word.id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    认识
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneLearning;
