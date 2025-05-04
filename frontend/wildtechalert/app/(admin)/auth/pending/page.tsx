export default function PendingApproval() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-md dark:bg-gray-950 dark:border-gray-800">
        <h1 className="text-2xl font-semibold mb-3 text-foreground">
          🚧 Account Pending Approval
        </h1>
        <p className="text-muted-foreground mb-2">
          Thank you for registering! Your account is currently awaiting
          administrator approval.
        </p>
        <p className="text-muted-foreground">
          You will receive an email as soon as your account is activated.
        </p>
      </div>
    </div>
  );
}
