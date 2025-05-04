export default function RequestRejected() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md dark:bg-gray-950 dark:border-gray-800">
        <h1 className="text-2xl font-semibold mb-3 text-red-600 dark:text-red-400">
          ❌ Account Request Rejected
        </h1>
        <p className="text-muted-foreground mb-2">Thank you for registering.</p>
        <p className="text-muted-foreground ">
          Your details were received, but your account request has been rejected
          by the administrator.
        </p>
      </div>
    </div>
  );
}
