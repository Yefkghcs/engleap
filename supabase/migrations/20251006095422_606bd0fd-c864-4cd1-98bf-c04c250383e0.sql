-- Create vocabulary categories table
CREATE TABLE IF NOT EXISTS public.vocabulary_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create vocabulary words table
CREATE TABLE IF NOT EXISTS public.vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.vocabulary_categories(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  meaning TEXT NOT NULL,
  example TEXT,
  example_cn TEXT,
  collocations TEXT[],
  ai_generated BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_vocabulary_words_category ON public.vocabulary_words(category_id);
CREATE INDEX idx_vocabulary_words_word ON public.vocabulary_words(word);

-- Enable RLS
ALTER TABLE public.vocabulary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Everyone can read vocabulary categories"
  ON public.vocabulary_categories FOR SELECT
  USING (true);

CREATE POLICY "Everyone can read vocabulary words"
  ON public.vocabulary_words FOR SELECT
  USING (true);

-- Admin policies (you can customize based on your auth needs)
CREATE POLICY "Admins can insert categories"
  ON public.vocabulary_categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update categories"
  ON public.vocabulary_categories FOR UPDATE
  USING (true);

CREATE POLICY "Admins can insert words"
  ON public.vocabulary_words FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update words"
  ON public.vocabulary_words FOR UPDATE
  USING (true);

-- Create function to update word count
CREATE OR REPLACE FUNCTION update_category_word_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vocabulary_categories
  SET word_count = (
    SELECT COUNT(*) FROM public.vocabulary_words
    WHERE category_id = COALESCE(NEW.category_id, OLD.category_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.category_id, OLD.category_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update word count
CREATE TRIGGER trigger_update_word_count
AFTER INSERT OR UPDATE OR DELETE ON public.vocabulary_words
FOR EACH ROW
EXECUTE FUNCTION update_category_word_count();

-- Insert initial categories
INSERT INTO public.vocabulary_categories (name, emoji) VALUES
  ('雅思', '🎓'),
  ('托福', '📚'),
  ('考研', '📖'),
  ('SAT', '✏️'),
  ('GRE', '🎯'),
  ('六级', '🔷'),
  ('四级', '🔶'),
  ('大学', '🏫'),
  ('专升本', '📈'),
  ('高中', '🎒'),
  ('初中', '📝'),
  ('小学', '🌟'),
  ('新概念英语', '📘')
ON CONFLICT (name) DO NOTHING;