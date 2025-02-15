import hljs from "@/lib/custom-highlight";
import type { Chat } from "@/model/dataModels";
import { memo, useEffect } from "react";
import { MarkdownView } from "./MarkdownView";
import { UserMessageView } from "./UserMessageView";

type Props = {
	chatHistory: Chat[];
};

const ChatView = memo(({ chatHistory }: Props) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		hljs.highlightAll();
	}, [chatHistory]);

	return (
		<>
			{chatHistory.map((value) => {
				if (value.role === "user") {
					return <UserMessageView message={value.content} />;
				}
				if (value.role === "assistant") {
					return <MarkdownView mdStr={value.content} />;
				}
			})}
		</>
	);
});

export default ChatView;
