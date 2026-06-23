import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as getStudent } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as StudentShell } from "./StudentShell-DWrO16hP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.c-language-1.practice-D1KKMYFb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COUNTS = [
	10,
	20,
	50,
	100
];
var ROUNDS = [
	{
		key: "第1回",
		label: "第1回",
		desc: "C++の基本"
	},
	{
		key: "第2回",
		label: "第2回",
		desc: "関数・書式指定"
	},
	{
		key: "第3回",
		label: "第3回",
		desc: "文字列"
	},
	{
		key: "第4回",
		label: "第4回",
		desc: "ファイル入出力"
	},
	{
		key: "第5回",
		label: "第5回",
		desc: "vector / set"
	},
	{
		key: "第6回",
		label: "第6回",
		desc: "map / queue"
	}
];
var DIFFICULTIES = [
	{
		key: "mixed",
		label: "すべて"
	},
	{
		key: "easy",
		label: "easy"
	},
	{
		key: "medium",
		label: "medium"
	},
	{
		key: "hard",
		label: "hard"
	}
];
var TIMERS = [
	{
		key: 0,
		label: "なし"
	},
	{
		key: 10,
		label: "10分"
	},
	{
		key: 30,
		label: "30分"
	},
	{
		key: 60,
		label: "60分"
	},
	{
		key: 90,
		label: "90分"
	}
];
function Practice() {
	const [phase, setPhase] = (0, import_react.useState)("setup");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [selectedCount, setSelectedCount] = (0, import_react.useState)(10);
	const [selectedRounds, setSelectedRounds] = (0, import_react.useState)(ROUNDS.map((r) => r.key));
	const [difficulty, setDifficulty] = (0, import_react.useState)("mixed");
	const [selectedTimerMinutes, setSelectedTimerMinutes] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(null);
	const [availableQuestions, setAvailableQuestions] = (0, import_react.useState)([]);
	const [availableLoading, setAvailableLoading] = (0, import_react.useState)(true);
	const [courseId, setCourseId] = (0, import_react.useState)(null);
	const [attemptId, setAttemptId] = (0, import_react.useState)(null);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [idx, setIdx] = (0, import_react.useState)(0);
	const q = questions[idx];
	(0, import_react.useEffect)(() => {
		if (phase !== "practice") return;
		if (timeLeft === null) return;
		if (timeLeft <= 0) {
			toast.info("時間切れです。結果を表示します。");
			finishPractice();
			return;
		}
		const timerId = window.setInterval(() => {
			setTimeLeft((prev) => {
				if (prev === null) return null;
				return Math.max(prev - 1, 0);
			});
		}, 1e3);
		return () => window.clearInterval(timerId);
	}, [phase, timeLeft]);
	const answeredCount = (0, import_react.useMemo)(() => {
		return questions.filter((item) => answers[item.id]).length;
	}, [questions, answers]);
	const selectedAvailableCount = (0, import_react.useMemo)(() => {
		return availableQuestions.filter((item) => {
			const roundOk = selectedRounds.includes(item.source_round);
			const difficultyOk = difficulty === "mixed" || item.difficulty === difficulty;
			return roundOk && difficultyOk;
		}).length;
	}, [
		availableQuestions,
		selectedRounds,
		difficulty
	]);
	const correctCount = (0, import_react.useMemo)(() => {
		return questions.filter((item) => isCorrect(item, answers[item.id] ?? "")).length;
	}, [questions, answers]);
	const incorrectCount = (0, import_react.useMemo)(() => {
		return questions.filter((item) => {
			const answer = answers[item.id] ?? "";
			return answer && !isCorrect(item, answer);
		}).length;
	}, [questions, answers]);
	const unansweredCount = (0, import_react.useMemo)(() => {
		return questions.filter((item) => !answers[item.id]).length;
	}, [questions, answers]);
	function toggleRound(round) {
		setSelectedRounds((prev) => {
			if (prev.includes(round)) return prev.filter((item) => item !== round);
			return [...prev, round];
		});
	}
	function getRoundCount(roundKey) {
		return availableQuestions.filter((item) => {
			const roundOk = item.source_round === roundKey;
			const difficultyOk = difficulty === "mixed" || item.difficulty === difficulty;
			return roundOk && difficultyOk;
		}).length;
	}
	async function startPractice() {
		if (selectedRounds.length === 0) {
			toast.error("範囲を1つ以上選んでください");
			return;
		}
		const student = getStudent();
		if (!student) {
			toast.error("ログイン情報が見つかりません");
			return;
		}
		setLoading(true);
		try {
			const db = supabase;
			const { data: course, error: courseError } = await db.from("courses").select("id").eq("slug", "c-language-1").single();
			if (courseError || !course) {
				toast.error("コース情報を取得できませんでした");
				return;
			}
			let query = db.from("questions").select("*").eq("course_id", course.id).eq("is_active", true).eq("question_type", "random_multiple_choice").in("source_round", selectedRounds);
			if (difficulty !== "mixed") query = query.eq("difficulty", difficulty);
			const { data: loadedQuestions, error: questionError } = await query;
			if (questionError) {
				console.error(questionError);
				toast.error("問題を取得できませんでした");
				return;
			}
			const picked = shuffle(loadedQuestions ?? []).slice(0, selectedCount);
			if (picked.length === 0) {
				toast.error("選択した条件に合う問題がありません");
				return;
			}
			if (picked.length < selectedCount) toast.info(`選択された条件では ${picked.length} 問だけ見つかりました`);
			const { data: attempt, error: attemptError } = await db.from("attempts").insert({
				student_id: student.id,
				course_id: course.id,
				mode: "random"
			}).select().single();
			if (attemptError) console.warn(attemptError);
			setCourseId(course.id);
			setAttemptId(attempt?.id ?? null);
			setQuestions(picked);
			setAnswers({});
			setIdx(0);
			setTimeLeft(selectedTimerMinutes > 0 ? selectedTimerMinutes * 60 : null);
			setPhase("practice");
		} finally {
			setLoading(false);
		}
	}
	function selectAnswer(key) {
		if (!q) return;
		setAnswers((prev) => ({
			...prev,
			[q.id]: key
		}));
	}
	function goNext() {
		if (idx >= questions.length - 1) {
			finishPractice();
			return;
		}
		setIdx((prev) => prev + 1);
	}
	function goPrev() {
		setIdx((prev) => Math.max(0, prev - 1));
	}
	function stopNow() {
		if (window.confirm(`今すぐ終了しますか？\n\n回答済み: ${answeredCount} / ${questions.length}\n未回答: ${questions.length - answeredCount}\n\n未回答の問題は0点になります。`)) finishPractice();
	}
	async function finishPractice() {
		if (attemptId) {
			const rows = questions.map((item) => {
				const studentAnswer = answers[item.id] ?? "";
				return {
					attempt_id: attemptId,
					question_id: item.id,
					student_answer: studentAnswer,
					is_correct: isCorrect(item, studentAnswer)
				};
			});
			const { error } = await supabase.from("attempt_answers").insert(rows);
			if (error) console.warn(error);
		}
		setPhase("result");
	}
	if (phase === "setup") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses/c-language-1",
					className: "inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4",
					children: "← コースに戻る"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-primary font-medium",
					children: "Ｃ++言語Ⅰ / ランダム問題"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold mt-1",
					children: "ランダム問題の設定"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-3 leading-relaxed",
					children: "出題数、範囲、難易度を選んでから開始します。"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "出題数"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: COUNTS.map((count) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSelectedCount(count),
							className: `rounded-2xl border px-4 py-4 text-sm font-medium transition ${selectedCount === count ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`,
							children: [count, "問"]
						}, count))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "範囲"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
						children: ROUNDS.map((round) => {
							const checked = selectedRounds.includes(round.key);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleRound(round.key),
								className: `rounded-2xl border px-4 py-4 text-left transition ${checked ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: round.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground mt-1",
											children: round.desc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-primary mt-2 font-medium",
											children: availableLoading ? "読み込み中..." : `${getRoundCount(round.key)}問`
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-6 w-6 rounded-full border flex items-center justify-center text-xs ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border"}`,
										children: checked ? "✓" : ""
									})]
								})
							}, round.key);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "難易度"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: DIFFICULTIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDifficulty(item.key),
							className: `rounded-2xl border px-4 py-4 text-sm font-medium transition ${difficulty === item.key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`,
							children: item.label
						}, item.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "タイマー"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
							children: TIMERS.map((timer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelectedTimerMinutes(timer.key),
								className: `rounded-2xl border px-4 py-4 text-sm font-medium transition ${selectedTimerMinutes === timer.key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`,
								children: timer.label
							}, timer.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "タイマーを設定すると、時間切れで自動的に結果画面へ進みます。"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-primary/10 border border-primary/20 px-4 py-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: ["選択中の条件: ", availableLoading ? "読み込み中..." : `${selectedAvailableCount}問`]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-1",
						children: "出題数より少ない場合は、見つかった問題数だけで開始します。"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: startPractice,
					disabled: loading || selectedAvailableCount === 0,
					className: "w-full rounded-full bg-primary text-primary-foreground py-3 font-medium hover:opacity-90 disabled:opacity-60",
					children: loading ? "読み込み中..." : selectedAvailableCount === 0 ? "問題がありません" : "開始する"
				})
			]
		})]
	}) });
	if (phase === "result") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/courses/c-language-1",
					className: "inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4",
					children: "← コースに戻る"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-primary font-medium",
					children: "Ｃ++言語Ⅰ / ランダム問題"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold mt-1",
					children: "結果"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBox, {
							label: "正解",
							value: `${correctCount}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBox, {
							label: "不正解",
							value: `${incorrectCount}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBox, {
							label: "未回答",
							value: `${unansweredCount}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBox, {
							label: "点数",
							value: `${correctCount} / ${questions.length}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPhase("setup"),
							className: "rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium",
							children: "もう一度設定する"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/courses/c-language-1",
							className: "rounded-full bg-secondary px-5 py-2 text-sm",
							children: "コース選択へ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: startPractice,
							className: "rounded-full bg-secondary px-5 py-2 text-sm",
							children: "同じ条件で再開する"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: questions.map((item, index) => {
				const studentAnswer = answers[item.id] ?? "";
				const correct = isCorrect(item, studentAnswer);
				const correctKey = getCorrectKey(item);
				const isUnanswered = !studentAnswer;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium",
									children: ["問題 ", index + 1]
								}),
								item.source_round && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-3 py-1 text-xs",
									children: item.source_round
								}),
								item.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-3 py-1 text-xs",
									children: item.topic
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-3 py-1 text-xs font-medium ${correct ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.1_155)]" : isUnanswered ? "bg-secondary text-muted-foreground" : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.15_25)]"}`,
									children: correct ? "○ 正解" : isUnanswered ? "未回答" : "× 不正解"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap leading-relaxed",
							children: item.question_text
						}),
						item.code_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border",
							children: item.code_block
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: getChoices(item).map((choice) => {
								const isStudent = studentAnswer === choice.key;
								const isCorrectChoice = correctKey === choice.key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `rounded-2xl border px-4 py-3 text-sm ${isCorrectChoice ? "border-primary bg-primary/10" : isStudent ? "border-destructive/50 bg-destructive/10" : "border-border"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold mr-2",
											children: [choice.key, "."]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: choice.text }),
										isCorrectChoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-xs text-primary font-medium",
											children: "正解"
										}),
										isStudent && !isCorrectChoice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-xs text-destructive font-medium",
											children: "あなたの回答"
										})
									]
								}, choice.key);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-accent/60 px-4 py-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									"あなたの回答:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: studentAnswer || "未回答"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["正解: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: correctKey
								})] }),
								item.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 leading-relaxed",
									children: ["解説: ", item.explanation]
								})
							]
						})
					]
				}, item.id);
			})
		})]
	}) });
	if (!q) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-20 text-muted-foreground",
		children: "読み込み中..."
	}) });
	const selectedAnswer = answers[q.id] ?? "";
	const progress = Math.round((idx + 1) / questions.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:pr-[300px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-primary font-medium",
							children: "Ｃ++言語Ⅰ / ランダム問題"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-2xl font-bold mt-1",
							children: [
								"問題 ",
								idx + 1,
								" / ",
								questions.length
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground mt-1",
							children: [
								"回答済み: ",
								answeredCount,
								" / ",
								questions.length
							]
						}),
						timeLeft !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-semibold",
							children: ["残り時間: ", formatTime(timeLeft)]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: stopNow,
						className: "rounded-full bg-secondary px-4 py-2 text-sm",
						children: "今すぐ終了"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 rounded-full bg-secondary overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary transition-all",
						style: { width: `${progress}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 text-xs",
					children: [
						q.source_round && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary/10 text-primary px-3 py-1",
							children: q.source_round
						}),
						q.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-accent px-3 py-1",
							children: q.topic
						}),
						q.difficulty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-secondary px-3 py-1",
							children: q.difficulty
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base leading-relaxed whitespace-pre-wrap",
					children: q.question_text
				}),
				q.code_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border",
					children: q.code_block
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: getChoices(q).map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => selectAnswer(choice.key),
						className: `rounded-2xl border px-4 py-4 text-left text-sm transition ${selectedAnswer === choice.key ? "border-primary bg-primary/10" : "border-border hover:bg-accent"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold mr-3",
							children: [choice.key, "."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: choice.text })]
					}, choice.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: goPrev,
							disabled: idx === 0,
							className: "rounded-full bg-secondary px-5 py-2 text-sm disabled:opacity-40",
							children: "前の問題"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: goNext,
							className: "rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium",
							children: idx === questions.length - 1 ? "結果を見る" : "次の問題"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: stopNow,
							className: "rounded-full bg-secondary px-5 py-2 text-sm",
							children: "今すぐ終了"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:hidden rounded-3xl border border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold mb-3",
						children: "問題一覧"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionNumbers, {
						questions,
						answers,
						currentIndex: idx,
						onSelect: setIdx
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden lg:block fixed right-4 top-24 bottom-6 w-[260px] bg-card rounded-3xl shadow-[var(--shadow-card)] border border-border p-5 overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "問題一覧"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "問題番号から移動できます"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionNumbers, {
						questions,
						answers,
						currentIndex: idx,
						onSelect: setIdx
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: stopNow,
					className: "w-full mt-5 rounded-full bg-secondary px-4 py-2 text-sm",
					children: "今すぐ終了"
				})
			]
		})]
	}) });
}
function QuestionNumbers({ questions, answers, currentIndex, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-5 gap-2",
		children: questions.map((item, index) => {
			const answered = Boolean(answers[item.id]);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onSelect(index),
				className: `h-10 rounded-xl text-sm font-medium border transition ${index === currentIndex ? "bg-primary text-primary-foreground border-primary" : answered ? "bg-primary/10 text-primary border-primary/30" : "bg-background border-border hover:bg-accent"}`,
				children: index + 1
			}, item.id);
		})
	});
}
function ResultBox({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-accent/60 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl font-bold mt-1",
			children: value
		})]
	});
}
function getChoices(q) {
	if (!q) return [];
	const normalizeChoice = (choice) => ({
		key: String(choice.key ?? choice.id ?? ""),
		label: choice.label ? String(choice.label) : "",
		text: String(choice.text ?? "")
	});
	if (Array.isArray(q.choices_json)) return q.choices_json.map(normalizeChoice);
	try {
		const parsed = JSON.parse(String(q.choices_json));
		if (Array.isArray(parsed)) return parsed.map(normalizeChoice);
	} catch {
		return [];
	}
	return [];
}
function getCorrectKey(q) {
	if (!q) return "";
	const raw = q.correct_answer;
	if (raw && typeof raw === "object" && !Array.isArray(raw)) return String(raw.A ?? "");
	try {
		const parsed = JSON.parse(String(raw));
		if (parsed && typeof parsed === "object") return String(parsed.A ?? "");
	} catch {
		return String(raw ?? "");
	}
	return String(raw ?? "");
}
function isCorrect(q, answer) {
	if (!answer) return false;
	return String(answer).trim() === getCorrectKey(q).trim();
}
function shuffle(items) {
	return [...items].sort(() => Math.random() - .5);
}
function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return `${minutes}:${String(remainSeconds).padStart(2, "0")}`;
}
//#endregion
export { Practice as component };
