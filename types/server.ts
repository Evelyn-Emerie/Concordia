import T_Channel from "./channel";

type T_Server = {
	id: number;
	accessToken: string;
	title: string;
	ip: string;
	iconURL?: string;
	channels: T_Channel[];
};

export default T_Server;
