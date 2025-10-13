import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Volume2, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scenes, Scene } from "@/data/sceneLearningData";

const SceneLearning = () => {
  const { sceneId } = useParams();
  const navigate = useNavigate();
  const [scene, setScene] = useState<Scene | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showWordTranslations, setShowWordTranslations] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const foundScene = scenes.find((s) => s.id === sceneId);
    if (foundScene) {
      setScene(foundScene);
      // Initialize all word translations as visible
      const initialState: Record<number, boolean> = {};
      foundScene.words.forEach((word) => {
        initialState[word.id] = true;
      });
      setShowWordTranslations(initialState);
    } else {
      navigate("/vocabulary");
    }
  }, [sceneId, navigate]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleWordTranslation = (wordId: number) => {
    setShowWordTranslations((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
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
              onClick={() => navigate("/vocabulary/scene/dictation/" + sceneId)}
              variant="outline"
              className="text-sm sm:text-base"
            >
              听写
            </Button>
            <Button
              onClick={() => navigate("/vocabulary/scene/challenge/" + sceneId)}
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
            <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {/* Placeholder for scene image with labeled words */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">{scene.emoji}</span>
                  <p className="text-sm text-muted-foreground">场景图片区域</p>
                </div>
              </div>
              
              {/* Word labels overlaid on image */}
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
            <button
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => playAudio(scene.description)}
            >
              <Eye className="w-4 h-4" />
              <span>查看图片详情</span>
            </button>
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

            <div className="space-y-4">
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
            </div>
          </Card>
        </div>

        {/* Words Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">场景单词</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scene.words.map((word) => (
              <Card key={word.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold">{word.word}</h4>
                      <button
                        onClick={() => playAudio(word.word)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{word.phonetic}</p>
                  </div>
                  <button
                    onClick={() => toggleWordTranslation(word.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showWordTranslations[word.id] ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {showWordTranslations[word.id] && (
                  <p className="text-sm text-foreground">{word.translation}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneLearning;
