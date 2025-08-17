import CategoryManager from "@/components/admin/category-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";



function SettingsPage() {

  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <div className="grid gird-cols-1 md:grid-cols-3 gap-5 mb-7">
        <Card className="bg-white mt-5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-blue-500"/>
              Total Users
            </CardTitle>
            <CardDescription>
              All registered users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">100</p>
          </CardContent>
        </Card>

        <Card className="bg-white mt-5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-blue-500"/>
              Total Assets
            </CardTitle>
            <CardDescription>
              All registered assets on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">1000</p>
          </CardContent>
        </Card>


      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Category Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryManager categories={[]}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default SettingsPage;