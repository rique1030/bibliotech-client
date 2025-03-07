export const CONFIG = Object.freeze({
	// SERVER_HOST: "http://10.0.1.1:5000",
	SERVER_HOST: "https://1a10-180-191-39-11.ngrok-free.app",
	// SERVER_HOST: "http://localhost:5000",
	// SERVER_HOST: "https://30bcd2f0-146f-45d8-869a-cc5efce948bc-00-3quc62jj4l21r.sisko.replit.dev",
	URL: {
		CATALOG: {
			GET_PAGED_BOOKS: "/record/paged_books:count",
			GET_BOOKS_BY_ID: "/catalog/fetch:id",
		},
		CATEGORY: {
			GET_CATEGORIES_BY_ID: "/category/fetch:id", //POST
		},
		COPY: {
			GET_COPIES_BY_CATALOG_ID: "/copy/fetch:catalog_id",
			GET_COPIES_BY_ACCESS_NUMBER: "/copy/fetch:access_number",
		},
		USER: {
			INSERT_MULTIPLE: "/user/insert",
			GET_USERS_BY_ID: "/user/fetch:id",
			GET_USER_BY_EMAIL_AND_PASSWORD: "/user/fetch:login",
		},
		// ROLE: {
		// 	GET_ROLES_BY_ID: "/roles/get_by_id", //POST
		// },
		// BOOK: {
		// 	GET_PAGED_BOOKS: "/books/get_paged", //POST
		// 	GET_BOOKS_BY_ID: "/books/get_by_id", //POST
		// 	GET_BOOKS_COUNT: "/records/get_book_count", //POST
		// },
	},
});
// TODO: Remove
// export const CONFIG = Object.freeze({
// 	SERVER_HOST: "http://localhost:5000",
// 	URL: {
// 		USER: {
// 			INSERT_MULTIPLE: "/user/insert", //POST
// 			GET_USERS_BY_ID: "/user/fetch:id", //POST
// 			GET_USER_BY_EMAIL_AND_PASSWORD: "/user/fetch:login", //POST
// 			GET_PAGED_USERS: "/user/paged", //POST
// 			UPDATE_USER: "/user/update", //POST
// 			DELETE_USER: "/user/delete", //POST
// 		},
// 		ROLE: {
// 			INSERT_MULTIPLE: "/role/insert", //POST
// 			GET_ALL_ROLES: "/role/get", //GET
// 			GET_PAGED_ROLES: "/role/paged", //POST
// 			GET_ROLES_BY_ID: "/role/fetch:id", //POST
// 			UPDATE_ROLE: "/role/update", //POST
// 			DELETE_ROLE: "/role/delete", //POST
// 		},
// 		CATALOG: {
// 			INSERT_MULTIPLE: "/catalog/insert", //POST
// 			GET_PAGED_BOOKS: "/catalog/paged", //POST
// 			GET_BOOKS_BY_ID: "/catalog/fetch:id", //POST
// 			UPDATE_BOOK: "/catalog/update", //POST
// 			DELETE_BOOK: "/catalog/delete", //POST
// 		},

// 		CATEGORY: {
// 			INSERT_MULTIPLE: "/category/insert", //POST
// 			GET_ALL_CATEGORIES: "/category/get", //GET
// 			GET_PAGED_CATEGORIES: "/category/paged", //POST
// 			GET_CATEGORIES_BY_ID: "/category/fetch:id", //POST
// 			UPDATE_CATEGORY: "/category/update", //POST
// 			DELETE_CATEGORY: "/category/delete", //POST
// 		},
// 		BOOK_CATEGORY: {
// 			INSERT_MULTIPLE: "/book_category/insert", //POST
// 			GET_BOOK_CATEGORIES_BY_ID: "/book_category/get", //POST
// 			GET_PAGED_BOOK_CATEGORIES: "/book_category/paged", //POST
// 			DELETE_BOOK_CATEGORY: "/book_category/delete", //POST
// 		},
// 		RECORDS: {
// 			GET_PAGED_BOOK_COPIES: "/record/paged_books:count", //POST
// 			GET_BORROWED_BOOKS: "/record/paged_borrowings", //POST
// 			GET_BOOK_CATEGORY_COUNT: "/record/paged_book_categories:count", //POST
// 		},
// 	},
// });

// export default CONFIG;

export default CONFIG;
