import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Work } from '@/types/work';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Select from 'react-select';
import { handleReactSelectStyling } from '@/utils/react-select-styling';
import Tabs from './tabs';
import InputError from '@/components/input-error';
import { City } from '@/types/city';
import { Language } from '@/types/language';
import { Award } from '@/types/award';
import { Category } from '@/types/category';
import { Tag } from '@/types/tag';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Produções',
        href: '/admin/work',
    },
];

type SelectOption = {
    id: number,
    name: string,
    label: string,
}
export default function Index({
    work,
    cities,
    languages,
    awards,
    categories,
    tags,
}: {
    work: { data: Work }
    cities?: { data: City[] },
    languages?: { data: Language[] },
    awards?: { data: Award[] },
    categories?: { data: Category[] },
    tags?: { data: Tag[] },
}) {
    const { data, setData, post, errors, processing } = useForm({
        cities: work ? work.data.cities?.map((city) => ({ id: city.id, name: city.name, label: city.name })) : [],
        languages: work ? work.data.languages?.map((language) => ({ id: language.id, name: language.name, label: language.name })) : [],
        awards: work ? work.data.awards?.map((award) => ({ id: award.id, name: award.name, label: award.name })) : [],
        categories: work ? work.data.categories?.map((category) => ({ id: category.id, name: category.name, label: category.name })) : [],
        tags: work ? work.data.tags?.map((tag) => ({ id: tag.id, name: tag.name, label: tag.name })) : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('work.update.relations', work.data));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produções" />
            <section className="px-4 py-12 text-gray-800 dark:text-gray-200">
                <div className="mx-auto lg:px-8">
                    <div className="">
                        <form onSubmit={submit} className="space-y-6 bg-inherit">
                            <Tabs work={work} processing={processing} />

                            <div>
                                <Label htmlFor="cities">Cidades</Label>
                                <Select
                                    id="cities"
                                    isMulti
                                    options={cities?.data.map((city) => ({ value: city.id, label: city.name }))}
                                    value={data.cities.map((city) => ({ value: city.id, label: city.label }))}
                                    onChange={(options) => {setData('cities', options.map((option) => (
                                        { id: option.value, name: option.label, label: option.label }
                                    )));}}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.cities} />
                            </div>

                            <div>
                                <Label htmlFor="languages">Linguagens</Label>
                                <Select
                                    id="languages"
                                    isMulti
                                    options={languages?.data.map((language) => ({ value: language.id, label: language.name }))}
                                    value={data.languages.map((language) => ({ value: language.id, label: language.label }))}
                                    onChange={(options) => {setData('languages', options.map((option) => (
                                        { id: option.value, name: option.label, label: option.label }
                                    )));}}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.languages} />
                            </div>

                            <div>
                                <Label htmlFor="awards">Prêmios</Label>
                                <Select
                                    id="awards"
                                    isMulti
                                    options={awards?.data.map((award) => ({ value: award.id, label: award.name }))}
                                    value={data.awards.map((award) => ({ value: award.id, label: award.label }))}
                                    onChange={(options) => {
                                        setData('awards', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.awards} />
                            </div>

                            <div>
                                <Label htmlFor="categories">Categorias</Label>
                                <Select
                                    id="categories"
                                    isMulti
                                    options={categories?.data.map((category) => ({ value: category.id, label: category.name }))}
                                    value={data.categories.map((category) => ({ value: category.id, label: category.label }))}
                                    onChange={(options) => {
                                        setData('categories', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.categories} />
                            </div>

                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Select
                                    id="tags"
                                    isMulti
                                    options={tags?.data.map((tag) => ({ value: tag.id, label: tag.name }))}
                                    value={data.tags.map((tag) => ({ value: tag.id, label: tag.label }))}
                                    onChange={(options) => {
                                        setData('tags', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    styles={handleReactSelectStyling()}
                                />
                                <InputError className="mt-2" message={errors.tags} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}