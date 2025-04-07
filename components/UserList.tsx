"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { User } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteuser } from "@/app/actions";
import { useRouter } from "next/navigation";

// Use Prisma's generated type with additional properties for counts
type UserWithCounts = User & {
  _count: {
    comments: number;
    posts: number;
  };
};

interface UserListProps {
  initialUsers: UserWithCounts[];
}

export default function UserList({ initialUsers }: UserListProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteUser = async (id : string) => {
    if (!id) {
      toast.error("Id is required");
      return;
    }

    setLoading(true);
    try {
      const { success } = await deleteuser( id );
      console.log(success);
      if (success) {
        router.refresh();
        toast.success("User Deleted successfully");
      }
    } catch (error) {
      console.error("Error Deleting user:", error);
      toast.error((error as Error).message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm bg-white overflow-hidden border-0 pt-0">
      <CardHeader className="bg-blue-50 border-b px-6 py-5 rounded-none">
        <CardTitle className="text-xl text-blue-900">Users</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {initialUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            No users found. Create your first user!
          </div>
        ) : (
          <div className="space-y-4">
            {initialUsers.map((user) => (
              <div className="block" key={user.id}>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors group">
                  <div className="flex flex-row justify-between items-center">
                    <div className="font-medium text-lg text-gray-900 group-hover:text-blue-700">
                      {user.name || "No name"}
                    </div>

                    <Trash2 size={20} className="cursor-pointer" onClick={() => handleDeleteUser(user.id)}/>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{user.email}</div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="font-medium mr-1">Posts:</span>
                      <span className="text-blue-600 font-medium">
                        {user._count?.posts || 0}
                      </span>
                    </div>
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="font-medium mr-1">Comments:</span>
                      <span className="text-blue-600 font-medium">
                        {user._count?.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
