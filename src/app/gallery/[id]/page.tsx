
// this is a dynamic page so it will recive the params

import { getAssetByIdAction } from "@/actions/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Download, Info, Loader2, ShoppingCart, Tag } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";


interface GalleryDetailsPageProps {
	params: {
		id: string
	}
}

function GallaryDetailsPage({ params }: GalleryDetailsPageProps) {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[60vh]">
					<Loader2 className="h-8 w-8 animate-spin text-black" />
				</div>
			}
		>
			<GalleryContent params={params} />

		</Suspense>
	);
}

export default GallaryDetailsPage;

async function GalleryContent({ params }: GalleryDetailsPageProps) {

	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (session && session?.user?.role === 'admin') {
		redirect('/')
	}

	/// **** have to move some actions to dashboard from admin action ***
	const result = await getAssetByIdAction(params?.id)

	if (!result) {
		notFound()
	}
	// console.log("res: " ,result);

	const { asset, categoryName, userName, userImage, userId } = result
	// in prodhuct details page i uploaded any asset i shouldn't buy that asset

	const isAuthor = session?.user?.id === userId
	const initials = userName ?
		userName
			.split(" ")
			.map(n => n[0])
			.join("")
			.toUpperCase()
		: 'U'

		const hasPurchasedAsset = false


	return (
		<div className="min-h-screen container px-4 bg-white">
			<div className="container py-12">
				<div className="grid gap-12 md:grid-cols-3">
					<div className="md:col-span-2 space-y-8"> {/*left*/}
						<div className="rounded-lg overflow-hidden bg-gray-100 border">
							<Image
								src={asset.fileUrl}
								alt={asset.title}
								width={1200}
								height={800}
								className="w-full h-auto object-contain"
								priority
							/>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">{asset?.title}</h1>
							{
								categoryName && (
									<Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
										<Tag className="mr-1 h-4 w-4"/>
										{categoryName}
									</Badge>
								)
							}
						</div>
						<div >
							<p className="text-sm font-medium">{userName}</p>
							<p className="text-xs text-gray-500">Creator</p>
						</div>
					</div>

					<div className="space-y-6">  {/* right */}
						<div className="sticky top-24">
							<Card className="overflow-hidden border-0 shadow-lg rounded-xl">
								<div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
									<h3 className="text-xl font-bold mb-2">Premium Asset</h3>
									<div >
										<span className="text-3xl font-bold">$5.00</span>
										<span className="ml-3 text-gray-300">
											One Time Purchase
										</span>
									</div>
								</div>
								<CardContent className="p-6">
									<div className="space-y-4">
										{
											session?.user 
											?  
												isAuthor 
													? (
													<div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
														<Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0"/>
														<p className="text-sm">This is Your own asset. You can't Purchase your own asset</p>
													</div>
													) 
													: 
														hasPurchasedAsset
															? <Button asChild className="w-full bg-green-600 text-white h-12">
																<a download>
																	<Download className="mr-2 h-6 w-6"/>
																	Download Asset
																</a>
															</Button> 
															: <form>
																	<Button type="submit" className="w-full bg-black text-white h-12">
																		<ShoppingCart className="mr-2 h-6 w-6">

																		</ShoppingCart>
																	</Button>
															</form>
											: ( // when user is not logged in
												<>
													<Button 
														asChild 
														className="w-full bg-black text-white h-12"
													>
														<Link href="/login">
															Sign In to Purchase
														</Link>
													</Button>
												</>
												
											)
										}
									</div>
								</CardContent>
							</Card>
							
						</div>
					</div>

				</div>

			</div>
		</div>
	)
}