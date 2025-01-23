import Link from "next/link"

const NotFound = () => {
  return (
    <section className="mx-auto min-h-[calc(100vh-var(--header-height))] bg-gray-100 flex justify-center items-center">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-black">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <Link href="/" className="btn btn-active btn-neutral">
            Go back to home page
          </Link>
        </div>   
</section>
  )
}

export default NotFound