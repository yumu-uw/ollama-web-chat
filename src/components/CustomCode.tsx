import { supportLangs } from "@/lib/custom-highlight";
import { useState } from "react";
import { Box, Flex, styled } from "styled-system/jsx";

interface Props {
	classAttr: string | undefined;
	value: React.ReactNode;
}

// const Tooltip = ({
// 	text,
// 	isVisible,
// 	children,
// }: { text: string; isVisible: boolean; children: React.ReactNode }) => {
// 	return (
// 		<Box position="relative" display="inline-block">
// 			{children}
// 			{isVisible && (
// 				<Box
// 					position="absolute"
// 					top="100%"
// 					left="50%"
// 					transform="translateX(-50%)"
// 					mb="4px"
// 					bg="gray.800"
// 					color="white"
// 					px="8px"
// 					py="4px"
// 					borderRadius="md"
// 					fontSize="sm"
// 					whiteSpace="nowrap"
// 					boxShadow="md"
// 					zIndex="10"
// 				>
// 					{text}
// 				</Box>
// 			)}
// 		</Box>
// 	);
// };

export default function CustomCode({ classAttr, value }: Props) {
	const [hasCopied, setHasCopied] = useState<boolean>(false);

	const classNames =
		classAttr !== undefined ? classAttr.split(":") : ["nohighlight", undefined];
	const lang = supportLangs[classNames[0] as string]
		? classNames[0]
		: "language-plaintext";
	if (classNames[0] === "nohighlight") {
		return <code className={classNames[0]}>{value}</code>;
	}

	const handleCopyButton = async () => {
		setHasCopied(true);
		await navigator.clipboard.writeText(value?.toString() as string);
		setTimeout(() => {
			setHasCopied(false);
		}, 1500);
	};
	return (
		<Flex direction={"column"} gap={4}>
			<Flex
				justify="space-between"
				mt={"-16px"}
				mx={"-16px"}
				pt={"16px"}
				px={"16px"}
				bgColor={"gray.300"}
				fontWeight={"bold"}
			>
				<styled.p marginEnd={"auto"}>{classAttr?.split("-")[1]}</styled.p>
				{!hasCopied && (
					<Box verticalAlign={"middle"}>
						<styled.button onClick={handleCopyButton}>
							<styled.img
								display={"inline!"}
								src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsaXBib2FyZC1jb3B5Ij48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSI4IiB5PSIyIiByeD0iMSIgcnk9IjEiLz48cGF0aCBkPSJNOCA0SDZhMiAyIDAgMCAwLTIgMnYxNGEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJ2LTIiLz48cGF0aCBkPSJNMTYgNGgyYTIgMiAwIDAgMSAyIDJ2NCIvPjxwYXRoIGQ9Ik0yMSAxNEgxMSIvPjxwYXRoIGQ9Im0xNSAxMC00IDQgNCA0Ii8+PC9zdmc+"
							/>
						</styled.button>
						コピーする
					</Box>
				)}
				{hasCopied && (
					<Box verticalAlign={"middle"}>
						<styled.img
							display={"inline!"}
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZWNrIj48cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiLz48L3N2Zz4="
						/>
						コピーしました！
					</Box>
				)}
			</Flex>
			<code className={lang}>{value}</code>
		</Flex>
	);
}
