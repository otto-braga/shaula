import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteDialog from '../common/delete-dialog';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { Person } from '@/types/person';
import { City } from '@/types/city';

export type AdminIndexCardProps = {
    model: any;
    edit_route: string;
    show_route: string;
};

export function AdminIndexCard(props : AdminIndexCardProps) {
    return (
        <Card key={props.model.uuid} className="flex flex-col justify-between">
            <CardHeader>

                <CardTitle className="items-center justify-center text-center mb-3">
                    <h3 className="line-clamp-1 font-semibold">{props.model.title ?? props.model.name}</h3>
                </CardTitle>

                {props.model.primary_image?.path ? (
                    <img src={`${props.model.primary_image.path}`} alt={props.model.title} className="aspect-square rounded object-cover" />
                ) : (
                    <div className="flex aspect-square items-center justify-center rounded bg-gray-800/50 text-white/50">
                        Sem imagem
                    </div>
                )}

            </CardHeader>

            <CardContent>
                <div className="text-xs text-gray-500 justify-center text-center">
                    {props.model.date && (
                        <p>{new Date(props.model.date).toLocaleDateString()}</p>
                    )}
                    {props.model.date_of_birth && (
                        <p>
                            {new Date(props.model.date_of_birth).toLocaleDateString()}
                            {props.model.date_of_death && (<>
                                - {new Date(props.model.date_of_death).toLocaleDateString()}
                            </>)
                            }
                        </p>
                    )}
                </div>

                {props.model.authors && props.model.authors.length > 0 ? (
                    <div className="text-sm justify-center text-center">
                        <p>{props.model.authors.map((author: Person) => author.name).join(', ')}</p>
                    </div>
                ) : (
                    props.model.cities && props.model.cities.length > 0 ? (
                        <div className="text-sm justify-center text-center">
                            <p>{props.model.cities.map((city: City) => city.name).join(', ')}</p>
                        </div>
                    ) : null
                )}

                {/* {props.model.content && (
                    <div className="line-clamp-3 text-xs text-gray-500 justify-center text-center"
                        dangerouslySetInnerHTML={{ __html: props.model.content }}
                    />
                )} */}
            </CardContent>

            <CardFooter>
                <div className="mt-2 flex w-full justify-end gap-2">
                    <Link href={route(props.show_route, props.model)}>
                        <Button variant={'secondary'}>
                            <Eye className="h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href={route(props.edit_route, props.model)}>
                        <Button variant={'secondary'}>
                            <Edit className="h-5 w-5" />
                        </Button>
                    </Link>
                    <DeleteDialog
                        resourceId={props.model.uuid}
                        resourceName={props.model.title}
                        deleteRoute="reviews.destroy"
                        onSuccess={() => window.location.reload()}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
