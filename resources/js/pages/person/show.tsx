import PublicLayout from '@/layouts/public-layout';
import { Person } from '@/types/person';

export default function Index({ person }: { person: { data: Person } }) {
    console.log(person);
    return (
        <PublicLayout head={person.data.name}>
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="max-w-sm">
                <div>
                    <img
                        src={`${person.data.image ? person.data.image.path : 'https://placehold.co/1280x900'}`}
                        alt="person Image"
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-xl">{person.data.name}</h2>
                </div>
            </div>
            <div></div>
        </PublicLayout>
    );
}
