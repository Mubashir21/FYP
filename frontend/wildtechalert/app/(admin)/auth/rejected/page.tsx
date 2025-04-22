export default function RequestRejected() {
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Account Request Rejected</h1>
      <p className="mb-4">
        Thank you for registering! Your information was recieved, but your
        account request was rejected by the administrator.
      </p>
      {/* <p>You'll receive an email when your account is activated.</p> */}
    </div>
  );
}
