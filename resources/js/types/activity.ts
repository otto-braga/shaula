import { Person } from "./person";

export type Activity = {
    uuid: string;
    name: string;
    // person: Person;
}

// export function activityLabel(activity: Activity) {
//     if (activity.id < 0) return activity.name + ' (NOVO)';

//     return activity.name;
// }
