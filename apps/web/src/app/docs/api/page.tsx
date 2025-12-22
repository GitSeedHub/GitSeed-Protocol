export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold capitalize">api</h1>
      <p className="text-muted mt-4 leading-7">
        API: REST endpoints for projects, releases, attestations, and jobs. Auth via wallet signature or GitHub OAuth.
      </p>
    </div>
  );
}
