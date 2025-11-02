// pages/sitemap.xml.js
export const dynamic = 'force-dynamic'

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://www.househive.ai'

  // Optional: Fetch real data if you want to include properties or tasks dynamically
  // const properties = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`).then(r => r.json())

  const staticPages = [
    '',
    '/login',
    '/register',
    '/dashboard',
    '/properties',
    '/tenants',
    '/tasks',
    '/reminders',
    '/messages',
    '/billing',
    '/admin'
  ]

  const pagesXml = staticPages
    .map((path) => `
      <url>
        <loc>${baseUrl}${path}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>${path === '' ? '1.0' : '0.7'}</priority>
      </url>
    `)
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pagesXml}
    </urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
