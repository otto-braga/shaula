import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteDialog from '../common/delete-dialog';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import { Person } from '@/types/person';
import { City } from '@/types/city';
import { FileCard } from './file-card';
import AuxDialogForm from '../aux-form/aux-dialog-form';

export type AdminIndexCardProps = {
    model: any;
    route_base_name: string;
    edit_route: string;
    show_route: string;
    is_aux?: boolean;
    has_show?: boolean;
    has_edit?: boolean;
    has_delete?: boolean;
};

export function AdminIndexCard(props : AdminIndexCardProps) {
    const is_aux = props.is_aux || false;
    const has_show = props.has_show || true;
    const has_edit = props.has_edit || true;
    const has_delete = props.has_delete || true;

    console.log(props);

    return (
        <Card key={props.model.uuid} className="flex flex-col justify-between">
            <CardHeader>

                <CardTitle className="items-center justify-center text-center mb-1">
                    <h3 className="line-clamp-1 font-semibold">{props.model.label ?? (props.model.title ?? props.model.name)}</h3>
                </CardTitle>

                <div className="text-sm text-gray-500 justify-center text-center">
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

            </CardHeader>

            {(props.model.primary_image?.path || props.model.content) ? (
                <CardContent className="flex h-full items-end">
                    {props.model.primary_image?.path ? (
                        <img src={`${props.model.primary_image.path}`} alt={props.model.title} className="w-full aspect-video rounded object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="aspect-video pb-2 line-clamp-5 text-sm text-gray-500"
                                dangerouslySetInnerHTML={{ __html: props.model.content }}
                            />
                            {props.model.file && (
                                <FileCard
                                    file={props.model.file}
                                    className="flex-1 h-32 w-full object-cover rounded-lg"
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            ) : (( props.model.description ? (
                <CardContent className="flex h-full items-end">
                    <div className="flex flex-col items-center justify-center w-full">
                        <div className="text-sm text-gray-500 line-clamp-5 pt-2 pb-2">
                            {props.model.description}
                        </div>
                    </div>
                </CardContent>
            ) : ( props.model.role && (
                    <CardContent className="flex h-full items-end">
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="text-sm text-gray-500 line-clamp-5 pt-2 pb-2">
                                {props.model.role.label}
                            </div>
                        </div>
                    </CardContent>
                )
            )))}

            <CardFooter>
                <div className="m-2 flex w-full h-10 justify-center gap-2">
                    { is_aux ? (
                        <AuxDialogForm
                            model={props.model}
                            title={props.model.title ?? props.model.name}
                            route_base_name={props.route_base_name}
                        />
                    ) : (<>
                        {props.has_edit && (
                            <Link href={route(props.edit_route, props.model)}>
                                <Button variant={'secondary'} className="h-full">
                                    <Edit />
                                </Button>
                            </Link>
                        )}

                        {props.has_show && (
                            <Link href={route(props.show_route, props.model)}>
                                <Button variant={'secondary'} className="h-full">
                                    <Eye />
                                </Button>
                            </Link>
                        )}
                    </>)}

                    {props.has_delete && (
                        <DeleteDialog
                            className="h-full"
                            resourceId={props.model.uuid}
                            resourceName={props.model.name ?? props.model.title}
                            deleteRoute={`${props.route_base_name}.destroy`}
                            onSuccess={() => window.location.reload()}
                        />
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
