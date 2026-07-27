-- Ｃ++言語Ⅱ 試験準備 seed
-- Range: 第8回〜第13回
-- Mode: fixed exam order, similar to kimatsu test style.
-- This script replaces only the C++II course data (slug = cpp-language-2).

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS source_round TEXT;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS answer_slots_json JSONB DEFAULT '["A"]'::jsonb;

DO $do$
DECLARE
  v_course_id UUID;
  v_exam_id UUID;
  v_question_id UUID;
  r RECORD;
BEGIN
  INSERT INTO public.courses (slug, title, description, status)
  VALUES (
    'cpp-language-2',
    'Ｃ++言語Ⅱ',
    '第8回〜第13回の範囲を、試験準備形式で練習します。',
    'active'
  )
  ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      status = 'active'
  RETURNING id INTO v_course_id;

  -- Replace previous C++II exam/random data safely.
  DELETE FROM public.attempt_answers
  WHERE attempt_id IN (
    SELECT id FROM public.attempts WHERE course_id = v_course_id
  );

  DELETE FROM public.attempts
  WHERE course_id = v_course_id;

  DELETE FROM public.exam_questions
  WHERE exam_id IN (
    SELECT id FROM public.exams WHERE course_id = v_course_id
  );

  DELETE FROM public.exams
  WHERE course_id = v_course_id;

  DELETE FROM public.questions
  WHERE course_id = v_course_id;

  INSERT INTO public.exams (course_id, slug, title, description, exam_type, year, term)
  VALUES (
    v_course_id,
    'cpp2-shiken-junbi',
    'Ｃ++言語Ⅱ 試験準備（第8回〜第13回）',
    '第8回から第13回まで、章の順番どおりに出題します。',
    'shiken_junbi',
    2026,
    '前期'
  )
  RETURNING id INTO v_exam_id;

  FOR r IN
    SELECT * FROM (VALUES
  (1, '第8回', '関数・変数・参照', 'easy', '次のプログラムの出力として正しいものはどれか。', 'int square(int x) {
  return x * x;
}

int main() {
  cout << square(4) + square(2) << endl;
  return 0;
}', '[{"key": "1", "text": "16"}, {"key": "2", "text": "18"}, {"key": "3", "text": "20"}, {"key": "4", "text": "24"}]'::jsonb, '{"A": "3"}', 'square(4)=16、square(2)=4 なので、合計は20です。'),
  (2, '第8回', '関数・値渡し', 'easy', '次のプログラムの出力として正しいものはどれか。', 'void change(int x) {
  x = 10;
}

int main() {
  int a = 3;
  change(a);
  cout << a << endl;
  return 0;
}', '[{"key": "1", "text": "3"}, {"key": "2", "text": "10"}, {"key": "3", "text": "13"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', '引数xは値渡しなので、関数内で変更してもmainのaは変わりません。'),
  (3, '第8回', '参照', 'easy', '次のプログラムの出力として正しいものはどれか。', 'void addFive(int &x) {
  x += 5;
}

int main() {
  int n = 2;
  addFive(n);
  cout << n << endl;
  return 0;
}', '[{"key": "1", "text": "2"}, {"key": "2", "text": "5"}, {"key": "3", "text": "7"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "3"}', '参照渡しなので、関数内の変更が元の変数nに反映されます。'),
  (4, '第8回', '参照・swap', 'medium', '次のプログラムの出力として正しいものはどれか。', 'void swapValue(int &a, int &b) {
  int tmp = a;
  a = b;
  b = tmp;
}

int main() {
  int x = 4, y = 9;
  swapValue(x, y);
  cout << x << " " << y << endl;
  return 0;
}', '[{"key": "1", "text": "4 9"}, {"key": "2", "text": "9 4"}, {"key": "3", "text": "4 4"}, {"key": "4", "text": "9 9"}]'::jsonb, '{"A": "2"}', 'aとbは参照なので、xとyの値が入れ替わります。'),
  (5, '第8回', '構造体', 'easy', '次のプログラムの出力として正しいものはどれか。', 'struct Date {
  int year;
  int month;
  int day;
};

int main() {
  Date d;
  d.year = 2026;
  d.month = 7;
  d.day = 21;
  cout << d.month << endl;
  return 0;
}', '[{"key": "1", "text": "2026"}, {"key": "2", "text": "7"}, {"key": "3", "text": "21"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '構造体変数dのmonthメンバに7を代入しているので、出力は7です。'),
  (6, '第8回', 'グローバル変数・ローカル変数', 'medium', '次のプログラムの出力として正しいものはどれか。', 'int x = 5;

int main() {
  int x = 2;
  cout << x << endl;
  return 0;
}', '[{"key": "1", "text": "2"}, {"key": "2", "text": "5"}, {"key": "3", "text": "7"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', '同じ名前の場合、main内ではローカル変数xが優先されます。'),
  (7, '第8回', '関数の戻り値', 'easy', '次のプログラムの出力として正しいものはどれか。', 'int trapezoid(int upper, int bottom, int height) {
  return (upper + bottom) * height / 2;
}

int main() {
  cout << trapezoid(2, 6, 4) << endl;
  return 0;
}', '[{"key": "1", "text": "8"}, {"key": "2", "text": "12"}, {"key": "3", "text": "16"}, {"key": "4", "text": "20"}]'::jsonb, '{"A": "3"}', '(2+6)*4/2=16 です。'),
  (8, '第8回', '構造体・値渡し', 'medium', '次のプログラムの出力として正しいものはどれか。', 'struct Data {
  int x;
};

void reset(Data d) {
  d.x = 0;
}

int main() {
  Data a;
  a.x = 5;
  reset(a);
  cout << a.x << endl;
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "5"}, {"key": "3", "text": "未定義"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '構造体も値渡しの場合はコピーが渡されるので、元のa.xは5のままです。'),
  (9, '第8回', '参照変数', 'easy', '次のプログラムの出力として正しいものはどれか。', 'int main() {
  int a = 4;
  int &r = a;
  r = 9;
  cout << a << endl;
  return 0;
}', '[{"key": "1", "text": "4"}, {"key": "2", "text": "9"}, {"key": "3", "text": "13"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'rはaの別名なので、rに代入するとaの値も変わります。'),
  (10, '第8回', '関数・ローカル変数', 'medium', '次のプログラムの出力として正しいものはどれか。', 'int f(int x) {
  int y = x + 1;
  return y;
}

int main() {
  int y = 10;
  cout << f(3) << " " << y << endl;
  return 0;
}', '[{"key": "1", "text": "4 4"}, {"key": "2", "text": "4 10"}, {"key": "3", "text": "10 4"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '関数f内のyとmain内のyは別の変数です。'),
  (11, '第9回', 'オーバーロード', 'easy', '次のプログラムの出力として正しいものはどれか。', 'int area(int a) {
  return a * a;
}

int area(int a, int b) {
  return a * b;
}

int main() {
  cout << area(5) << " " << area(3, 4) << endl;
  return 0;
}', '[{"key": "1", "text": "25 12"}, {"key": "2", "text": "10 7"}, {"key": "3", "text": "20 12"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', '引数1個なら正方形版、引数2個なら長方形版が呼ばれます。'),
  (12, '第9回', 'オーバーロードの注意', 'medium', '次のプログラムについて正しいものはどれか。', 'int calc(int a) {
  return a + 1;
}

double calc(int a) {
  return a + 0.5;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "返り値の型だけが違うのでコンパイルエラーになる"}, {"key": "3", "text": "実行時エラーになる"}, {"key": "4", "text": "calcは必ずdouble版だけ呼ばれる"}]'::jsonb, '{"A": "2"}', 'C++のオーバーロードは引数列で区別します。返り値の型だけ違う関数は定義できません。'),
  (13, '第9回', 'クラス・private', 'easy', '次のプログラムについて正しいものはどれか。', 'class Counter {
private:
  int value;
public:
  Counter() { value = 0; }
};

int main() {
  Counter c;
  c.value = 10;
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "privateメンバをクラス外から直接使っているのでコンパイルエラー"}, {"key": "3", "text": "実行時エラー"}, {"key": "4", "text": "valueは自動的にpublicになる"}]'::jsonb, '{"A": "2"}', 'privateメンバはクラス外のmainから直接アクセスできません。'),
  (14, '第9回', 'コンストラクタ', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class A {
public:
  A() { cout << "A" << endl; }
};

int main() {
  A obj;
  return 0;
}', '[{"key": "1", "text": "A"}, {"key": "2", "text": "obj"}, {"key": "3", "text": "出力なし"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'オブジェクト生成時にコンストラクタA()が呼ばれます。'),
  (15, '第9回', 'コンストラクタ', 'medium', '次のプログラムについて正しいものはどれか。', 'class A {
public:
  A(int n) { cout << n << endl; }
};

int main() {
  A obj;
  return 0;
}', '[{"key": "1", "text": "0が出力される"}, {"key": "2", "text": "nが出力される"}, {"key": "3", "text": "コンパイルエラーになる"}, {"key": "4", "text": "実行時エラーになる"}]'::jsonb, '{"A": "3"}', 'A(int)だけ定義されており、引数なしコンストラクタA()がないため、A obj; はできません。'),
  (16, '第9回', 'コンストラクタのオーバーロード', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Point {
public:
  Point() { cout << "zero" << endl; }
  Point(int x) { cout << x << endl; }
};

int main() {
  Point p1;
  Point p2(7);
  return 0;
}', '[{"key": "1", "text": "zero\n7"}, {"key": "2", "text": "7\nzero"}, {"key": "3", "text": "zeroだけ"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'p1では引数なし、p2ではint引数のコンストラクタが呼ばれます。'),
  (17, '第9回', 'クラス・メンバ関数', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class Counter {
private:
  int value;
public:
  Counter() { value = 0; }
  void up() { value++; }
  int get() { return value; }
};

int main() {
  Counter c;
  c.up();
  c.up();
  cout << c.get() << endl;
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "1"}, {"key": "3", "text": "2"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "3"}', 'up()を2回呼んでいるのでvalueは2になります。'),
  (18, '第9回', 'public/private', 'medium', '次のプログラムについて正しいものはどれか。', 'class Sample {
private:
  int x;
public:
  void set(int n) { x = n; }
  int get() { return x; }
};

int main() {
  Sample s;
  s.set(8);
  cout << s.get() << endl;
  return 0;
}', '[{"key": "1", "text": "8が出力される"}, {"key": "2", "text": "0が出力される"}, {"key": "3", "text": "privateのためset内でもxを使えない"}, {"key": "4", "text": "コンパイルエラーになる"}]'::jsonb, '{"A": "1"}', 'privateメンバでも、同じクラスのメンバ関数からはアクセスできます。'),
  (19, '第9回', '引数付きコンストラクタ', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Box {
private:
  int value;
public:
  Box(int v) { value = v; }
  void print() { cout << value << endl; }
};

int main() {
  Box b(12);
  b.print();
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "12"}, {"key": "3", "text": "value"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'コンストラクタでvalueに12を代入しています。'),
  (20, '第9回', 'クラス定義', 'hard', '次のプログラムについて正しいものはどれか。', 'class Test {
public:
  void show() { cout << "OK" << endl; }
}

int main() {
  Test t;
  t.show();
  return 0;
}', '[{"key": "1", "text": "OKが出力される"}, {"key": "2", "text": "クラス定義の最後にセミコロンがないのでコンパイルエラー"}, {"key": "3", "text": "showはprivateなのでエラー"}, {"key": "4", "text": "実行時エラー"}]'::jsonb, '{"A": "2"}', 'class定義の最後には }; のようにセミコロンが必要です。'),
  (21, '第10回', '継承・コンストラクタ順序', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  Base() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  Derived() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  return 0;
}', '[{"key": "1", "text": "Derived\nBase"}, {"key": "2", "text": "Base\nDerived"}, {"key": "3", "text": "Baseだけ"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '派生クラスのオブジェクト生成時は、まず基底クラスのコンストラクタが呼ばれます。'),
  (22, '第10回', '継承・メンバ関数', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  void show() { cout << "Base" << endl; }
};

class Derived : public Base {
};

int main() {
  Derived d;
  d.show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "出力なし"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'public継承なので、DerivedのオブジェクトからBaseのpublicメンバ関数を使えます。'),
  (23, '第10回', 'protected', 'medium', '次のプログラムについて正しいものはどれか。', 'class Base {
protected:
  int x;
};

class Derived : public Base {
public:
  void set() { x = 5; }
};

int main() {
  Derived d;
  d.set();
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "Derived内でもprotectedメンバは使えない"}, {"key": "3", "text": "mainからxを直接使っているのでエラー"}, {"key": "4", "text": "実行時エラー"}]'::jsonb, '{"A": "1"}', 'protectedメンバは、派生クラスのメンバ関数からアクセスできます。'),
  (24, '第10回', 'privateと継承', 'medium', '次のプログラムについて正しいものはどれか。', 'class Base {
private:
  int x;
};

class Derived : public Base {
public:
  void set() { x = 5; }
};', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "privateメンバxを派生クラスから直接使っているのでコンパイルエラー"}, {"key": "3", "text": "xは自動的にprotectedになる"}, {"key": "4", "text": "実行時エラー"}]'::jsonb, '{"A": "2"}', 'privateメンバは派生クラスからも直接アクセスできません。'),
  (25, '第10回', '上書き定義', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  d.show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "BaseDerived"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'Derived型のオブジェクトでshow()を呼ぶため、Derived側のshow()が使われます。'),
  (26, '第10回', '静的束縛', 'hard', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  Base *p = &d;
  p->show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "Base\nDerived"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'virtualではないため、Base*で呼ぶとBaseのshow()が呼ばれます。'),
  (27, '第10回', '初期化リスト', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  Base(int n) { cout << n << endl; }
};

class Derived : public Base {
public:
  Derived(int n) : Base(n + 1) { cout << n << endl; }
};

int main() {
  Derived d(10);
  return 0;
}', '[{"key": "1", "text": "10\n11"}, {"key": "2", "text": "11\n10"}, {"key": "3", "text": "10だけ"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '初期化リストでBase(n+1)が先に呼ばれ、その後Derivedの本体が実行されます。'),
  (28, '第10回', '派生クラスのコンストラクタ', 'hard', '次のプログラムについて正しいものはどれか。', 'class Base {
public:
  Base(int n) { }
};

class Derived : public Base {
public:
  Derived() { }
};', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "Baseの引数なしコンストラクタがないのでコンパイルエラー"}, {"key": "3", "text": "Derivedの中身が空なので実行時エラー"}, {"key": "4", "text": "自動的にBase(0)が呼ばれる"}]'::jsonb, '{"A": "2"}', 'Derived()がBaseのコンストラクタを指定していないため、Base()を呼ぼうとします。しかしBase()がありません。'),
  (29, '第10回', '基底クラスの関数を呼ぶ', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() {
    Base::show();
    cout << "Derived" << endl;
  }
};

int main() {
  Derived d;
  d.show();
  return 0;
}', '[{"key": "1", "text": "Derivedだけ"}, {"key": "2", "text": "Baseだけ"}, {"key": "3", "text": "Base\nDerived"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "3"}', 'Base::show()で基底クラスのshow()を明示的に呼んでいます。'),
  (30, '第10回', 'protected', 'medium', '次のプログラムについて正しいものはどれか。', 'class Base {
protected:
  int x;
};

int main() {
  Base b;
  b.x = 3;
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "protectedメンバをmainから直接使っているのでコンパイルエラー"}, {"key": "3", "text": "xはpublicになる"}, {"key": "4", "text": "実行時エラー"}]'::jsonb, '{"A": "2"}', 'protectedメンバは外部のmainから直接アクセスできません。'),
  (31, '第11回', '構造体ポインタ', 'easy', '次のプログラムの出力として正しいものはどれか。', 'struct Date {
  int year;
  int month;
};

int main() {
  Date d;
  Date *p = &d;
  p->year = 2026;
  cout << d.year << endl;
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "2026"}, {"key": "3", "text": "year"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'p->yearは(*p).yearと同じ意味です。pはdを指しているのでd.yearが変わります。'),
  (32, '第11回', 'new・ポインタ', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class Item {
public:
  int price;
};

int main() {
  Item *p = new Item;
  p->price = 300;
  cout << p->price << endl;
  delete p;
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "300"}, {"key": "3", "text": "price"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'newで作ったオブジェクトはポインタpから->でアクセスできます。'),
  (33, '第11回', 'new・コンストラクタ', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class A {
public:
  A() { cout << "A" << endl; }
};

int main() {
  A *p = new A;
  delete p;
  return 0;
}', '[{"key": "1", "text": "A"}, {"key": "2", "text": "出力なし"}, {"key": "3", "text": "p"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'new A でオブジェクトを生成するとコンストラクタA()が呼ばれます。'),
  (34, '第11回', 'virtual・動的束縛', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  virtual void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  Base *p = &d;
  p->show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "Base\nDerived"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'Baseのshow()がvirtualなので、実行時にDerivedのshow()が呼ばれます。'),
  (35, '第11回', 'virtualなし', 'hard', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  Base &r = d;
  r.show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "出力なし"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', '参照でも、virtualがなければBase型としてBaseのshow()が呼ばれます。'),
  (36, '第11回', 'virtual・参照', 'hard', '次のプログラムの出力として正しいものはどれか。', 'class Base {
public:
  virtual void show() { cout << "Base" << endl; }
};

class Derived : public Base {
public:
  void show() { cout << "Derived" << endl; }
};

int main() {
  Derived d;
  Base &r = d;
  r.show();
  return 0;
}', '[{"key": "1", "text": "Base"}, {"key": "2", "text": "Derived"}, {"key": "3", "text": "Base\nDerived"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'virtual関数はポインタだけでなく参照でも動的束縛されます。'),
  (37, '第11回', 'mallocとnew', 'medium', '次の説明として正しいものはどれか。', NULL, '[{"key": "1", "text": "mallocはC++のコンストラクタを必ず呼ぶ"}, {"key": "2", "text": "newはオブジェクト生成時にコンストラクタを呼ぶ"}, {"key": "3", "text": "newではメモリ確保できない"}, {"key": "4", "text": "mallocとnewは完全に同じ"}]'::jsonb, '{"A": "2"}', 'newでクラスのオブジェクトを作るとコンストラクタが呼ばれます。mallocは単なるメモリ確保です。'),
  (38, '第11回', 'アロー演算子', 'easy', '次の説明として正しいものはどれか。', NULL, '[{"key": "1", "text": "p->x は (*p).x と同じ意味"}, {"key": "2", "text": "p->x は p.x と同じ意味"}, {"key": "3", "text": "p->x は &p.x と同じ意味"}, {"key": "4", "text": "構造体ポインタでは->を使えない"}]'::jsonb, '{"A": "1"}', 'ポインタが指す構造体やクラスのメンバへアクセスするとき、p->x は (*p).x と同じ意味です。'),
  (39, '第11回', '動的束縛', 'medium', '動的束縛が起きやすい条件として正しいものはどれか。', NULL, '[{"key": "1", "text": "普通のローカル変数だけで呼び出す"}, {"key": "2", "text": "virtual関数を基底クラスのポインタや参照から呼び出す"}, {"key": "3", "text": "private変数を宣言する"}, {"key": "4", "text": "includeを書く"}]'::jsonb, '{"A": "2"}', 'C++ではvirtual関数を基底クラスのポインタ/参照から呼ぶことで、実体に応じた関数が呼ばれます。'),
  (40, '第11回', 'ポインタ', 'medium', '次のプログラムの出力として正しいものはどれか。', 'int main() {
  int a = 10;
  int *p = &a;
  *p = 20;
  cout << a << endl;
  return 0;
}', '[{"key": "1", "text": "10"}, {"key": "2", "text": "20"}, {"key": "3", "text": "アドレス"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', '*pはpが指す先、つまりaを表します。'),
  (41, '第12回', '抽象クラス', 'medium', '次のプログラムについて正しいものはどれか。', 'class Figure {
public:
  virtual double area() = 0;
};

int main() {
  Figure f;
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "抽象クラスのオブジェクトを作っているのでコンパイルエラー"}, {"key": "3", "text": "area()は自動的に0を返す"}, {"key": "4", "text": "実行時エラー"}]'::jsonb, '{"A": "2"}', '純粋仮想関数を持つクラスは抽象クラスで、オブジェクトを直接作れません。'),
  (42, '第12回', '純粋仮想関数', 'medium', '次のプログラムについて正しいものはどれか。', 'class Figure {
public:
  virtual double area() = 0;
};

class Rect : public Figure {
};

int main() {
  Rect r;
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "Rectがarea()を再定義していないのでコンパイルエラー"}, {"key": "3", "text": "area()はprivateになる"}, {"key": "4", "text": "Rectは自動的にarea()を持たない"}]'::jsonb, '{"A": "2"}', '抽象クラスを継承したクラスは、純粋仮想関数を実装しないと、そのクラスも抽象クラスになります。'),
  (43, '第12回', '抽象クラス・ポインタ', 'hard', '次のプログラムの出力として正しいものはどれか。', 'class Figure {
public:
  virtual double area() = 0;
  void print() { cout << area() << endl; }
};

class Square : public Figure {
public:
  double area() { return 4; }
};

int main() {
  Figure *p = new Square;
  p->print();
  delete p;
  return 0;
}', '[{"key": "1", "text": "4"}, {"key": "2", "text": "0"}, {"key": "3", "text": "Figure"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'Figure型のポインタでSquareを指すことはできます。print()内のarea()はSquareのarea()が呼ばれます。'),
  (44, '第12回', 'staticメンバ変数', 'medium', '次のプログラムの出力として正しいものはどれか。', 'class Counter {
public:
  static int count;
  Counter() { count++; }
};

int Counter::count = 0;

int main() {
  Counter a;
  Counter b;
  cout << Counter::count << endl;
  return 0;
}', '[{"key": "1", "text": "0"}, {"key": "2", "text": "1"}, {"key": "3", "text": "2"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "3"}', 'staticメンバ変数countはクラス全体で共有されます。オブジェクトを2個作るので2になります。'),
  (45, '第12回', 'staticメンバ関数', 'easy', '次のプログラムの出力として正しいものはどれか。', 'class Sample {
public:
  static void show() { cout << "OK" << endl; }
};

int main() {
  Sample::show();
  return 0;
}', '[{"key": "1", "text": "OK"}, {"key": "2", "text": "Sample"}, {"key": "3", "text": "show"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'staticメンバ関数はクラス名::関数名の形でも呼べます。'),
  (46, '第12回', 'static関数の注意', 'hard', '次のプログラムについて正しいものはどれか。', 'class Sample {
private:
  int x;
public:
  static void show() { cout << x << endl; }
};', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "staticメンバ関数から非staticメンバxをそのまま使っているのでコンパイルエラー"}, {"key": "3", "text": "xは自動的にstaticになる"}, {"key": "4", "text": "出力は0になる"}]'::jsonb, '{"A": "2"}', 'staticメンバ関数は特定のオブジェクトに属さないため、非staticメンバをそのまま使えません。'),
  (47, '第12回', 'staticメンバ変数の定義', 'medium', 'staticメンバ変数について正しい説明はどれか。', NULL, '[{"key": "1", "text": "各オブジェクトごとに別々に作られる"}, {"key": "2", "text": "クラス全体で共有される"}, {"key": "3", "text": "必ずprivateにしなければならない"}, {"key": "4", "text": "メンバ関数から使えない"}]'::jsonb, '{"A": "2"}', 'staticメンバ変数はインスタンスごとではなく、クラス全体で共有されます。'),
  (48, '第12回', '純粋仮想関数の書き方', 'easy', '純粋仮想関数の宣言として正しいものはどれか。', NULL, '[{"key": "1", "text": "virtual double area() = 0;"}, {"key": "2", "text": "double virtual = area();"}, {"key": "3", "text": "pure double area();"}, {"key": "4", "text": "virtual area double;"}]'::jsonb, '{"A": "1"}', '純粋仮想関数は virtual を付け、関数宣言の最後に = 0 を付けます。'),
  (49, '第12回', 'Singleton', 'medium', 'Singletonパターンの目的として近いものはどれか。', NULL, '[{"key": "1", "text": "同じクラスのオブジェクトを大量に作る"}, {"key": "2", "text": "オブジェクトを1つだけ作って使うようにする"}, {"key": "3", "text": "必ず継承を禁止する"}, {"key": "4", "text": "すべての関数をvirtualにする"}]'::jsonb, '{"A": "2"}', 'Singletonは、あるクラスのインスタンスを1つだけに制限して共有したいときに使う考え方です。'),
  (50, '第12回', '抽象クラス', 'medium', '次の説明として正しいものはどれか。', NULL, '[{"key": "1", "text": "抽象クラスは必ずオブジェクトを作れる"}, {"key": "2", "text": "純粋仮想関数を含むクラスは抽象クラスになる"}, {"key": "3", "text": "抽象クラスでは継承できない"}, {"key": "4", "text": "抽象クラスではメンバ関数を書けない"}]'::jsonb, '{"A": "2"}', '純粋仮想関数を持つクラスは抽象クラスになります。'),
  (51, '第13回', 'テンプレート関数', 'easy', '次のプログラムの出力として正しいものはどれか。', 'template<class T>
T mymax(T a, T b) {
  if (a > b) return a;
  return b;
}

int main() {
  cout << mymax(3, 7) << endl;
  return 0;
}', '[{"key": "1", "text": "3"}, {"key": "2", "text": "7"}, {"key": "3", "text": "10"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'Tはintとして使われ、3と7の大きい方である7が返ります。'),
  (52, '第13回', 'テンプレート関数', 'hard', '次のプログラムについて正しいものはどれか。', 'template<class T>
T mymax(T a, T b) {
  if (a > b) return a;
  return b;
}

int main() {
  cout << mymax(1, 2.5) << endl;
  return 0;
}', '[{"key": "1", "text": "1が出力される"}, {"key": "2", "text": "2.5が出力される"}, {"key": "3", "text": "Tを1つに決めにくいためコンパイルエラーになる"}, {"key": "4", "text": "0が出力される"}]'::jsonb, '{"A": "3"}', 'T mymax(T,T)では2つの引数は同じTとして推論されます。intとdoubleが混ざると型推論できずエラーになりやすいです。'),
  (53, '第13回', 'テンプレートクラス', 'medium', '次のプログラムの出力として正しいものはどれか。', 'template<class T>
class Box {
private:
  T value;
public:
  Box(T v) { value = v; }
  T get() { return value; }
};

int main() {
  Box<int> b(8);
  cout << b.get() << endl;
  return 0;
}', '[{"key": "1", "text": "8"}, {"key": "2", "text": "int"}, {"key": "3", "text": "Box"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'Box<int>なのでTはintになります。valueに8が入ります。'),
  (54, '第13回', 'テンプレートクラス', 'medium', '次のプログラムについて正しいものはどれか。', 'template<class T>
class Box {
public:
  T value;
};

int main() {
  Box b;
  return 0;
}', '[{"key": "1", "text": "正常にコンパイルされる"}, {"key": "2", "text": "テンプレート引数が指定されていないのでコンパイルエラー"}, {"key": "3", "text": "Tは自動的にintになる"}, {"key": "4", "text": "Tは自動的にdoubleになる"}]'::jsonb, '{"A": "2"}', 'テンプレートクラスを使うときは、基本的にBox<int>のように型を指定します。'),
  (55, '第13回', 'テンプレート宣言', 'easy', '関数をテンプレート化するとき、関数定義の前に書くものとして正しいものはどれか。', NULL, '[{"key": "1", "text": "template<class T>"}, {"key": "2", "text": "class template T"}, {"key": "3", "text": "function<T>"}, {"key": "4", "text": "template = T"}]'::jsonb, '{"A": "1"}', 'テンプレート関数では、関数定義の前に template<class T> のように書きます。'),
  (56, '第13回', 'テンプレート型', 'easy', 'テンプレートでよく使われるTの意味として正しいものはどれか。', NULL, '[{"key": "1", "text": "数値の合計"}, {"key": "2", "text": "型を表すパラメータ"}, {"key": "3", "text": "必ずint型"}, {"key": "4", "text": "必ず文字列型"}]'::jsonb, '{"A": "2"}', 'Tは型をあとから決めるためのパラメータとして使われます。'),
  (57, '第13回', 'テンプレート関数', 'medium', '次のプログラムの出力として正しいものはどれか。', 'template<class T>
void show(T x) {
  cout << x << endl;
}

int main() {
  show(10);
  show(''A'');
  return 0;
}', '[{"key": "1", "text": "10\nA"}, {"key": "2", "text": "A\n10"}, {"key": "3", "text": "10だけ"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "1"}', 'テンプレート関数は、intやcharなど複数の型で利用できます。'),
  (58, '第13回', 'テンプレートと文字列', 'hard', '次の説明として正しいものはどれか。', 'template<class T>
T mymax(T a, T b) {
  if (a > b) return a;
  return b;
}

// mymax("xyz", "abc") を呼ぶ場合', '[{"key": "1", "text": "文字列の辞書順で必ずxyzが選ばれる"}, {"key": "2", "text": "文字列の中身ではなくアドレス比較になる場合がある"}, {"key": "3", "text": "必ずコンパイルエラーになる"}, {"key": "4", "text": "必ずabcが選ばれる"}]'::jsonb, '{"A": "2"}', '文字列リテラルはポインタとして扱われるため、中身の辞書順比較ではなくアドレス比較になる場合があります。'),
  (59, '第13回', 'テンプレートクラス・Stack', 'medium', '次のプログラムの出力として正しいものはどれか。', 'template<class T>
class Stack {
private:
  int index;
  T buf[10];
public:
  Stack() { index = 0; }
  void push(T v) { buf[index++] = v; }
  T pop() { return buf[--index]; }
};

int main() {
  Stack<int> s;
  s.push(3);
  s.push(5);
  cout << s.pop() << endl;
  return 0;
}', '[{"key": "1", "text": "3"}, {"key": "2", "text": "5"}, {"key": "3", "text": "8"}, {"key": "4", "text": "コンパイルエラー"}]'::jsonb, '{"A": "2"}', 'スタックは後に入れたものが先に出ます。最後にpushした5がpopされます。'),
  (60, '第13回', 'テンプレートの目的', 'easy', 'テンプレートを使う目的として最も適切なものはどれか。', NULL, '[{"key": "1", "text": "型が違っても同じ処理手順を再利用するため"}, {"key": "2", "text": "privateをpublicにするため"}, {"key": "3", "text": "必ず実行速度を0にするため"}, {"key": "4", "text": "継承を禁止するため"}]'::jsonb, '{"A": "1"}', 'テンプレートは、型をパラメータ化して同じ処理を複数の型で使えるようにします。')
    ) AS t(question_order, source_round, topic, difficulty, question_text, code_block, choices_json, correct_answer, explanation)
  LOOP
    INSERT INTO public.questions (
      course_id,
      question_type,
      question_text,
      code_block,
      choices_json,
      correct_answer,
      explanation,
      topic,
      difficulty,
      source_round,
      answer_slots_json,
      is_active
    ) VALUES (
      v_course_id,
      'exam_shared_choice',
      r.question_text,
      r.code_block,
      r.choices_json,
      r.correct_answer,
      r.explanation,
      r.topic,
      r.difficulty,
      r.source_round,
      '["A"]'::jsonb,
      true
    )
    RETURNING id INTO v_question_id;

    INSERT INTO public.exam_questions (exam_id, question_id, question_order)
    VALUES (v_exam_id, v_question_id, r.question_order);
  END LOOP;
END
$do$;

-- Check result
SELECT
  c.slug,
  e.slug AS exam_slug,
  COUNT(eq.id) AS question_count
FROM public.courses c
JOIN public.exams e ON e.course_id = c.id
JOIN public.exam_questions eq ON eq.exam_id = e.id
WHERE c.slug = 'cpp-language-2'
GROUP BY c.slug, e.slug;
