<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- IMPORTANTE
use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    use HasFactory;

    protected $table = 'itemcategory'; // <-- AQUI ESTÁ A SOLUÇÃO
    protected $primaryKey = 'category_id';
    protected $fillable = ['category_name', 'description'];

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}