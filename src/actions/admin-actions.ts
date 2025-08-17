'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { category, user } from '@/lib/db/schema'
import { count, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import {z} from 'zod'

const CategorySchema = z.object({
    name: z
        .string()
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must be in 50 characters')
})

export type CategoryFormValues = z.infer<typeof CategorySchema>
// z.infer<typeof CategorySchema> automatically creates a TypeScript type from the Zod schema.
// type CategoryFormValues = { name: string }
// z.infer, the type always matches the schema automatically


export async function addNewCategoryAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user || session?.user?.role !== 'admin'){
        throw new Error('You must be an admin to add categories')
    }

    try {
        const name = formData.get('name') as string

        const validateFields = CategorySchema.parse({name}) // validate the name field form zod

        // name should be umique
        const existingCategory = await db.select().from(category).where(eq(category.name, validateFields.name)).limit(1)
        // db.select().from(category)...limit(1) returns an array of results.
        // [ { id: 1, name: "Books" } ]

        if(existingCategory.length > 0){
            return {
                success: false,
                message:  'Category already exists! Please try with a different name'
            }
        }
        await db.insert(category).values({
            name: validateFields.name
        })

        revalidatePath('/admin/settings')
        // in client side we can use router.refresh
        return {
            success: true,
            message:  'New Category added'
        }
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message:  'Failed to add category'
        }
    }
}

export async function getAllCategoriesAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user || session?.user?.role !== 'admin'){
        throw new Error('You must be an admin to access this data')
    }

    try {
        return await db.select().from(category).orderBy(category.name)
        // 
    } catch (e) {
        console.log(e);
        return []
    }
}

export async function getTotalUsesCountAction() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user || session?.user?.role !== 'admin'){
        throw new Error('You must be an admin to add categories')
    }

    try { // total user = uaers - admin
        const result = await db
            .select({count : sql<number>`count(*)`}) //  custom SQL to count rows
            .from(user)
            // [{ count: 42 }]

        return result[0]?.count || 0

    } catch (e) {
        console.log(e);
        return 0
    }
}

export async function deleteCategoryAction(categoryId: number) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user || session?.user?.role !== 'admin') {
        throw new Error('You must be an admin to delete category')
    }

    try {
        await db.delete(category).where(eq(category.id, categoryId))

        revalidatePath('/admin/settings')

        return {
            success: true,
            message: "Category deleted successfully!"
        }

    } catch (e) {
        console.log(e);
        return {
            success: false,
            message:  'Failed to delete category'
        }
    }
}