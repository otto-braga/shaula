import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Work } from '@/types/work';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Tabs from './Tabs';
import InputLabel from '@/Components/InputLabel';
import CreatableSelect from 'react-select/creatable';
import { City } from '@/types/city';
import InputError from '@/Components/InputError';
import { Language } from '@/types/language';
import { Input } from '@mui/material';
import { Category } from '@/types/category';
import { Award } from '@/types/award';
import { Label } from '@mui/icons-material';
import { Tag } from '@/types/tag';

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
}: PageProps<{
    work: { data: Work }
    cities?: { data: City[] },
    languages?: { data: Language[] },
    awards?: { data: Award[] },
    categories?: { data: Category[] },
    tags?: { data: Tag[] },
}>) {
    const { data, setData, post, errors, processing } = useForm({
        cities: work ? work.data.cities?.map((city) => ({ id: city.id, name: city.name, label: city.name })) : [],
        languages: work ? work.data.languages?.map((language) => ({ id: language.id, name: language.name, label: language.name })) : [],
        awards: work ? work.data.awards?.map((award) => ({ id: award.id, name: award.name, label: award.name })) : [],
        categories: work ? work.data.categories?.map((category) => ({ id: category.id, name: category.name, label: category.name })) : [],
        tags: work ? work.data.tags?.map((tag) => ({ id: tag.id, name: tag.name, label: tag.name })) : [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('work.update.relations', work.data.uuid));
    };

    function addNewCity(newCity: SelectOption) {
        if (data.cities.find((city) => city.name === newCity.name)) {
            return;
        }
        setData('cities', [...data.cities, newCity]);
    }

    function addNewLanguage(newLanguage: SelectOption) {
        if (data.languages.find((language) => language.name === newLanguage.name)) {
            return;
        }
        setData('languages', [...data.languages, newLanguage]);
    }

    function addNewAward(newAward: SelectOption) {
        if (data.awards.find((award) => award.name === newAward.name)) {
            return;
        }
        setData('awards', [...data.awards, newAward]);
    }

    function addNewCategory(newCategory: SelectOption) {
        if (data.categories.find((category) => category.name === newCategory.name)) {
            return;
        }
        setData('categories', [...data.categories, newCategory]);
    }

    function addNewTag(newTag: SelectOption) {
        if (data.tags.find((tag) => tag.name === newTag.name)) {
            return;
        }
        setData('tags', [...data.tags, newTag]);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    Editor
                </h2>
            }
        >
            <Head title={'Editor'} />

            <section className='py-12 px-4 text-gray-800 dark:text-gray-200'>
                <div className="mx-auto lg:px-8">
                    <div className='bg-white border p-3 rounded dark:border-gray-600 dark:bg-slate-800'>
                        <form onSubmit={submit} className="space-y-6 bg-inherit">

                            <Tabs work={work} processing={processing} />

                            <div>
                                <InputLabel htmlFor="cities" value="Cidades" />
                                <CreatableSelect
                                    id="cities"
                                    isMulti
                                    options={cities?.data.map((city) => ({ value: city.id, label: city.name }))}
                                    value={data.cities.map((city) => ({ value: city.id, label: city.label }))}
                                    onCreateOption={(name) => addNewCity({ id: 0, name: name, label: name + " (NOVO)" })}
                                    onChange={(options) => {setData('cities', options.map((option) => (
                                        { id: option.value, name: option.label, label: option.label }
                                    )));}}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.cities} />
                            </div>

                            <div>
                                <InputLabel htmlFor="languages" value="Linguagens" />
                                <CreatableSelect
                                    id="languages"
                                    isMulti
                                    options={languages?.data.map((language) => ({ value: language.id, label: language.name }))}
                                    value={data.languages.map((language) => ({ value: language.id, label: language.label }))}
                                    onCreateOption={(name) => addNewLanguage({ id: 0, name: name, label: name + " (NOVO)" })}
                                    onChange={(options) => {setData('languages', options.map((option) => (
                                        { id: option.value, name: option.label, label: option.label }
                                    )));}}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.languages} />
                            </div>

                            <div>
                                <InputLabel htmlFor="awards" value="Prêmios" />
                                <CreatableSelect
                                    id="awards"
                                    isMulti
                                    options={awards?.data.map((award) => ({ value: award.id, label: award.name }))}
                                    value={data.awards.map((award) => ({ value: award.id, label: award.label }))}
                                    onCreateOption={(name) => addNewAward({ id: 0, name: name, label: name + " (NOVO)" })}
                                    onChange={(options) => {
                                        setData('awards', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.awards} />
                            </div>

                            <div>
                                <InputLabel htmlFor="categories" value="Categorias" />
                                <CreatableSelect
                                    id="categories"
                                    isMulti
                                    options={categories?.data.map((category) => ({ value: category.id, label: category.name }))}
                                    value={data.categories.map((category) => ({ value: category.id, label: category.label }))}
                                    onCreateOption={(name) => addNewCategory({ id: 0, name: name, label: name + " (NOVO)" })}
                                    onChange={(options) => {
                                        setData('categories', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.categories} />
                            </div>

                            <div>
                                <InputLabel htmlFor="tags" value="Tags" />
                                <CreatableSelect
                                    id="tags"
                                    isMulti
                                    options={tags?.data.map((tag) => ({ value: tag.id, label: tag.name }))}
                                    value={data.tags.map((tag) => ({ value: tag.id, label: tag.label }))}
                                    onCreateOption={(name) => addNewTag({ id: 0, name: name, label: name + " (NOVO)" })}
                                    onChange={(options) => {
                                        setData('tags', options.map((option) => (
                                            { id: option.value, name: option.label, label: option.label }
                                        )));
                                    }}
                                    className='w-full'
                                />
                                <InputError className="mt-2" message={errors.tags} />
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    )
}