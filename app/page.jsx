import Form from "@components/Form/Form";

/**
 * Force dynamic rendering for this page
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic'

/**
 * Home page component
 * Renders the main form component
 * @returns {JSX.Element} The home page component
 */
export default async function Home() {
  return (
    <main>
      <Form />
    </main>
  );
}
