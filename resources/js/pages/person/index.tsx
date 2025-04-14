import PublicLayout from '@/layouts/public-layout';
import { Person } from '@/types/person';
import { Link } from '@inertiajs/react';

export default function Index({ people }: { people: { data: Person[] } }) {
    console.log(people);

    return (
        <PublicLayout head="Pessoas">
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="grid grid-cols-4 gap-4">
                {people.data.map((person) => (
                    <Link key={person.id} href={`/pessoas/${person.id}`} className="relative">
                        <div>
                            <div>
                                <img
                                    src={`${person.image ? person.image.path : 'https://placehold.co/1280x900'}`}
                                    alt="person Image"
                                    className="aspect-square w-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl">{person.name}</h2>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </PublicLayout>
    );
}
