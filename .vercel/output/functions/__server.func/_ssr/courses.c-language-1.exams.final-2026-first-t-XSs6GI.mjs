import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-zykuuG8H.mjs";
import { n as getStudent } from "./session-BcYkPPYI.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as StudentShell } from "./StudentShell-DWrO16hP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.c-language-1.exams.final-2026-first-t-XSs6GI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isAnswerCorrect(q, ans) {
	if (!ans) return false;
	const normalize = (value) => value.trim().toLowerCase().replaceAll("，", ",").replaceAll("、", ",").replaceAll(" ", "").replaceAll("　", "");
	function tryParseObject(value) {
		try {
			const parsed = JSON.parse(value);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
		} catch {
			return null;
		}
		return null;
	}
	const correctObject = tryParseObject(String(q.correct_answer));
	const answerObject = tryParseObject(ans);
	if (correctObject && answerObject) return Object.keys(correctObject).every((key) => {
		return normalize(String(answerObject[key] ?? "")) === normalize(String(correctObject[key] ?? ""));
	});
	return normalize(ans) === normalize(String(q.correct_answer));
}
var COMMON_CHOICES = [
	{
		key: "1",
		label: "ア",
		text: "cin >>"
	},
	{
		key: "2",
		label: "イ",
		text: "cout <<"
	},
	{
		key: "3",
		label: "ウ",
		text: "endl"
	},
	{
		key: "4",
		label: "エ",
		text: "if"
	},
	{
		key: "5",
		label: "オ",
		text: "else"
	},
	{
		key: "6",
		label: "カ",
		text: "while"
	},
	{
		key: "7",
		label: "キ",
		text: "for"
	},
	{
		key: "8",
		label: "ク",
		text: "%"
	},
	{
		key: "9",
		label: "ケ",
		text: "*"
	}
];
function ExamPage() {
	const navigate = useNavigate();
	const [exam, setExam] = (0, import_react.useState)(null);
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [attemptId, setAttemptId] = (0, import_react.useState)(null);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [activeSlot, setActiveSlot] = (0, import_react.useState)("A");
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const [score, setScore] = (0, import_react.useState)(0);
	const [isNavigatorOpen, setIsNavigatorOpen] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		loadExam();
	}, []);
	async function loadExam() {
		setLoading(true);
		const s = getStudent();
		if (!s) {
			setLoading(false);
			return;
		}
		const { data: e } = await supabase.from("exams").select("*").eq("slug", "final-2026-first").single();
		if (!e) {
			setLoading(false);
			return;
		}
		setExam(e);
		const { data: eq } = await supabase.from("exam_questions").select("question_order, questions(*)").eq("exam_id", e.id).order("question_order");
		const qs = (eq ?? []).map((r) => r.questions).filter(Boolean).filter((q) => q.question_type === "exam_shared_choice");
		setQuestions(qs);
		const { data: att } = await supabase.from("attempts").insert({
			student_id: s.id,
			course_id: e.course_id,
			exam_id: e.id,
			mode: "exam",
			total_questions: qs.length
		}).select().single();
		setAttemptId(att?.id ?? null);
		setLoading(false);
	}
	const q = questions[idx];
	const slots = getAnswerSlots(q);
	const currentAnswer = q ? answers[q.id] ?? {} : {};
	const choices = getChoices(q);
	const isFirstQuestion = idx === 0;
	const isLastQuestion = idx === questions.length - 1;
	function getAnswerSlots(question) {
		if (!question) return ["A"];
		if (Array.isArray(question.answer_slots_json)) return question.answer_slots_json.map(String);
		try {
			const parsed = JSON.parse(question.answer_slots_json);
			if (Array.isArray(parsed)) return parsed.map(String);
		} catch {
			return ["A"];
		}
		return ["A"];
	}
	function getChoices(question) {
		if (!question) return COMMON_CHOICES;
		if (Array.isArray(question.choices_json)) return question.choices_json;
		try {
			const parsed = JSON.parse(question.choices_json);
			if (Array.isArray(parsed)) return parsed;
		} catch {
			return COMMON_CHOICES;
		}
		return COMMON_CHOICES;
	}
	function selectChoice(choiceKey) {
		if (!q) return;
		setAnswers((prev) => ({
			...prev,
			[q.id]: {
				...prev[q.id] ?? {},
				[activeSlot]: choiceKey
			}
		}));
		const nextSlot = slots[slots.indexOf(activeSlot) + 1];
		if (nextSlot) setActiveSlot(nextSlot);
	}
	function nextQuestion() {
		if (!q) return;
		if (isLastQuestion) {
			submitExam();
			return;
		}
		setIdx((prev) => prev + 1);
		setActiveSlot("A");
	}
	function prevQuestion() {
		if (isFirstQuestion) return;
		setIdx((prev) => prev - 1);
		setActiveSlot("A");
	}
	function clearCurrentQuestion() {
		if (!q) return;
		setAnswers((prev) => ({
			...prev,
			[q.id]: {}
		}));
		setActiveSlot("A");
	}
	function isQuestionAnswered(question) {
		const questionAnswer = answers[question.id] ?? {};
		return getAnswerSlots(question).every((slot) => questionAnswer[slot]);
	}
	function jumpToQuestion(questionIndex) {
		setIdx(questionIndex);
		setActiveSlot("A");
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function submitExam() {
		if (!attemptId || submitting) return;
		setSubmitting(true);
		let calculatedScore = 0;
		const rows = questions.map((question) => {
			const studentAnswerObject = answers[question.id] ?? {};
			const studentAnswerText = JSON.stringify(studentAnswerObject);
			const correct = isAnswerCorrect(question, studentAnswerText);
			if (correct) calculatedScore++;
			return {
				attempt_id: attemptId,
				question_id: question.id,
				student_answer: studentAnswerText,
				is_correct: correct
			};
		});
		await supabase.from("attempt_answers").insert(rows);
		await supabase.from("attempts").update({
			score: calculatedScore,
			total_questions: questions.length,
			submitted_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", attemptId);
		setScore(calculatedScore);
		setFinished(true);
		setSubmitting(false);
		toast.success("提出しました");
	}
	function retryExam() {
		setAnswers({});
		setIdx(0);
		setActiveSlot("A");
		setFinished(false);
		setScore(0);
		loadExam();
	}
	function formatAnswer(value) {
		if (!value) return "未回答";
		if (typeof value === "string") try {
			const parsed = JSON.parse(value);
			if (parsed && typeof parsed === "object") {
				const entries = Object.entries(parsed);
				if (entries.length === 0) return "未回答";
				return entries.map(([key, val]) => `${key}=${val}`).join(", ");
			}
		} catch {
			return value || "未回答";
		}
		if (typeof value === "object") {
			const entries = Object.entries(value);
			if (entries.length === 0) return "未回答";
			return entries.map(([key, val]) => `${key}=${val}`).join(", ");
		}
		return String(value);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center py-20 text-muted-foreground",
		children: "読み込み中..."
	}) });
	if (!exam || questions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-bold",
				children: "試験問題が見つかりませんでした"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-2",
				children: "question_type が exam_shared_choice の問題を登録してください。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/courses/c-language-1" }),
				className: "mt-6 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium",
				children: "コースに戻る"
			})
		]
	}) });
	if (finished) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-4xl",
					children: "📝"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold mt-3",
					children: "試験結果"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: exam.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-accent p-6 mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: "点数"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-4xl font-bold mt-1",
						children: [
							score,
							" / ",
							questions.length
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-3 justify-center mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: retryExam,
						className: "rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium",
						children: "もう一度挑戦する"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/courses/c-language-1" }),
						className: "rounded-full bg-secondary px-6 py-2.5 text-sm font-medium",
						children: "コースに戻る"
					})]
				})
			]
		}), questions.map((question, i) => {
			const studentAnswer = answers[question.id] ?? {};
			const correct = isAnswerCorrect(question, JSON.stringify(studentAnswer));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-bold text-primary",
							children: ["問題 ", i + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-full px-3 py-1 text-xs font-medium ${correct ? "bg-[oklch(0.95_0.05_155)] text-[oklch(0.4_0.1_155)]" : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.15_25)]"}`,
							children: correct ? "正解" : "不正解"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap leading-relaxed",
						children: question.question_text
					}),
					question.code_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "bg-[oklch(0.96_0.015_15)] rounded-2xl p-4 text-sm overflow-x-auto font-mono border border-border whitespace-pre-wrap",
						children: question.code_block
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-accent p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-xs",
								children: "あなたの回答"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold mt-1",
								children: formatAnswer(studentAnswer)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-accent p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-xs",
								children: "正しい答え"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold mt-1",
								children: formatAnswer(question.correct_answer)
							})]
						})]
					}),
					question.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-secondary p-4 text-sm leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mb-1",
							children: "解説"
						}), question.explanation]
					})
				]
			}, question.id);
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-primary font-medium",
						children: "Ｃ++言語Ⅰ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold mt-1",
						children: exam.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: [
							"問題 ",
							idx + 1,
							" / ",
							questions.length
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:pr-[300px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 sm:p-8 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-bold text-primary",
								children: ["問題 ", idx + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 text-xs",
								children: [q.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-2.5 py-0.5",
									children: q.topic
								}), q.difficulty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2.5 py-0.5",
									children: q.difficulty
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-[260px] flex flex-col justify-center space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl sm:text-2xl font-semibold leading-relaxed whitespace-pre-wrap text-center",
									children: q.question_text
								}),
								q.code_block && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "bg-[oklch(0.96_0.015_15)] rounded-2xl p-5 text-sm sm:text-base overflow-x-auto font-mono border border-border whitespace-pre-wrap",
									children: q.code_block
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-accent p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground mb-3",
											children: "回答欄"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid sm:grid-cols-2 gap-3",
											children: slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setActiveSlot(slot),
												className: `rounded-2xl border p-4 text-left transition ${activeSlot === slot ? "border-primary bg-primary/10" : "border-border bg-background"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground",
													children: ["空欄 ", slot]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-3xl font-bold mt-1",
													children: currentAnswer[slot] || "未選択"
												})]
											}, slot))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: clearCurrentQuestion,
											className: "mt-3 rounded-full bg-secondary px-4 py-1.5 text-xs",
											children: "クリア"
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card rounded-3xl shadow-[var(--shadow-card)] p-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: "選択肢"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "まず空欄を選んでから、下の選択肢を押してください。"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid sm:grid-cols-3 gap-2",
							children: choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => selectChoice(choice.key),
								className: "rounded-2xl border border-border bg-accent/40 px-4 py-3 text-left text-sm transition hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold mr-2",
									children: [choice.key, "."]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: choice.text
								})]
							}, choice.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-3 justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: prevQuestion,
							disabled: isFirstQuestion,
							className: "rounded-full bg-secondary px-6 py-2.5 text-sm font-medium disabled:opacity-40",
							children: "前の問題"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: nextQuestion,
							disabled: submitting,
							className: "rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium disabled:opacity-60",
							children: isLastQuestion ? submitting ? "提出中..." : "提出する" : "次の問題"
						})]
					})
				]
			}),
			!isNavigatorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setIsNavigatorOpen(true),
				className: "fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-2xl bg-primary text-primary-foreground shadow-lg px-3 py-5 text-xl font-bold hover:opacity-90",
				"aria-label": "問題一覧を開く",
				children: "‹"
			}),
			isNavigatorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed right-4 top-24 bottom-6 z-50 w-[280px] rounded-3xl bg-card shadow-2xl border border-border p-5 space-y-4 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold text-primary",
							children: "問題一覧"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "番号から問題に移動できます。"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsNavigatorOpen(false),
							className: "h-8 w-8 rounded-lg bg-secondary text-sm font-bold hover:bg-accent transition",
							"aria-label": "問題一覧を閉じる",
							children: "×"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-5 gap-2",
						children: questions.map((question, questionIndex) => {
							const active = questionIndex === idx;
							const answered = isQuestionAnswered(question);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => jumpToQuestion(questionIndex),
								className: `h-10 rounded-xl text-sm font-bold border transition ${active ? "bg-primary text-primary-foreground border-primary" : answered ? "bg-primary/10 text-primary border-primary/30" : "bg-background border-border hover:bg-accent"}`,
								children: questionIndex + 1
							}, question.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-3 w-3 rounded bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "現在の問題" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-3 w-3 rounded bg-primary/20 border border-primary/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "回答済み" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-3 w-3 rounded bg-background border border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "未回答" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: submitExam,
						disabled: submitting,
						className: "w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-60",
						children: submitting ? "提出中..." : "提出する"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: "未回答の問題は、提出時に未回答として扱われます。"
					})
				]
			})
		]
	}) });
}
//#endregion
export { ExamPage as component };
