import PublicLayout from '@/layouts/public-layout';
import { Person } from '@/types/person';

export default function Index({ person }: { person: { data: Person } }) {
    console.log(person);
    return (
        <PublicLayout head={person.data.name}>
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="grid p-4 md:grid-cols-2 md:p-8">
                <section>
                    <div className="grid grid-cols-3 gap-3 space-y-3">
                        <div>
                            <img
                                src={`${person.data.image ? person.data.image.path : 'https://placehold.co/1280x900'}`}
                                alt="person Image"
                                className="aspect-square w-full object-cover"
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <h2 className="text-lg font-medium">{person.data.name}</h2>
                            <p className=" ">{person.data.bio}</p>
                        </div>
                    </div>
                </section>
                <section></section>
            </div>
        </PublicLayout>
    );
}
