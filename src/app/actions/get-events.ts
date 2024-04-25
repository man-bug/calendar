import { db } from "@/lib/db";
import getSession from "./get-session";

export default async function getEvents() {
	const session = await getSession();
	if (!session) return [];

    const currentUser = session.user;
    if (!session.user.id) return []

	try {
		const events = await db.calendarEvent.findMany({
			orderBy: { createdAt: "desc" },
            where: {
				userId: currentUser.id,
			},

		});
		if (!events) return [];

		return events
	} catch (err: any) {
		return [];
	}
}

