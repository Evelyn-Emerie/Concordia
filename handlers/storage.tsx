import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserType = {
	id: string;
	username: string;
};

export class User {
	static user: UserType = {} as UserType;

	static async getUserObject() {
		if (!User.user.id) {
			User.user = await getUser();
		}

		return User.user;
	}

	static updateUserID(id: string) {
		User.user.id = id;
	}
}

const storeUser = async (user: UserType) => {
	try {
		await AsyncStorage.setItem("user", JSON.stringify(user));
		User.updateUserID(user.id);
	} catch (e) {
		console.error(e);
	}
};

const getUser = async () => {
	try {
		const userString = await AsyncStorage.getItem("user");

		if (!userString) return {};
		return JSON.parse(userString);
	} catch (e) {
		console.error(e);
	}
};

export class Token {
	static token: string;

	static async getToken() {
		if (!Token.token) {
			Token.token = await getToken();
		}
		return Token.token;
	}
}

const storeToken = async (token: string) => {
	try {
		await AsyncStorage.setItem("token", token);
	} catch (e) {
		console.error(e);
	}
};

const getToken = async () => {
	try {
		await storeToken("1234");
		const token = await AsyncStorage.getItem("token");
		return token ?? "";
	} catch (e) {
		console.error(e);
	}
	return ""; // Fixes typescript bullshit, do not REMOVE
};

export { storeUser, storeToken };
