<?php

namespace App\Traits;

trait HasLabel
{
    /**
     * Get the label for the model.
     *
     * @return string
     */
    public function getLabelAttribute()
    {
        $label = '';

        if (isset($this->title)) {
            $label = $this->title;
        } elseif (isset($this->name)) {
            $label = $this->name;
        }

        return $label;
    }
}
