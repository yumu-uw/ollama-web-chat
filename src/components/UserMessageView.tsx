import { memo } from "react";
import { Box, Flex } from "styled-system/jsx";

type Props = {
	message: string;
};

export const UserMessageView = memo(({ message }: Props) => {
	return (
		<Flex justify={"flex-end"}>
			<Box p={"0.5em"} my={"1em"} borderRadius={"md"} bg={"gray.200"}>
				{message.split(/\r?\n/).map((v, index) => {
					return (
						<p
							key={`preinput-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
						>
							{v}
						</p>
					);
				})}
			</Box>
		</Flex>
	);
});
