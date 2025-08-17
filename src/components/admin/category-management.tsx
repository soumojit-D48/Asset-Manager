'use client'

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { useState } from "react";

type Category = {
    id: number,
    name: string,
    createdAt: Date
}

interface CategoryManagerProps {
  categories: Category[]
}

function CategoryManager({categories: initialCategories} : CategoryManagerProps) {
	const [categories, useCategories] = useState<Category[]>(initialCategories)
	const [newCategoryName, setNewCategoryName] = useState('')

	const handleAddNewCategory = async (event: React.FormEvent) => {
		event.preventDefault()

		try {
			const formData = new FormData()
			formData.append('name', newCategoryName)
		} catch (e) {
			console.log(e);
			
			
		}
	}

	return (
		<div className="space-y-6">
			<form onSubmit={handleAddNewCategory} className="space-y-4">
				<div className="space-y-2">
					<Label>
						New Category
					</Label>
					<div className="flex gap-2">
						<Input 
							id="categoryName"
							onChange={(e) => setNewCategoryName(e.target.value)}
							placeholder="Enter category name"	
						/>
						<Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
							<Plus className="h-4 w-4 mr-2" />
							Add 
						</Button>	
					</div>
				</div>
			</form>
		</div>
	);
}

export default CategoryManager;