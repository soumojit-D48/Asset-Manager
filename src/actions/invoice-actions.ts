'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, invoice, payment, purchase, user } from "@/lib/db/schema";
import { generateInvoiceHtml } from "@/lib/invoice/invoice-html-generator";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {v4 as uuidv4} from 'uuid'

export async function createInvoiceAction(purchaseId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false, error: 'Not authenticateed'
            }
            // or direct redirect('/login')
        }

        const [purchaseData] = await db
            .select({
                purchase: purchase,
                asset: asset,
                payment: payment,
                user: user
            })
            .from(purchase)
            .innerJoin(asset, eq(purchase.assetId, asset.id))
            .innerJoin(payment, eq(purchase.paymentId, payment.id))
            .innerJoin(user, eq(purchase.userId, user.id))
            .where(eq(purchase.id, purchaseId))
            .limit(1)

        if (!purchaseData) {
            return {
                success: false, error: 'Purchase not found'
            }
        }

        if (purchaseData.purchase.userId !== session.user.id && session.user.role !== 'admin') { // admin can create invoice for any user // but not other user can
            return {
                success: false, error: 'You are not authorized to create invoice'
            }
        }

        const invoiceNumber = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`

        const htmlContent = generateInvoiceHtml(
            invoiceNumber,
            new Date(purchaseData.purchase.createdAt),
            purchaseData.asset.title,
            purchaseData.purchase.price / 100
        )

        
        const [newInvoice] = await db
            .insert(invoice)
            .values({
                id: uuidv4(),
                invoiceNumber,
                purchaseId: purchaseData.purchase.id,
                userId: purchaseData.user.id,
                // amount: purchaseData.purchase.price,
                currency: 'USD',
                status: 'paid',
                htmlContent,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning()
        

        revalidatePath('/dashboard/purchases')

        return {
            success: true,
            invoiceId: newInvoice.id
        }

    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: 'Failed to create invoice'
        }
    }
}

export async function getUserInvoicesAction() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false, 
                error: 'Not authenticateed'
            }
        }

        const userInvoices = await db
            .select()
            .from(invoice)
            .where(eq(invoice.userId, session.user.id))
            .orderBy(invoice.createdAt)

        return {
            success: true,
            invoices: userInvoices
        }
        
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: 'Failed to get user invoices'
        }
    }
}

export async function getInvoiceHtmlAction(invoiceId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Not authenticateed'
            }
        } 

        const [invoiceData] = await db
            .select()
            .from(invoice)
            .where(eq(invoice.id, invoiceId))
            .limit(1)

        if (!invoiceData) {
            return {
                success: false,
                error: 'Invoice not found'
            }
        }

        if(
            invoiceData.userId !== session.user.id &&
            session.user.id !== 'admin'
        ) {
            return {
                success: false,
                error: 'Not authenticated'
            }
        }

        if(!invoiceData.htmlContent){
            return{
                success: false,
                error: 'Invlice html content not found'
            }
        }

        return {
                success: true,
                html : invoiceData.htmlContent
            }

    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: 'Failed to get invoice html'
        }
    }
}


export async function invoiceDataById(invoiceId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Not authenticateed'
            }
        } 

        const [invoiceData] = await db
            .select()
            .from(invoice)
            .where(eq(invoice.id, invoiceId))
            .limit(1)

        if (!invoiceData) {
            return {
                success: false,
                error : 'Invoice not found'
            }
        }

        if(
            invoiceData.userId !== session.user.id &&
            session.user.id !== 'admin'
        ) {
            return {
                success: false,
                error : "Not authenticated"
            }
        }

        return {
            success: true,
            invoice : invoiceData
        }

    } catch (e) {
        
    }
}