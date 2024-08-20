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
}

const storeUser = async (user: User) => {
	try {
		await AsyncStorage.setItem("user", JSON.stringify(user));
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

export { storeUser };
