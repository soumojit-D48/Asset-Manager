'use server'

import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";

export async function getCategoriesAction() {
    try {
        return db.select().from(category)
    } catch (e) {
        console.log(e);
        return []
        
    }
}