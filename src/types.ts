export type Position = "left" | "right";

export interface OpenMiniMessage {
	action: "openMini";
	url: string;
	position: Position;
}
