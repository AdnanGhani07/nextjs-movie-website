import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900 bg-gray-50">
      <SignUp />
    </div>
  );
}
