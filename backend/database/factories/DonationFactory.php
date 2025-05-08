<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DonationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(2),
            'contact' => $this->faker->numerify(912345678), 
            'category_id' => 1, 
            'status_id' => 1,   
            'document' => null,
            'created_by' => 1, 
            'date' => now(),
        ];
    }
}
