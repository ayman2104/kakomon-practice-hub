-- Java言語Ⅰ random question seed
-- Run this in Lovable Cloud / Supabase SQL Editor
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_round text;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS answer_slots_json jsonb DEFAULT '["A"]'::jsonb;

DO $$
DECLARE
  c_id uuid;
BEGIN
  INSERT INTO courses (id, slug, title, description, created_at)
  VALUES (gen_random_uuid(), 'java-language-1', 'Java言語Ⅰ', 'Java言語Ⅰの基本文法、条件分岐、繰り返し、配列、クラス、メソッド、継承、カプセル化、抽象クラスを練習します。', now())
  ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title, description = EXCLUDED.description
  RETURNING id INTO c_id;

  DELETE FROM questions
  WHERE course_id = c_id
    AND question_type = 'random_multiple_choice';

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaプログラムの実行開始位置として正しいものはどれですか？', NULL, '[{"key": "1", "text": "mainメソッド"}, {"key": "2", "text": "constructorメソッド"}, {"key": "3", "text": "package文"}, {"key": "4", "text": "import文"}]'::jsonb, '{"A": "1"}'::jsonb, 'Javaアプリケーションは通常 public static void main(String[] args) から実行が始まります。', 'Javaの基本', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '画面に文字列を出力する命令として正しいものはどれですか？', NULL, '[{"key": "1", "text": "System.in.println"}, {"key": "2", "text": "System.out.println"}, {"key": "3", "text": "print.System.out"}, {"key": "4", "text": "Console.readLine"}]'::jsonb, '{"A": "2"}'::jsonb, 'System.out.println は標準出力に文字列などを出力して改行します。', 'Javaの基本', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaのソースファイルの拡張子として正しいものはどれですか？', NULL, '[{"key": "1", "text": ".class"}, {"key": "2", "text": ".java"}, {"key": "3", "text": ".exe"}, {"key": "4", "text": ".javac"}]'::jsonb, '{"A": "2"}'::jsonb, 'Javaのソースファイルは .java、コンパイル後のバイトコードは .class です。', 'Javaの基本', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaのコンパイルで主に使うコマンドはどれですか？', NULL, '[{"key": "1", "text": "java"}, {"key": "2", "text": "javac"}, {"key": "3", "text": "jvm"}, {"key": "4", "text": "javadoc"}]'::jsonb, '{"A": "2"}'::jsonb, 'javac は Java compiler で、.java ファイルを .class に変換します。', 'Javaの基本', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '整数を扱う基本データ型として適切なものはどれですか？', NULL, '[{"key": "1", "text": "String"}, {"key": "2", "text": "boolean"}, {"key": "3", "text": "int"}, {"key": "4", "text": "double[]"}]'::jsonb, '{"A": "3"}'::jsonb, 'int は整数を扱う基本データ型です。', '変数', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のうち、Javaの変数名として使えないものはどれですか？', NULL, '[{"key": "1", "text": "score"}, {"key": "2", "text": "userName"}, {"key": "3", "text": "2value"}, {"key": "4", "text": "total_count"}]'::jsonb, '{"A": "3"}'::jsonb, '変数名は数字から始めることができません。', '変数', 'medium', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '式 7 / 2 の結果として正しいものはどれですか？', NULL, '[{"key": "1", "text": "3"}, {"key": "2", "text": "3.5"}, {"key": "3", "text": "4"}, {"key": "4", "text": "2"}]'::jsonb, '{"A": "1"}'::jsonb, 'int同士の割り算では小数部が切り捨てられ、7 / 2 は 3 になります。', '演算子', 'medium', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '式 7 % 2 の結果として正しいものはどれですか？', NULL, '[{"key": "1", "text": "1"}, {"key": "2", "text": "2"}, {"key": "3", "text": "3"}, {"key": "4", "text": "3.5"}]'::jsonb, '{"A": "1"}'::jsonb, '% は剰余演算子で、7を2で割った余りは1です。', '演算子', 'medium', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'double型の値をint型へ変換する場合に必要になることが多いものはどれですか？', NULL, '[{"key": "1", "text": "キャスト"}, {"key": "2", "text": "import"}, {"key": "3", "text": "extends"}, {"key": "4", "text": "override"}]'::jsonb, '{"A": "1"}'::jsonb, 'doubleからintへは情報が失われる可能性があるため、明示的なキャストが必要です。', '型変換', 'medium', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '文字列を表す型として正しいものはどれですか？', NULL, '[{"key": "1", "text": "char"}, {"key": "2", "text": "String"}, {"key": "3", "text": "boolean"}, {"key": "4", "text": "float"}]'::jsonb, '{"A": "2"}'::jsonb, 'Javaで文字列を扱う代表的な型は String です。', '文字列', 'medium', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'boolean型に代入できる値として正しいものはどれですか？', NULL, '[{"key": "1", "text": "0と1"}, {"key": "2", "text": "yesとno"}, {"key": "3", "text": "trueとfalse"}, {"key": "4", "text": "onとoff"}]'::jsonb, '{"A": "3"}'::jsonb, 'boolean型は true または false の真偽値を扱います。', 'boolean', 'easy', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の式の結果として正しいものはどれですか？', 'int a = 3;
int b = ++a + 3;
System.out.println(b);', '[{"key": "1", "text": "6"}, {"key": "2", "text": "7"}, {"key": "3", "text": "8"}, {"key": "4", "text": "9"}]'::jsonb, '{"A": "2"}'::jsonb, '前置インクリメントは先に値を増やしてから使用します。', '演算子', 'hard', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の出力として正しいものはどれですか？', 'System.out.println("1" + 2);', '[{"key": "1", "text": "12"}, {"key": "2", "text": "3"}, {"key": "3", "text": "1 + 2"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}'::jsonb, '文字列と数値を + で結合すると、数値は文字列として連結されます。', '文字列', 'hard', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'ローカル変数について正しい説明はどれですか？', NULL, '[{"key": "1", "text": "自動的に0で初期化される"}, {"key": "2", "text": "使う前に初期化が必要である"}, {"key": "3", "text": "必ずstaticを付ける"}, {"key": "4", "text": "クラスの外に書く"}]'::jsonb, '{"A": "2"}'::jsonb, 'ローカル変数は自動初期化されないため、使用前に値を代入する必要があります。', '変数', 'hard', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'public class Sample が定義されている場合、通常のソースファイル名として正しいものはどれですか？', NULL, '[{"key": "1", "text": "sample.java"}, {"key": "2", "text": "Sample.java"}, {"key": "3", "text": "Main.java"}, {"key": "4", "text": "Sample.class"}]'::jsonb, '{"A": "2"}'::jsonb, 'publicクラス名とソースファイル名は大文字小文字も含めて一致させます。', 'Javaの基本', 'hard', '第1回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '条件によって処理を分ける文として正しいものはどれですか？', NULL, '[{"key": "1", "text": "if文"}, {"key": "2", "text": "for文"}, {"key": "3", "text": "class文"}, {"key": "4", "text": "import文"}]'::jsonb, '{"A": "1"}'::jsonb, 'if文は条件式の結果により処理を分岐します。', '条件分岐', 'easy', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'if文の条件式に入る型として適切なものはどれですか？', NULL, '[{"key": "1", "text": "int"}, {"key": "2", "text": "String"}, {"key": "3", "text": "boolean"}, {"key": "4", "text": "double"}]'::jsonb, '{"A": "3"}'::jsonb, 'Javaのif文の条件式はboolean型の式である必要があります。', '条件分岐', 'easy', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '決まった回数の繰り返しに使いやすい文はどれですか？', NULL, '[{"key": "1", "text": "switch"}, {"key": "2", "text": "for"}, {"key": "3", "text": "class"}, {"key": "4", "text": "return"}]'::jsonb, '{"A": "2"}'::jsonb, 'for文は初期化、条件、更新をまとめて書けるため回数が決まった繰り返しに向いています。', '繰り返し', 'easy', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'while文について正しい説明はどれですか？', NULL, '[{"key": "1", "text": "条件がtrueの間繰り返す"}, {"key": "2", "text": "必ず1回だけ実行する"}, {"key": "3", "text": "配列専用である"}, {"key": "4", "text": "条件式が不要である"}]'::jsonb, '{"A": "1"}'::jsonb, 'while文は条件式がtrueの間、処理を繰り返します。', '繰り返し', 'easy', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'int型の配列を作る文として正しいものはどれですか？', NULL, '[{"key": "1", "text": "int scores = new int[3];"}, {"key": "2", "text": "int[] scores = new int[3];"}, {"key": "3", "text": "scores int[] = new int;"}, {"key": "4", "text": "int scores[] = int[3];"}]'::jsonb, '{"A": "2"}'::jsonb, 'int[] scores = new int[3]; のように配列型を宣言します。', '配列', 'easy', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'switch文の各caseの最後に書くことが多い文はどれですか？', NULL, '[{"key": "1", "text": "continue"}, {"key": "2", "text": "break"}, {"key": "3", "text": "extends"}, {"key": "4", "text": "new"}]'::jsonb, '{"A": "2"}'::jsonb, 'breakを書かないと次のcaseへ処理が続くことがあります。', '条件分岐', 'medium', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '配列 array の要素数を取得する書き方として正しいものはどれですか？', NULL, '[{"key": "1", "text": "array.size()"}, {"key": "2", "text": "array.length"}, {"key": "3", "text": "array.length()"}, {"key": "4", "text": "length(array)"}]'::jsonb, '{"A": "2"}'::jsonb, 'Javaの配列の要素数は length フィールドで取得します。', '配列', 'medium', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の出力として正しいものはどれですか？', 'for (int i = 0; i < 3; i++) {
  System.out.print(i);
}', '[{"key": "1", "text": "012"}, {"key": "2", "text": "123"}, {"key": "3", "text": "01"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}'::jsonb, 'iは0,1,2の3回表示されます。', '繰り返し', 'medium', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'continue文の説明として正しいものはどれですか？', NULL, '[{"key": "1", "text": "繰り返しを完全に終了する"}, {"key": "2", "text": "現在の回の残りを飛ばして次の繰り返しへ進む"}, {"key": "3", "text": "メソッドを終了する"}, {"key": "4", "text": "例外を投げる"}]'::jsonb, '{"A": "2"}'::jsonb, 'continueは現在の反復の残りをスキップし、次の反復に進みます。', '繰り返し', 'medium', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '配列の添字について正しいものはどれですか？', NULL, '[{"key": "1", "text": "1から始まる"}, {"key": "2", "text": "0から始まる"}, {"key": "3", "text": "配列ごとに自由に決まる"}, {"key": "4", "text": "負の値から始まる"}]'::jsonb, '{"A": "2"}'::jsonb, 'Javaの配列添字は0から始まります。', '配列', 'medium', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の出力として正しいものはどれですか？', 'int x = 5;
if (x > 5) {
  System.out.print("A");
} else {
  System.out.print("B");
}', '[{"key": "1", "text": "A"}, {"key": "2", "text": "B"}, {"key": "3", "text": "AB"}, {"key": "4", "text": "何も出ない"}]'::jsonb, '{"A": "2"}'::jsonb, 'x > 5 はfalseなので else 側のBが表示されます。', '条件分岐', 'hard', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のコードについて正しい説明はどれですか？', 'int[] a = new int[3];
System.out.println(a[3]);', '[{"key": "1", "text": "正常に3を表示する"}, {"key": "2", "text": "正常に0を表示する"}, {"key": "3", "text": "実行時エラーになる"}, {"key": "4", "text": "コンパイルエラーになる"}]'::jsonb, '{"A": "3"}'::jsonb, '要素数3の配列で使える添字は0〜2です。a[3]は範囲外です。', '配列', 'hard', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'do-while文について正しい説明はどれですか？', NULL, '[{"key": "1", "text": "条件に関係なく最低1回は実行される"}, {"key": "2", "text": "条件式を書けない"}, {"key": "3", "text": "配列専用の文である"}, {"key": "4", "text": "必ず無限ループになる"}]'::jsonb, '{"A": "1"}'::jsonb, 'do-while文は処理後に条件判定するため最低1回は実行されます。', '繰り返し', 'hard', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'else if を使う目的として最も適切なものはどれですか？', NULL, '[{"key": "1", "text": "複数条件を順番に判定する"}, {"key": "2", "text": "配列を作る"}, {"key": "3", "text": "クラスを継承する"}, {"key": "4", "text": "例外を処理する"}]'::jsonb, '{"A": "1"}'::jsonb, 'else if を使うと複数の条件を上から順番に判定できます。', '条件分岐', 'hard', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '拡張for文で配列の要素を順番に取り出す書き方として正しいものはどれですか？', NULL, '[{"key": "1", "text": "for (int x : array)"}, {"key": "2", "text": "for (array : int x)"}, {"key": "3", "text": "foreach int x in array"}, {"key": "4", "text": "for int x array"}]'::jsonb, '{"A": "1"}'::jsonb, '拡張for文は for (型 変数 : 配列) の形で書きます。', '配列', 'hard', '第2回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オブジェクトの設計図にあたるものはどれですか？', NULL, '[{"key": "1", "text": "クラス"}, {"key": "2", "text": "配列"}, {"key": "3", "text": "条件式"}, {"key": "4", "text": "コメント"}]'::jsonb, '{"A": "1"}'::jsonb, 'クラスはオブジェクトの構造や振る舞いを定義する設計図です。', 'クラス', 'easy', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '値を返さないメソッドの戻り値型として使うものはどれですか？', NULL, '[{"key": "1", "text": "null"}, {"key": "2", "text": "void"}, {"key": "3", "text": "empty"}, {"key": "4", "text": "return"}]'::jsonb, '{"A": "2"}'::jsonb, '戻り値がないメソッドは void を指定します。', 'メソッド', 'easy', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'メソッドを終了し、値を返すときに使う文はどれですか？', NULL, '[{"key": "1", "text": "break"}, {"key": "2", "text": "continue"}, {"key": "3", "text": "return"}, {"key": "4", "text": "new"}]'::jsonb, '{"A": "3"}'::jsonb, 'return文はメソッドを終了し、必要に応じて値を返します。', 'メソッド', 'easy', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オブジェクトを生成するときに使うキーワードはどれですか？', NULL, '[{"key": "1", "text": "new"}, {"key": "2", "text": "this"}, {"key": "3", "text": "class"}, {"key": "4", "text": "void"}]'::jsonb, '{"A": "1"}'::jsonb, 'new を使ってクラスのインスタンスを生成します。', 'クラス', 'easy', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'メソッドの引数について正しい説明はどれですか？', NULL, '[{"key": "1", "text": "メソッドに渡す値である"}, {"key": "2", "text": "必ずString型である"}, {"key": "3", "text": "戻り値と同じ意味である"}, {"key": "4", "text": "クラス名と同じである"}]'::jsonb, '{"A": "1"}'::jsonb, '引数はメソッドに渡される値です。', 'メソッド', 'medium', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'フィールドについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "クラス内で宣言される変数"}, {"key": "2", "text": "必ずmain内で宣言される変数"}, {"key": "3", "text": "配列だけを指す"}, {"key": "4", "text": "戻り値のこと"}]'::jsonb, '{"A": "1"}'::jsonb, 'フィールドはクラスの中に宣言される変数で、オブジェクトの状態を表します。', 'クラス', 'medium', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'コンストラクタについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "戻り値型voidを必ず書く"}, {"key": "2", "text": "クラス名と同じ名前にする"}, {"key": "3", "text": "必ずstaticにする"}, {"key": "4", "text": "配列を作るためだけに使う"}]'::jsonb, '{"A": "2"}'::jsonb, 'コンストラクタはクラス名と同じ名前で、オブジェクト生成時に呼ばれます。', 'コンストラクタ', 'medium', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'staticメソッドから直接参照できるものとして適切なのはどれですか？', NULL, '[{"key": "1", "text": "インスタンスフィールドのみ"}, {"key": "2", "text": "staticフィールド"}, {"key": "3", "text": "すべてのprivateフィールド"}, {"key": "4", "text": "ローカル変数だけ"}]'::jsonb, '{"A": "2"}'::jsonb, 'staticメソッドからは同じクラスのstaticメンバを直接参照できます。', 'static', 'medium', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'this が表すものとして正しいものはどれですか？', NULL, '[{"key": "1", "text": "現在のオブジェクト自身"}, {"key": "2", "text": "親クラス"}, {"key": "3", "text": "配列の長さ"}, {"key": "4", "text": "戻り値"}]'::jsonb, '{"A": "1"}'::jsonb, 'thisは現在処理中のオブジェクト自身を表します。', 'クラス', 'medium', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '同じ名前で引数の型や数が異なるメソッドを定義することを何といいますか？', NULL, '[{"key": "1", "text": "オーバーロード"}, {"key": "2", "text": "オーバーライド"}, {"key": "3", "text": "カプセル化"}, {"key": "4", "text": "継承"}]'::jsonb, '{"A": "1"}'::jsonb, '同名で引数が異なるメソッドを複数定義することをオーバーロードといいます。', 'メソッド', 'hard', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のコードがコンパイルエラーになる理由として正しいものはどれですか？', 'class Sample {
  String id = "No";
  static int serial = 0;
  public static void main(String[] args) {
    System.out.println(id + serial);
  }
}', '[{"key": "1", "text": "idがstaticではないから"}, {"key": "2", "text": "serialがstaticだから"}, {"key": "3", "text": "printlnが使えないから"}, {"key": "4", "text": "Stringが使えないから"}]'::jsonb, '{"A": "1"}'::jsonb, 'mainはstaticメソッドなので、非staticフィールドidを直接参照できません。', 'static', 'hard', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のコードがコンパイルエラーになる理由として正しいものはどれですか？', 'boolean judge;
if (judge) {
  System.out.println("OK");
}', '[{"key": "1", "text": "judgeが初期化されていないから"}, {"key": "2", "text": "boolean型が使えないから"}, {"key": "3", "text": "if文が使えないから"}, {"key": "4", "text": "elseが不要だから"}]'::jsonb, '{"A": "1"}'::jsonb, 'ローカル変数judgeは自動初期化されないため、使用前に初期化が必要です。', 'ローカル変数', 'hard', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'コンストラクタを1つも定義しない場合について正しいものはどれですか？', NULL, '[{"key": "1", "text": "デフォルトコンストラクタが自動で用意される"}, {"key": "2", "text": "必ずコンパイルエラーになる"}, {"key": "3", "text": "mainメソッドが消える"}, {"key": "4", "text": "フィールドが使えなくなる"}]'::jsonb, '{"A": "1"}'::jsonb, '明示的なコンストラクタがない場合、引数なしのデフォルトコンストラクタが用意されます。', 'コンストラクタ', 'hard', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '戻り値型が違うだけで同じ名前・同じ引数のメソッドを複数定義できるか？', NULL, '[{"key": "1", "text": "できる"}, {"key": "2", "text": "できない"}, {"key": "3", "text": "privateならできる"}, {"key": "4", "text": "staticならできる"}]'::jsonb, '{"A": "2"}'::jsonb, 'オーバーロードは引数リストで区別されるため、戻り値型だけの違いでは定義できません。', 'メソッド', 'hard', '第3回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オブジェクト指向で、データと処理をまとめたものはどれですか？', NULL, '[{"key": "1", "text": "オブジェクト"}, {"key": "2", "text": "演算子"}, {"key": "3", "text": "条件式"}, {"key": "4", "text": "コメント"}]'::jsonb, '{"A": "1"}'::jsonb, 'オブジェクトは状態（データ）と振る舞い（処理）を持ちます。', 'オブジェクト指向', 'easy', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'クラスから生成された実体を何といいますか？', NULL, '[{"key": "1", "text": "インスタンス"}, {"key": "2", "text": "パッケージ"}, {"key": "3", "text": "コンパイラ"}, {"key": "4", "text": "配列長"}]'::jsonb, '{"A": "1"}'::jsonb, 'クラスから作られた具体的なオブジェクトをインスタンスといいます。', 'インスタンス', 'easy', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaのオブジェクト型変数が保持するものとして適切なのはどれですか？', NULL, '[{"key": "1", "text": "オブジェクトへの参照"}, {"key": "2", "text": "必ず数値そのもの"}, {"key": "3", "text": "ファイル名"}, {"key": "4", "text": "メソッド名だけ"}]'::jsonb, '{"A": "1"}'::jsonb, 'オブジェクト型変数はオブジェクトへの参照を保持します。', '参照', 'easy', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '参照型変数が何も参照していないことを表す値はどれですか？', NULL, '[{"key": "1", "text": "void"}, {"key": "2", "text": "null"}, {"key": "3", "text": "false"}, {"key": "4", "text": "0.0"}]'::jsonb, '{"A": "2"}'::jsonb, 'nullは参照先がないことを表します。', 'null', 'easy', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'インスタンスフィールドについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "各オブジェクトごとに値を持つ"}, {"key": "2", "text": "クラス全体で必ず1つだけ持つ"}, {"key": "3", "text": "main内でだけ使える"}, {"key": "4", "text": "必ずfinalである"}]'::jsonb, '{"A": "1"}'::jsonb, 'インスタンスフィールドは生成されたオブジェクトごとに値を持ちます。', 'インスタンス', 'medium', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'staticフィールドについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "クラス全体で共有される"}, {"key": "2", "text": "オブジェクトごとに必ず別々"}, {"key": "3", "text": "ローカル変数の一種"}, {"key": "4", "text": "配列専用である"}]'::jsonb, '{"A": "1"}'::jsonb, 'staticフィールドはクラスに属し、全インスタンスで共有されます。', 'static', 'medium', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '2つの参照変数が同じオブジェクトを参照している場合、片方でフィールドを変更するとどうなりますか？', NULL, '[{"key": "1", "text": "もう片方から見ても変更後の値になる"}, {"key": "2", "text": "もう片方は必ずnullになる"}, {"key": "3", "text": "コンパイルエラーになる"}, {"key": "4", "text": "元の値に戻る"}]'::jsonb, '{"A": "1"}'::jsonb, '同じオブジェクトを参照しているため、変更は共有されて見えます。', '参照', 'medium', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'newで生成したオブジェクトが不要になった後、Javaが自動で回収する仕組みはどれですか？', NULL, '[{"key": "1", "text": "ガベージコレクション"}, {"key": "2", "text": "オーバーロード"}, {"key": "3", "text": "カプセル化"}, {"key": "4", "text": "キャスト"}]'::jsonb, '{"A": "1"}'::jsonb, '不要になったオブジェクトはガベージコレクションにより回収されます。', 'メモリ', 'medium', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'フィールドを初期化する主な場所として適切なものはどれですか？', NULL, '[{"key": "1", "text": "コンストラクタ"}, {"key": "2", "text": "import文"}, {"key": "3", "text": "package文"}, {"key": "4", "text": "コメント"}]'::jsonb, '{"A": "1"}'::jsonb, 'コンストラクタはオブジェクト生成時の初期化に使われます。', 'オブジェクト', 'medium', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の出力として正しいものはどれですか？', 'Counter a = new Counter();
Counter b = a;
b.value = 2;
System.out.println(a.value);', '[{"key": "1", "text": "1"}, {"key": "2", "text": "2"}, {"key": "3", "text": "0"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}'::jsonb, 'aとbは同じCounterオブジェクトを参照しているため、b.valueの変更がaからも見えます。', '参照', 'hard', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'nullの参照変数に対してメソッドを呼び出した場合、通常どうなりますか？', NULL, '[{"key": "1", "text": "NullPointerExceptionが発生する"}, {"key": "2", "text": "自動でオブジェクトが生成される"}, {"key": "3", "text": "falseが返る"}, {"key": "4", "text": "コンパイル時に必ず検出される"}]'::jsonb, '{"A": "1"}'::jsonb, 'nullに対してメソッドやフィールドへアクセスするとNullPointerExceptionが発生します。', 'null', 'hard', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'インスタンスを作らずに呼び出しやすいメソッドとして適切なのはどれですか？', NULL, '[{"key": "1", "text": "staticメソッド"}, {"key": "2", "text": "privateメソッド"}, {"key": "3", "text": "コンストラクタ"}, {"key": "4", "text": "抽象メソッド"}]'::jsonb, '{"A": "1"}'::jsonb, 'staticメソッドはクラスに属するため、クラス名から呼び出せます。', 'static', 'hard', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オブジェクト指向の利点として適切なものはどれですか？', NULL, '[{"key": "1", "text": "関連するデータと処理をまとめて管理しやすくする"}, {"key": "2", "text": "すべてのコードをmainだけに書く"}, {"key": "3", "text": "配列を禁止する"}, {"key": "4", "text": "コンパイルを不要にする"}]'::jsonb, '{"A": "1"}'::jsonb, 'オブジェクト指向では関連するデータと処理をクラスにまとめられます。', 'オブジェクト指向', 'hard', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の説明として正しいものはどれですか？', NULL, '[{"key": "1", "text": "newを実行するたび基本的に別のインスタンスが作られる"}, {"key": "2", "text": "newは変数宣言だけを行う"}, {"key": "3", "text": "newはstaticフィールドだけ作る"}, {"key": "4", "text": "newは配列では使えない"}]'::jsonb, '{"A": "1"}'::jsonb, 'newを実行すると通常は新しいオブジェクトが生成されます。', 'インスタンス', 'hard', '第4回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'クラスを継承するときに使うキーワードはどれですか？', NULL, '[{"key": "1", "text": "extends"}, {"key": "2", "text": "implements"}, {"key": "3", "text": "import"}, {"key": "4", "text": "package"}]'::jsonb, '{"A": "1"}'::jsonb, 'クラスの継承には extends を使います。', '継承', 'easy', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '継承元のクラスを一般に何と呼びますか？', NULL, '[{"key": "1", "text": "親クラス"}, {"key": "2", "text": "配列クラス"}, {"key": "3", "text": "ローカルクラス"}, {"key": "4", "text": "実行クラス"}]'::jsonb, '{"A": "1"}'::jsonb, '継承元は親クラス、スーパークラスなどと呼ばれます。', '継承', 'easy', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '子クラスから親クラスのコンストラクタを呼ぶときに使うものはどれですか？', NULL, '[{"key": "1", "text": "super()"}, {"key": "2", "text": "this()"}, {"key": "3", "text": "parent()"}, {"key": "4", "text": "base()"}]'::jsonb, '{"A": "1"}'::jsonb, 'super() は親クラスのコンストラクタ呼び出しです。', '継承', 'easy', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '親クラスのメソッドを子クラスで再定義することを何といいますか？', NULL, '[{"key": "1", "text": "オーバーライド"}, {"key": "2", "text": "オーバーロード"}, {"key": "3", "text": "カプセル化"}, {"key": "4", "text": "抽象化"}]'::jsonb, '{"A": "1"}'::jsonb, '継承したメソッドを子クラスで再定義することをオーバーライドといいます。', 'オーバーライド', 'easy', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaのクラス継承について正しいものはどれですか？', NULL, '[{"key": "1", "text": "1つのクラスは複数のクラスを同時にextendsできる"}, {"key": "2", "text": "1つのクラスがextendsできる直接の親クラスは1つ"}, {"key": "3", "text": "extendsはインタフェース専用である"}, {"key": "4", "text": "継承ではフィールドを使えない"}]'::jsonb, '{"A": "2"}'::jsonb, 'Javaのクラス継承は単一継承で、直接extendsできるクラスは1つです。', '継承', 'medium', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'privateメンバについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "子クラスから直接アクセスできない"}, {"key": "2", "text": "どこからでも直接アクセスできる"}, {"key": "3", "text": "同じパッケージなら必ずアクセスできる"}, {"key": "4", "text": "継承するとpublicになる"}]'::jsonb, '{"A": "1"}'::jsonb, 'privateメンバは同じクラス内からのみ直接アクセスできます。', 'アクセス修飾子', 'medium', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'protectedメンバについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "継承関係の子クラスから利用できる場合がある"}, {"key": "2", "text": "必ず外部からアクセス不可"}, {"key": "3", "text": "privateと完全に同じ"}, {"key": "4", "text": "static専用である"}]'::jsonb, '{"A": "1"}'::jsonb, 'protectedは同じパッケージや継承関係の子クラスからアクセスできます。', 'アクセス修飾子', 'medium', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '親クラスの同名メソッドを子クラスから呼びたいときに使う書き方はどれですか？', NULL, '[{"key": "1", "text": "super.method()"}, {"key": "2", "text": "this.super()"}, {"key": "3", "text": "parent.method()"}, {"key": "4", "text": "base.method()"}]'::jsonb, '{"A": "1"}'::jsonb, 'super.method() のように書くと親クラス側のメソッドを呼べます。', 'super', 'medium', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '子クラスのインスタンス生成時、コンストラクタの呼び出し順として正しいものはどれですか？', NULL, '[{"key": "1", "text": "親クラスのコンストラクタが先に呼ばれる"}, {"key": "2", "text": "子クラスだけ呼ばれる"}, {"key": "3", "text": "親クラスは呼ばれない"}, {"key": "4", "text": "順番はランダム"}]'::jsonb, '{"A": "1"}'::jsonb, '子クラス生成時はまず親クラスのコンストラクタが呼ばれます。', 'コンストラクタ', 'medium', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オーバーライド時に守るべきこととして正しいものはどれですか？', NULL, '[{"key": "1", "text": "メソッド名と引数リストを親クラスのものと合わせる"}, {"key": "2", "text": "戻り値型だけ変えればよい"}, {"key": "3", "text": "必ずprivateにする"}, {"key": "4", "text": "必ずstaticにする"}]'::jsonb, '{"A": "1"}'::jsonb, 'オーバーライドではメソッド名と引数リストを一致させる必要があります。', 'オーバーライド', 'hard', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のコードがコンパイルエラーになる理由として正しいものはどれですか？', 'class A {
  private void m3() {}
}
class B extends A {
  void test() {
    m3();
  }
}', '[{"key": "1", "text": "m3がprivateだから"}, {"key": "2", "text": "m1がpublicだから"}, {"key": "3", "text": "m2がprotectedだから"}, {"key": "4", "text": "継承しているから"}]'::jsonb, '{"A": "1"}'::jsonb, 'privateメソッドm3は子クラスから直接呼び出せません。', 'アクセス修飾子', 'hard', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '子クラスにコンストラクタを定義しない場合について正しい説明はどれですか？', NULL, '[{"key": "1", "text": "引数なしのデフォルトコンストラクタが用意される場合がある"}, {"key": "2", "text": "必ずコンパイルエラーになる"}, {"key": "3", "text": "親クラスのフィールドが消える"}, {"key": "4", "text": "extendsが無効になる"}]'::jsonb, '{"A": "1"}'::jsonb, '子クラスにコンストラクタがない場合、条件が合えばデフォルトコンストラクタが用意されます。', 'コンストラクタ', 'hard', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'is-a関係の例として最も適切なものはどれですか？', NULL, '[{"key": "1", "text": "Dog extends Animal"}, {"key": "2", "text": "Car has Engine"}, {"key": "3", "text": "Student has Name"}, {"key": "4", "text": "Array has Length"}]'::jsonb, '{"A": "1"}'::jsonb, 'Dog is an Animal のような関係は継承に向いています。', '継承', 'hard', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '@Overrideアノテーションの利点として適切なものはどれですか？', NULL, '[{"key": "1", "text": "正しくオーバーライドできているかコンパイラが確認できる"}, {"key": "2", "text": "必ず実行速度が2倍になる"}, {"key": "3", "text": "privateメソッドをpublicに変える"}, {"key": "4", "text": "コンストラクタを自動生成する"}]'::jsonb, '{"A": "1"}'::jsonb, '@Overrideを付けると、オーバーライドのつもりができていない場合にコンパイルエラーで気づけます。', 'オーバーライド', 'hard', '第5回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'フィールドをprivateにし、メソッド経由でアクセスする考え方はどれですか？', NULL, '[{"key": "1", "text": "カプセル化"}, {"key": "2", "text": "継承"}, {"key": "3", "text": "配列"}, {"key": "4", "text": "キャスト"}]'::jsonb, '{"A": "1"}'::jsonb, 'カプセル化では内部状態を隠し、必要な操作だけを公開します。', 'カプセル化', 'easy', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'privateフィールドの値を取得するメソッドを一般に何と呼びますか？', NULL, '[{"key": "1", "text": "getter"}, {"key": "2", "text": "setter"}, {"key": "3", "text": "constructor"}, {"key": "4", "text": "compiler"}]'::jsonb, '{"A": "1"}'::jsonb, '値を取得するメソッドはgetterと呼ばれます。', 'カプセル化', 'easy', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'privateフィールドの値を変更するメソッドを一般に何と呼びますか？', NULL, '[{"key": "1", "text": "getter"}, {"key": "2", "text": "setter"}, {"key": "3", "text": "extends"}, {"key": "4", "text": "abstract"}]'::jsonb, '{"A": "2"}'::jsonb, '値を設定・変更するメソッドはsetterと呼ばれます。', 'カプセル化', 'easy', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象クラスを定義するときに使うキーワードはどれですか？', NULL, '[{"key": "1", "text": "abstract"}, {"key": "2", "text": "extends"}, {"key": "3", "text": "final"}, {"key": "4", "text": "static"}]'::jsonb, '{"A": "1"}'::jsonb, '抽象クラスや抽象メソッドには abstract を使います。', '抽象クラス', 'easy', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'カプセル化の目的として適切なものはどれですか？', NULL, '[{"key": "1", "text": "不正な値が直接入ることを防ぎ、管理しやすくする"}, {"key": "2", "text": "すべてのフィールドをpublicにする"}, {"key": "3", "text": "継承を禁止する"}, {"key": "4", "text": "mainメソッドをなくす"}]'::jsonb, '{"A": "1"}'::jsonb, 'カプセル化により、値の検証や内部実装の隠蔽がしやすくなります。', 'アクセス修飾子', 'medium', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'boolean型のgetter名としてよく使われる形はどれですか？', NULL, '[{"key": "1", "text": "isActive()"}, {"key": "2", "text": "setActive()"}, {"key": "3", "text": "newActive()"}, {"key": "4", "text": "voidActive()"}]'::jsonb, '{"A": "1"}'::jsonb, 'booleanのgetterは isXxx() の形で書かれることがあります。', 'getter/setter', 'medium', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象メソッドについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "処理内容を持たないメソッド宣言である"}, {"key": "2", "text": "必ずprivateにする"}, {"key": "3", "text": "必ずstaticにする"}, {"key": "4", "text": "コンストラクタの一種である"}]'::jsonb, '{"A": "1"}'::jsonb, '抽象メソッドは本体を持たず、子クラスで実装させるために使います。', '抽象クラス', 'medium', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象クラスについて正しい説明はどれですか？', NULL, '[{"key": "1", "text": "直接newできない"}, {"key": "2", "text": "必ずフィールドを持てない"}, {"key": "3", "text": "継承できない"}, {"key": "4", "text": "mainメソッドを書けない"}]'::jsonb, '{"A": "1"}'::jsonb, '抽象クラスは直接インスタンス化できません。', '抽象クラス', 'medium', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '外部から自由に使えるメンバに付けるアクセス修飾子はどれですか？', NULL, '[{"key": "1", "text": "private"}, {"key": "2", "text": "protected"}, {"key": "3", "text": "public"}, {"key": "4", "text": "abstract"}]'::jsonb, '{"A": "3"}'::jsonb, 'publicメンバは他のクラスから利用できます。', 'アクセス修飾子', 'medium', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のうちカプセル化として最も適切な設計はどれですか？', NULL, '[{"key": "1", "text": "フィールドをprivateにして必要なgetter/setterを用意する"}, {"key": "2", "text": "全フィールドをpublicにする"}, {"key": "3", "text": "すべてstaticにする"}, {"key": "4", "text": "クラスを使わない"}]'::jsonb, '{"A": "1"}'::jsonb, 'フィールドをprivateにしてメソッド経由で操作するのが基本的なカプセル化です。', 'カプセル化', 'hard', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象メソッドを含むクラスについて正しいものはどれですか？', NULL, '[{"key": "1", "text": "クラスもabstractにする必要がある"}, {"key": "2", "text": "必ずfinalにする"}, {"key": "3", "text": "必ずstaticにする"}, {"key": "4", "text": "継承できない"}]'::jsonb, '{"A": "1"}'::jsonb, '抽象メソッドを持つクラスはabstractクラスとして宣言する必要があります。', '抽象クラス', 'hard', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象クラスを継承した通常クラスが抽象メソッドを実装しない場合、どうなりますか？', NULL, '[{"key": "1", "text": "コンパイルエラーになる"}, {"key": "2", "text": "自動で実装される"}, {"key": "3", "text": "実行時だけエラーになる"}, {"key": "4", "text": "必ずprivateになる"}]'::jsonb, '{"A": "1"}'::jsonb, '通常クラスは継承した抽象メソッドを実装する必要があります。', '抽象クラス', 'hard', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のうち最もアクセス範囲が狭いものはどれですか？', NULL, '[{"key": "1", "text": "public"}, {"key": "2", "text": "protected"}, {"key": "3", "text": "指定なし"}, {"key": "4", "text": "private"}]'::jsonb, '{"A": "4"}'::jsonb, 'privateは同じクラス内からのみアクセスできます。', 'アクセス修飾子', 'hard', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'toStringメソッドの主な目的として正しいものはどれですか？', NULL, '[{"key": "1", "text": "オブジェクトを文字列表現にする"}, {"key": "2", "text": "必ず数値を返す"}, {"key": "3", "text": "コンストラクタを呼ぶ"}, {"key": "4", "text": "配列を初期化する"}]'::jsonb, '{"A": "1"}'::jsonb, 'toStringはオブジェクトの内容を文字列として表現するために使います。', 'toString', 'hard', '第6回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'Javaのクラス定義として正しい形はどれですか？', NULL, '[{"key": "1", "text": "class Sample { }"}, {"key": "2", "text": "Sample class { }"}, {"key": "3", "text": "def Sample:"}, {"key": "4", "text": "class = Sample"}]'::jsonb, '{"A": "1"}'::jsonb, 'Javaでは class クラス名 { } の形でクラスを定義します。', '総合', 'easy', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のうちコメントとして正しいものはどれですか？', NULL, '[{"key": "1", "text": "// comment"}, {"key": "2", "text": "<!-- comment -->"}, {"key": "3", "text": "# comment"}, {"key": "4", "text": "-- comment"}]'::jsonb, '{"A": "1"}'::jsonb, 'Javaでは // で1行コメントを書けます。', '総合', 'easy', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '文字1文字を表す基本データ型はどれですか？', NULL, '[{"key": "1", "text": "char"}, {"key": "2", "text": "String"}, {"key": "3", "text": "boolean"}, {"key": "4", "text": "byte[]"}]'::jsonb, '{"A": "1"}'::jsonb, 'charは1文字を表す基本データ型です。', '総合', 'easy', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '小数を扱う基本データ型としてよく使うものはどれですか？', NULL, '[{"key": "1", "text": "double"}, {"key": "2", "text": "boolean"}, {"key": "3", "text": "char"}, {"key": "4", "text": "String"}]'::jsonb, '{"A": "1"}'::jsonb, 'doubleは小数を扱う基本データ型です。', '総合', 'easy', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次の出力として正しいものはどれですか？', 'int a = 5;
a++;
System.out.println(a);', '[{"key": "1", "text": "5"}, {"key": "2", "text": "6"}, {"key": "3", "text": "10"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}'::jsonb, 'a++でaは6になります。その後aを表示するので6です。', '総合', 'medium', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'メソッド呼び出しの書き方として正しいものはどれですか？', NULL, '[{"key": "1", "text": "obj.method();"}, {"key": "2", "text": "method.obj();"}, {"key": "3", "text": "obj->method();"}, {"key": "4", "text": "call obj method;"}]'::jsonb, '{"A": "1"}'::jsonb, 'Javaではオブジェクト名.メソッド名()の形で呼び出します。', '総合', 'medium', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '配列 nums の最初の要素にアクセスする書き方はどれですか？', NULL, '[{"key": "1", "text": "nums[0]"}, {"key": "2", "text": "nums[1]"}, {"key": "3", "text": "nums.first"}, {"key": "4", "text": "nums(0)"}]'::jsonb, '{"A": "1"}'::jsonb, 'Javaの配列は0番目から始まります。', '総合', 'medium', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'メソッドの仮引数 int x について正しいものはどれですか？', NULL, '[{"key": "1", "text": "メソッド内で使えるローカル変数のように扱える"}, {"key": "2", "text": "クラス外で必ず使える"}, {"key": "3", "text": "自動的にstaticになる"}, {"key": "4", "text": "配列にしか使えない"}]'::jsonb, '{"A": "1"}'::jsonb, '仮引数はメソッド内でローカル変数のように利用できます。', '総合', 'medium', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'コンストラクタの呼び出しタイミングとして正しいものはどれですか？', NULL, '[{"key": "1", "text": "newでオブジェクトを生成するとき"}, {"key": "2", "text": "if文を実行するとき"}, {"key": "3", "text": "for文が終了するとき"}, {"key": "4", "text": "importするとき"}]'::jsonb, '{"A": "1"}'::jsonb, 'コンストラクタはオブジェクト生成時に呼び出されます。', '総合', 'medium', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のコードの説明として正しいものはどれですか？', 'Animal a = new Dog();', '[{"key": "1", "text": "Animal型の変数でDogオブジェクトを参照できる"}, {"key": "2", "text": "Dog型の変数で必ずAnimalを参照できる"}, {"key": "3", "text": "継承では代入できない"}, {"key": "4", "text": "abstractが必要"}]'::jsonb, '{"A": "1"}'::jsonb, 'DogがAnimalを継承していれば、Animal型の変数でDogオブジェクトを参照できます。', '総合', 'hard', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '次のうちコンパイルエラーになる可能性が高いものはどれですか？', NULL, '[{"key": "1", "text": "int x; System.out.println(x);"}, {"key": "2", "text": "int x = 0; System.out.println(x);"}, {"key": "3", "text": "String s = \"A\";"}, {"key": "4", "text": "boolean b = true;"}]'::jsonb, '{"A": "1"}'::jsonb, 'ローカル変数xが初期化されないまま使われているためコンパイルエラーになります。', '総合', 'hard', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'オーバーロードとオーバーライドの違いとして正しいものはどれですか？', NULL, '[{"key": "1", "text": "オーバーロードは同名で引数違い、オーバーライドは継承先で再定義"}, {"key": "2", "text": "どちらも必ず戻り値型だけを変える"}, {"key": "3", "text": "どちらもprivate専用"}, {"key": "4", "text": "どちらも配列専用"}]'::jsonb, '{"A": "1"}'::jsonb, 'オーバーロードは同じ名前で引数を変えること、オーバーライドは継承したメソッドの再定義です。', '総合', 'hard', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', '抽象クラスと通常クラスの違いとして正しいものはどれですか？', NULL, '[{"key": "1", "text": "抽象クラスは直接newできない"}, {"key": "2", "text": "抽象クラスはフィールドを持てない"}, {"key": "3", "text": "通常クラスはメソッドを持てない"}, {"key": "4", "text": "通常クラスは継承できない"}]'::jsonb, '{"A": "1"}'::jsonb, '抽象クラスは直接インスタンス化できません。', '総合', 'hard', '第7回', true, '["A"]'::jsonb, now());

  INSERT INTO questions (id, course_id, question_type, question_text, code_block, choices_json, correct_answer, explanation, topic, difficulty, source_round, is_active, answer_slots_json, created_at)
  VALUES (gen_random_uuid(), c_id, 'random_multiple_choice', 'プログラムを部品化して再利用しやすくする考え方として最も近いものはどれですか？', NULL, '[{"key": "1", "text": "クラスやメソッドを適切に分ける"}, {"key": "2", "text": "すべてmainに書く"}, {"key": "3", "text": "変数名をすべて同じにする"}, {"key": "4", "text": "コメントを全部消す"}]'::jsonb, '{"A": "1"}'::jsonb, 'クラスやメソッドに分けることで、保守性や再利用性が高まります。', '総合', 'hard', '第7回', true, '["A"]'::jsonb, now());

END $$;

-- Make random questions readable from hosted frontend
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read courses" ON courses;
DROP POLICY IF EXISTS "Allow public read questions" ON questions;
CREATE POLICY "Allow public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read questions" ON questions FOR SELECT USING (true);

SELECT c.slug, q.source_round, q.difficulty, COUNT(*)
FROM questions q
JOIN courses c ON q.course_id = c.id
WHERE c.slug = 'java-language-1'
GROUP BY c.slug, q.source_round, q.difficulty
ORDER BY q.source_round, q.difficulty;