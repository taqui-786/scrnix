// ponytail: one process memory. Move this object to Postgres when counts must survive restarts or separate serverless instances.

type State = { downloads: number; ratings: number[]; comments: string[] };

const state: State = { downloads: 0, ratings: [], comments: [] };

export type Stats = {
	downloads: number;
	ratingCount: number;
	ratingAverage: number;
};

export function recordDownload() {
	state.downloads += 1;
	return stats();
}

export function stats(): Stats {
	const ratingCount = state.ratings.length;
	const ratingAverage = ratingCount
		? state.ratings.reduce((sum, rating) => sum + rating, 0) / ratingCount
		: 0;
	return { downloads: state.downloads, ratingCount, ratingAverage };
}

export function addFeedback(rating: unknown, comment: unknown): Stats | string {
	if (
		typeof rating !== "number" ||
		!Number.isInteger(rating) ||
		rating < 1 ||
		rating > 5
	) {
		return "Rating must be a whole number from 1 to 5.";
	}
	if (comment !== undefined && typeof comment !== "string") {
		return "Comment must be text.";
	}
	const text = typeof comment === "string" ? comment.trim() : "";
	if (text.length > 1000) return "Comment must be 1000 characters or fewer.";
	state.ratings.push(rating);
	if (text) state.comments.push(text);
	if (state.comments.length > 100) state.comments.shift();
	return stats();
}
