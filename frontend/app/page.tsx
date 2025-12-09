import Link from 'next/link';
import { createClient } from 'next-sanity';

// 1. Configure Sanity Client (Matches your env vars)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
});

// 2. Fetch Data Function
async function getPosts() {
  // This GROQ query fetches your WordPress posts
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...3] {
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      "imageUrl": mainImage.asset->url,
      body
    }
  `);
}

// 3. Main Page Component
export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="font-sans antialiased text-slate-800 bg-white">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                    <div className="bg-sky-600 text-white p-2 rounded-lg">
                        {/* Simple Icon using SVG instead of FontAwesome for React compatibility */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-900">Compu<span className="text-sky-600">Clinic</span></span>
                </div>
                <div className="hidden md:flex space-x-8 items-center">
                    <a href="#services" className="text-slate-600 hover:text-sky-600 font-medium transition">Services</a>
                    <a href="#blog" className="text-slate-600 hover:text-sky-600 font-medium transition">News</a>
                    <a href="#contact" className="bg-sky-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-sky-700 transition shadow-lg shadow-sky-500/30">
                        Book Repair
                    </a>
                </div>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900 via-slate-900 to-black"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sky-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Available for Emergency Support
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                We breathe life back into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">your technology.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                Expert diagnostics and rapid repairs for all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" className="px-8 py-4 rounded-full bg-sky-600 text-white font-bold text-lg hover:bg-sky-500 transition shadow-xl">
                    Start Your Repair
                </a>
            </div>
        </div>
      </section>

      {/* DYNAMIC SECTION: WordPress Content */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-sky-600 font-semibold tracking-wide uppercase">Latest Updates</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              From Our Tech Blog
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Content migrated directly from your WordPress site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition">
                  {/* Image Handler */}
                  <div className="h-48 bg-slate-200 w-full relative">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-sky-600 font-medium mb-2">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    {/* Render a snippet of the body? Portable Text is complex, so we just link for now */}
                    <Link href={`/posts/${post.slug}`} className="text-slate-600 hover:text-sky-600 font-medium inline-flex items-center gap-1">
                      Read Article 
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 bg-slate-50 rounded-lg border-dashed border-2 border-slate-200">
                <p className="text-slate-500">No posts found. Did you run the migration script?</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section (Static) */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-slate-900">Our Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Hardware Repair', 'Virus Removal', 'Data Recovery'].map((service, i) => (
                    <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{service}</h3>
                        <p className="text-slate-600">Professional {service.toLowerCase()} services for all devices.</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </main>
  );
}