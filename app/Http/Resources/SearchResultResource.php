<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SearchResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image_path = $this['primary_image_path'] ?? null;
        $file_path = $this['file_path'] ?? null;

        // Gerar URLs de forma segura, solução paliativa, selects com busca nao estavam funcionando
        $file_url = '';
        $primary_image_url = '';

        if (!empty($image_path)) {
            try {
                $primary_image_url = Storage::disk()->url($image_path);
            } catch (\Exception $e) {
                $primary_image_url = '';
            }
        }

        if (!empty($file_path)) {
            try {
                $file_url = Storage::disk()->url($file_path);
            } catch (\Exception $e) {
                $file_url = '';
            }
        }
        return [
            'uuid' => $this['uuid'] ?? '',
            'type' => $this['_federation']['indexUid'] ?? '',
            'slug' => $this['slug'] ?? '',
            'route_base_name' => $this['route_base_name'] ?? '',
            'route' => $this['route'] ?? '',

            'label' => $this['label'] ?? '',
            'name' => $this['name'] ?? '',
            'title' => $this['title'] ?? '',

            'content' => $this['content'] ?? '',
            'primary_image_path' => $image_path ?? '',
            #'primary_image_url' => asset(Storage::url($image_path)) ?? '',
            'primary_image_url' => $primary_image_url, // solução paliativa. search no select nao estava funcionando

            'periods' => $this['periods'] ?? [], // for Artwork, Person and HistoryArticle
            'categories' => $this['categories'] ?? [], // for Artwork, Review and HistoryArticle

            'authors' => $this['authors'] ?? [], // for Review, HistoryArticle and Artwork
            'cities' => $this['cities'] ?? [], // for Person
            'artworks' => $this['artworks'] ?? [], // for Person and Review

            #'file_path' => asset(Storage::url($file_path)) ?? '', // for Source
            'file_path' => $file_url, // solução paliativa. search no select nao estava funcionando
            'source_categories' => $this['source_categories'] ?? '', // for Source
        ];
    }
}
