import { useEffect, useRef, useState } from "react";
import {
	Box,
	Circle,
	Container,
	Divider,
	Flex,
	styled,
} from "styled-system/jsx";
import "github-markdown-css/github-markdown-light.css";
import ChatView from "./components/ChatView";
import { MarkdownView } from "./components/MarkdownView";
import { UserMessageView } from "./components/UserMessageView";
import type { Chat, RequestData, ResponseData } from "./model/dataModels";

function App() {
	const [input, setInput] = useState("");
	const [prevInput, setPrevInput] = useState("");
	const [ollamaResopnse, setOllamaResopnse] = useState("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([
		{
			role: "system",
			content:
				"You are a helpful, respectful and honest coding assistant. Always reply using markdown. Be clear and concise, prioritizing brevity in your responses.",
		},
	]);

	const chatRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// テキストエリアの高さを自動調節
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	// チャットエリアを自動でスクロール
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [ollamaResopnse]);

	async function sendChat() {
		const msg = input;
		setInput("");
		const data: RequestData = {
			model: "qwen2.5-coder:7b",
			messages: [
				...chatHistory,
				{
					role: "user",
					content: msg,
				},
			],
			stream: true,
		};
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		};

		const decoder = new TextDecoder();
		const response = await fetch("http://localhost:11434/api/chat", options);
		const reader = response.body?.getReader();
		if (!reader) {
			console.error("No readable stream available.");
			return;
		}

		let output = "";
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			decoder
				.decode(value)
				.split(/\r?\n/)
				.map((v) => {
					if (v !== "") {
						const j = JSON.parse(v) as ResponseData;
						output += j.message.content;
						setOllamaResopnse((prev) => prev + j.message.content);
					}
				});
		}
		const newMessages: Chat[] = [
			...chatHistory,
			{
				role: "user",
				content: msg,
			},
			{
				role: "assistant",
				content: output,
			},
		];
		setOllamaResopnse("");
		setChatHistory(newMessages);
	}

	return (
		<Container>
			<Flex
				direction={"column"}
				gap={"8"}
				h={"100vh"}
				w={"100%"}
				padding={"1em"}
				justify={"space-between"}
			>
				<Box ref={chatRef} marginEnd={"auto"} overflow={"auto"} w={"100%"}>
					<ChatView chatHistory={chatHistory} />
					{ollamaResopnse !== "" && (
						<>
							<UserMessageView message={prevInput} />
							<MarkdownView mdStr={ollamaResopnse} />
						</>
					)}
				</Box>
				<Flex
					direction={"column"}
					gap={2}
					p={"0.5em"}
					borderRadius={"lg"}
					bg={"gray.100"}
				>
					<styled.textarea
						ref={textareaRef}
						placeholder="送信するメッセージ(Enterで改行、Alt+Enterで送信)"
						resize={"none"}
						rows={1}
						maxHeight={240}
						outline={{ _focus: "none" }}
						value={input}
						onKeyDown={(e) => {
							if (e.key === "Enter" && e.altKey) {
								e.preventDefault();
								sendChat();
							}
						}}
						onChange={(e) => {
							setInput(e.target.value);
							setPrevInput(e.target.value);
						}}
					/>
					<Divider />
					<Flex justify={"flex-end"}>
						<Circle bg="gray.300" w={"2em"} h={"2em"}>
							<styled.button onClick={sendChat}>
								<styled.img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LXVwIj48cGF0aCBkPSJtNSAxMiA3LTcgNyA3Ii8+PHBhdGggZD0iTTEyIDE5VjUiLz48L3N2Zz4=" />
							</styled.button>
						</Circle>
					</Flex>
				</Flex>
			</Flex>
		</Container>
	);
}

export default App;
